package br.com.sondsp.dtos;


import br.com.sondsp.entities.Activity;

public record ActivityDTO(
        Integer id,
        String name,
        StrandDTO strand,
        String gradeLevel,
        String bimester,
        Boolean status
) {
    public ActivityDTO(Activity activity){
        this(
                activity.getId(),
                activity.getName(),
                new StrandDTO(activity.getStrand()),
                activity.getGradeLevel(),
                activity.getPeriod(),
                activity.getStatus()
        );
    }
}