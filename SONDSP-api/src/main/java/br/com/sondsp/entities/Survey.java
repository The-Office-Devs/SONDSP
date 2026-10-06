package br.com.sondsp.entities;

import br.com.sondsp.form.SurveyForm;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "sondagem")
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

    @Column(name = "resultado")
    private String result;

    @Column(name = "observacoes")
    private String notes;

    @Column(name = "imagem_sondagem")
    private String surveyImagePath;

    @Column(name = "ind_digital")
    private Boolean isDigital;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_atividade", referencedColumnName = "id")
    private Activity activity;

    @Column(name = "status")
    private Boolean status;

    @Column(name = "data")
    private LocalDateTime date;

    public Survey(SurveyForm form, User administrator, Student student, Activity activity) {
        this.administrator = administrator;
        this.student = student;
        this.activity = activity;
        this.result = form.result();
        this.notes = form.notes();
        this.isDigital = form.isDigital();
        this.status = false;
        this.date = LocalDateTime.now();
    }
}
