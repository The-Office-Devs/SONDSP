package br.com.sondsp.services;

import br.com.sondsp.entities.Activity;
import br.com.sondsp.entities.User;
import br.com.sondsp.filters.ActivityFilter;
import br.com.sondsp.form.ActivityForm;
import br.com.sondsp.repositories.ActivityRepository;
import br.com.sondsp.util.SpecificationFilter;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

import static br.com.sondsp.util.SystemMessages.ACTIVITY_NOT_FOUND;

@Service
@AllArgsConstructor
public class ActivityService {
    private ActivityRepository activityRepository;
    private SpecificationFilter specificationFilter;

    public Activity createActivity(ActivityForm activityForm, User creator) {
        return activityRepository.save(new Activity(activityForm, creator));
    }

    public Activity updateActivity(Integer idActivity, ActivityForm form){
        Activity activity = findActivityById(idActivity);
        Activity activityUpdated = Activity.builderUpdatedActivity(form, activity.getCreator());
        activityUpdated.setId(activity.getId());
        return activityRepository.save(activityUpdated);
    }

    public void deleteActivity(Integer idActivity) {
        Activity activity = findActivityById(idActivity);
        activity.setStatus(false);
        activityRepository.save(activity);
    }

    public List<Activity> listActivities(ActivityFilter filter){
        List<String> activityColumns = List.of("name", "subject", "axis", "model");
        Specification<Activity> specification = specificationFilter.buildFilter(filter, activityColumns);
        return activityRepository.findAll(specification);
    }

    private Activity findActivityById(Integer idActivity){
        return activityRepository.findById(idActivity).orElseThrow(
                () -> new EntityNotFoundException(ACTIVITY_NOT_FOUND)
        );
    }
}
