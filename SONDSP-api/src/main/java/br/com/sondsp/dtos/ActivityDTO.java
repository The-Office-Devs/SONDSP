package br.com.sondsp.dtos;

import br.com.sondsp.entities.Activity;
import br.com.sondsp.entities.User;

public record ActivityDTO(
        Integer id,
        Integer creatorId,
        String creatorName,
        String name,
        String subject,
        String axis,
        String model,
        Boolean status
) {
    public ActivityDTO(Activity activity){
        this(
                activity.getId(),
                activity.getCreator() != null ? activity.getCreator().getId() : null,
                activity.getCreator() != null ? activity.getCreator().getName() : null,
                activity.getName(),
                activity.getSubject(),
                activity.getAxis(),
                activity.getModel(),
                activity.getStatus()
        );
    }
}
