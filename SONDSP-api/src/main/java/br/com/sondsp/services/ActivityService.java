package br.com.sondsp.services;

import br.com.sondsp.entities.Activity;
import br.com.sondsp.entities.User;
import br.com.sondsp.filters.ActivityFilter;
import br.com.sondsp.form.ActivityForm;
import br.com.sondsp.repositories.ActivityRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static br.com.sondsp.util.SystemMessages.ACTIVITY_NOT_FOUND;

@Service
@AllArgsConstructor
public class ActivityService {
    private ActivityRepository activityRepository;

    public Activity createActivity(ActivityForm activityForm, User creator) {
        return activityRepository.save(new Activity(activityForm, creator));
    }

    public Activity updateActivity(Integer idActivity, ActivityForm form){
        Activity activityUpdated = Activity.builderUpdatedActivity(form, findActivityById(idActivity));
        return activityRepository.save(activityUpdated);
    }

    public void deleteActivity(Integer idActivity) {
        Activity activity = findActivityById(idActivity);
        activity.setStatus(false);
        activityRepository.save(activity);
    }

    public List<Activity> listActivities(ActivityFilter filter){
        Specification<Activity> specification = buildFilter(filter);
        return activityRepository.findAll(specification);
    }

    private Activity findActivityById(Integer idActivity){
        return activityRepository.findById(idActivity).orElseThrow(
                () -> new EntityNotFoundException(ACTIVITY_NOT_FOUND)
        );
    }

    private Specification<Activity> buildFilter(ActivityFilter filter){
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = filter != null
                    ? buildPredicates(filter, criteriaBuilder, root)
                    : new ArrayList<>();

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private List<Predicate> buildPredicates(
            ActivityFilter filter,
            CriteriaBuilder builder,
            Root<Activity> root
    ){
        List<Predicate> predicates = new ArrayList<>();
        List<String> activityColumns = List.of("name", "subject", "axis", "model");

        if (Boolean.TRUE.equals(isGeneralFilter(filter))){
            String filterPattern = "%" + filter.generalFilter().toLowerCase() + "%";
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
            Map<String, String> columnFilters = Map.of(
                    "name", filter.name(),
                    "subject", filter.subject(),
                    "axis", filter.axis(),
                    "model", filter.model()
            );

            columnFilters.forEach((columnName, filterValue) -> {
                if (filterValue != null && !filterValue.isBlank()) {
                    Predicate predicate = buildPredicate(builder, root, filterValue, columnName);
                    predicates.add(predicate);
                }
            });
        }

        return predicates;
    }

    private Boolean isGeneralFilter(ActivityFilter filter){
        return filter.generalFilter() == null || filter.generalFilter().isBlank();
    }

    private Predicate buildPredicate(
            CriteriaBuilder criteriaBuilder,
            Root<Activity> root,
            String filterPattern,
            String columnName
    ){
        return criteriaBuilder.like(criteriaBuilder.lower(root.get(columnName)), filterPattern);
    }
}
