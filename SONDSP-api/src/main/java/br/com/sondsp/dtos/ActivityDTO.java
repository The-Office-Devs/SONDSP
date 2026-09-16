package br.com.sondsp.dtos;


import br.com.sondsp.entities.Activity;

public record ActivityDTO(
        Integer id,
        String name,
        StrandDTO strand,
        String schoolYear,
        String bimester,
        String activityModelRef,
        Boolean status
) {
    public ActivityDTO(Activity activity){
        this(
                activity.getId(),
                activity.getName(),
                new StrandDTO(activity.getStrand()),
                activity.getSchoolYear(),
                activity.getPeriod(),
                activity.getStrandImagePath(),
                activity.getStatus()
        );
    }
}