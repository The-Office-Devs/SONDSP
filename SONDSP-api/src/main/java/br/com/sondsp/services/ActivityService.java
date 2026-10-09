package br.com.sondsp.services;

import br.com.sondsp.entities.*;
import br.com.sondsp.filters.ActivityFilter;
import br.com.sondsp.form.ActivityForm;
import br.com.sondsp.repositories.ActivityRepository;
import br.com.sondsp.repositories.StrandRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static br.com.sondsp.util.SystemConstants.IMAGE_URL_EXPIRATION_TIME;
import static br.com.sondsp.util.SystemMessages.*;

@Service
@RequiredArgsConstructor
public class ActivityService {
    @Autowired
    private ActivityRepository activityRepository;
    @Autowired
    private StrandRepository strandRepository;
    @Autowired
    private SupabaseStorageService storageService;

    public Activity registerActivity(ActivityForm activityForm, User creator) throws IOException {
        Strand strand = getStrand(activityForm.strandId());
        Activity activity = new Activity(activityForm, strand, creator);

        if (activityForm.activityModelFile() != null && !activityForm.activityModelFile().isEmpty()) {
            String savedImagePath = storageService.uploadImage(activityForm.activityModelFile());
            activity.setStrandImagePath(savedImagePath);
        }

        return activityRepository.save(activity);
    }

    public Activity getActivity(Integer id) {
        return  activityRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(ACTIVITY_NOT_FOUND)
        );
    }

    public String getActivityImageSignedUrl(Integer id) {
        Activity activity = getActivity(id);

        if (activity.getStrandImagePath() == null || activity.getStrandImagePath().isBlank()) {
            return null;
        }

        return storageService.generateSignedUrl(activity.getStrandImagePath(), IMAGE_URL_EXPIRATION_TIME);
    }

    private Strand getStrand(Integer id) {
        return strandRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(STRAND_NOT_FOUND)
        );
    }

    public Page<Activity> getActivities(ActivityFilter filter, Pageable pageable) {
        Specification<Activity> spec = this.buildFilter(filter);
        return activityRepository.findAll(spec, pageable);
    }

    public Activity changeActivityStatus(Integer idActivity) {
        Activity activity = getActivity(idActivity);
        activity.setStatus(!activity.getStatus());
        return activityRepository.save(activity);
    }

    private Specification<Activity> buildFilter(ActivityFilter filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter == null)
                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));

            if (filter.search() != null && !filter.search().isBlank()) {
                Join<Activity, Strand> strandJoin = root.join("strand", JoinType.INNER);

                String search = filter.search().toLowerCase();
                String searchPattern = "%" + search + "%";

                List<Predicate> orPredicates = new ArrayList<>();
                orPredicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), searchPattern));
                orPredicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("gradeLevel")), searchPattern));
                orPredicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("period")), searchPattern));
                orPredicates.add(criteriaBuilder.like(criteriaBuilder.lower(strandJoin.get("subject")), searchPattern));
                orPredicates.add(criteriaBuilder.like(criteriaBuilder.lower(strandJoin.get("name")), searchPattern));

                Boolean status = null;
                if ("ativo".startsWith(search)) {
                    status = true;
                } else if ("inativo".startsWith(search)) {
                    status = false;
                }

                if (status != null)
                    orPredicates.add(criteriaBuilder.equal(root.get("status"), status));

                predicates.add(criteriaBuilder.or(orPredicates.toArray(new Predicate[0])));
            } else {
                if (filter.name() != null && !filter.name().isBlank())
                    predicates.add(criteriaBuilder.like(criteriaBuilder
                            .lower(root.get("name")), "%" + filter.name().toLowerCase() + "%"));

                if (filter.gradeLevel() != null && !filter.gradeLevel().isBlank())
                    predicates.add(criteriaBuilder.like(criteriaBuilder
                            .lower(root.get("gradeLevel")), "%" + filter.gradeLevel().toLowerCase() + "%"));

                if (filter.bimester() != null && !filter.bimester().isBlank())
                    predicates.add(criteriaBuilder.like(criteriaBuilder
                            .lower(root.get("period")), "%" + filter.bimester().toLowerCase() + "%"));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}