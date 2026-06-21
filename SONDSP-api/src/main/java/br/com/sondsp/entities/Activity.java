package br.com.sondsp.entities;

import br.com.sondsp.form.ActivityForm;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "atividade")
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_criador", referencedColumnName = "id")
    private User creator;

    @Column(name = "nome")
    private String name;

    @Column(name = "materia")
    private String subject;

    @Column(name = "eixo")
    private String axis;

    @Column(name = "model")
    private String model;

    @Column(name = "status")
    private Boolean status;

    public Activity(ActivityForm form, User creator) {
        Activity.builder()
                .creator(creator)
                .subject(form.subject())
                .axis(form.axis())
                .model(form.model())
                .status(form.status())
                .build();

    }

    public static Activity builderUpdatedActivity(ActivityForm activityForm, Activity activity) {
        return Activity.builder()
                .id(activity.id)
                .creator(activity.creator)
                .name(activityForm.name())
                .subject(activityForm.subject())
                .axis(activityForm.axis())
                .model(activityForm.model())
                .status(activityForm.status())
                .build();
    }
}
