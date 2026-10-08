package br.com.sondsp.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.persistence.criteria.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class SpecificationFilter {

    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    public static class FilterColumn {
        String filterKey;       // Nome do campo
        String attributeName;   // Nome do atributo na Entidade
        String joinRelation;    // Nome do relacionamento no Root
        JoinType joinType;      // Tipo Join (INNER, LEFT, RIGHT)


        public FilterColumn(String filterKey, String attributeName) {
            this.filterKey = filterKey;
            this.attributeName = attributeName;
            this.joinRelation = null;
            this.joinType = null;
        }

        public FilterColumn(String filterKey, String joinRelation, String attributeName, JoinType joinType) {
            this.filterKey = filterKey;
            this.joinRelation = joinRelation;
            this.attributeName = attributeName;
            this.joinType = joinType;
        }

        public boolean isJoin() {
            return this.joinRelation != null;
        }
    }

    public <T> Specification<T> buildFilter(Object filter, List<FilterColumn> filterColumns){
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = filter != null
                    ? buildPredicates(filter, criteriaBuilder, root, filterColumns)
                    : new ArrayList<>();

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private <T> List<Predicate> buildPredicates(
            Object filter,
            CriteriaBuilder builder,
            Root<T> root,
            List<FilterColumn> filterColumns
    ){
        List<Predicate> predicates = new ArrayList<>();
        Map<String, Object> filterMap = objectMapper.convertValue(filter, new TypeReference<>() {});

        if (Boolean.TRUE.equals(isGeneralFilter(filterMap))){
            String generalFilter = (String) filterMap.get("search");
            String filterPattern = "%" + generalFilter.toLowerCase() + "%";
            List<Predicate> orPredicates = new ArrayList<>();

            filterColumns.forEach((column) -> {
                Predicate predicate = buildPredicate(builder, root, filterPattern, column, generalFilter);
                if (predicate != null) orPredicates.add(predicate);
            });

            if (!orPredicates.isEmpty()) {
                predicates.add(builder.or(orPredicates.toArray(new Predicate[0])));
            }

        } else {
            filterMap.forEach((columnKey, filterValue) -> {
                if (!"search".equals(columnKey) && filterValue != null && !filterValue.toString().isBlank()) {

                    FilterColumn filterColumn = filterColumns.stream()
                            .filter(col -> col.filterKey.equals(columnKey))
                            .findFirst()
                            .orElse(null);

                    if (filterColumn != null) {
                        String rawValue = filterValue.toString();
                        String filterPattern = "%" + rawValue.toLowerCase() + "%";
                        Predicate predicate = buildPredicate(builder, root, filterPattern, filterColumn, rawValue);
                        if (predicate != null) predicates.add(predicate);
                    }
                }
            });
        }

        return predicates;
    }

    private Boolean isGeneralFilter(Map<String, Object> filterMap){
        Object generalFilter = filterMap.get("search");
        return generalFilter != null && !generalFilter.toString().isBlank();
    }

    private <T> Predicate buildPredicate(
            CriteriaBuilder criteriaBuilder,
            Root<T> root,
            String filterPattern,
            FilterColumn column,
            String rawFilterValue
    ){
        Path<?> path;

        if (column.isJoin()) {
            Join<Object, Object> expressionJoin = root.join(column.joinRelation, column.joinType);
            path = expressionJoin.get(column.attributeName);
        } else {
            path = root.get(column.attributeName);
        }

        Class<?> javaType = path.getJavaType();

        if (javaType.equals(Boolean.class) || javaType.equals(boolean.class)) {
            String term = rawFilterValue.toLowerCase().trim();

            if (term.equals("true") || "ativo".contains(term)) {
                return criteriaBuilder.isTrue(path.as(Boolean.class));
            }
            else if (term.equals("false") || "inativo".contains(term)) {
                return criteriaBuilder.isFalse(path.as(Boolean.class));
            }

            return null;
        }

        return criteriaBuilder.like(criteriaBuilder.lower(path.as(String.class)), filterPattern);
    }
}