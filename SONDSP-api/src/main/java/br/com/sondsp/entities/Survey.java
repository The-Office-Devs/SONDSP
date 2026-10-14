package br.com.sondsp.entities;

import br.com.sondsp.form.SurveyForm;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

	@Column(name = "bimestre_aplicacao")
	private String applicationPeriod;

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
		this.applicationPeriod = form.applicationPeriod();
        this.date = LocalDateTime.now();
	}
}
