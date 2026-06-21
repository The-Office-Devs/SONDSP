package br.com.sondsp.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class SpecificationFilter {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public <T> Specification<T> buildFilter(Object filter, List<String> activityColumns){
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = filter != null
                    ? buildPredicates(filter, criteriaBuilder, root, activityColumns)
                    : new ArrayList<>();

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private <T> List<Predicate> buildPredicates(
            Object filter,
            CriteriaBuilder builder,
            Root<T> root,
            List<String> activityColumns
    ){
        List<Predicate> predicates = new ArrayList<>();

        Map<String, Object> filterMap = objectMapper.convertValue(filter, new TypeReference<>() {});

        if (Boolean.TRUE.equals(isGeneralFilter(filterMap))){
            String generalFilter = (String) filterMap.get("generalFilter");
            String filterPattern = "%" + generalFilter.toLowerCase() + "%";
            List<Predicate> orPredicates = new ArrayList<>();

            activityColumns.forEach((column) -> {
                Predicate predicate = buildPredicate(builder, root, filterPattern, column);
                orPredicates.add(predicate);
            });

            if (!orPredicates.isEmpty()) {
                Predicate combinedSearchPredicate = builder.or(orPredicates.toArray(new Predicate[0]));
                predicates.add(combinedSearchPredicate);
            }

        } else {
            filterMap.forEach((columnName, filterValue) -> {
                if (!"generalFilter".equals(columnName) && filterValue != null && !filterValue.toString().isBlank()) {
                    Predicate predicate = buildPredicate(builder, root, filterValue.toString(), columnName);
                    predicates.add(predicate);
                }
            });
        }

        return predicates;
    }

    private Boolean isGeneralFilter(Map<String, Object> filterMap){
        Object generalFilter = filterMap.get("generalFilter");
        return generalFilter != null && !generalFilter.toString().isBlank();
    }

    private <T> Predicate buildPredicate(
            CriteriaBuilder criteriaBuilder,
            Root<T> root,
            String filterPattern,
            String columnName
    ){
        return criteriaBuilder.like(criteriaBuilder.lower(root.get(columnName)), filterPattern);
    }
}