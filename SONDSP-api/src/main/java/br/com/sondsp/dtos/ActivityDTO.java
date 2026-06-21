package br.com.sondsp.dtos;

import br.com.sondsp.entities.Activity;
import br.com.sondsp.entities.User;

public record ActivityDTO(
        Integer id,
        User creator,
        String name,
        String subject,
        String axis,
        String model,
        Boolean status
) {
    public ActivityDTO(Activity activity){
        this(
                activity.getId(),
                activity.getCreator(),
                activity.getName(),
                activity.getSubject(),
                activity.getAxis(),
                activity.getModel(),
                activity.getStatus()
        );
    }
}
