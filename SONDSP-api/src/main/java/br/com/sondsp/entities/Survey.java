package br.com.sondsp.entities;

import br.com.sondsp.form.SurveyForm;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "atividade")
public class Survey {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_aplicador", referencedColumnName = "id")
    private User administrator;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_aluno", referencedColumnName = "id")
    private Student student;

    @Column(name = "materia")
    private String subject;

    @Column(name = "eixo")
    private String axis;

    @Column(name = "resultado")
    private String result;

    @Column(name = "observacoes")
    private String observations;

    @Column(name = "imagem_sondagem")
    private String surveyImage;

    @Column(name = "ind_digital")
    private Boolean isDigital;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_atividade", referencedColumnName = "id")
    private Activity activity;

    @Column(name = "status")
    private Boolean status;

    public Survey(SurveyForm form){
        Survey.builder()
                .subject(form.subject())
                .axis(form.axios())
                .result(form.result())
                .observations(form.observations())
                .surveyImage(form.surveyImage())
                .isDigital(form.isDigital())
                .build();
    }

    public static Survey buildUpdatedSurvey(SurveyForm form, User administrator, Student student, Activity activity){
        return Survey.builder()
                .administrator(administrator)
                .student(student)
                .subject(form.subject())
                .axis(form.axios())
                .result(form.result())
                .observations(form.observations())
                .surveyImage(form.surveyImage())
                .isDigital(form.isDigital())
                .activity(activity)
                .build();

    }
}
