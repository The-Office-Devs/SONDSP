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

    @Column(name = "modelo")
    private String model;

    @Column(name = "status")
    private Boolean status;

    public Activity(ActivityForm form, User creator) {
        this.creator = creator;
        this.name = form.name();
        this.subject = form.subject();
        this.axis = form.axis();
        this.model = form.model();
        this.status = form.status();
    }

    public static Activity builderUpdatedActivity(ActivityForm activityForm, User creator) {
        return Activity.builder()
                .creator(creator)
                .name(activityForm.name())
                .subject(activityForm.subject())
                .axis(activityForm.axis())
                .model(activityForm.model())
                .status(activityForm.status())
                .build();
    }
}
