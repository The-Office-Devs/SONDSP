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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_turma", referencedColumnName = "id")
	private SchoolClass schoolClass;

	@Column(name = "status")
	private Boolean status;

	@Column(name = "bimestre_aplicacao")
	private String applicationPeriod;

	@Column(name = "data")
	private LocalDateTime date;

	@Column(name = "resposta")
	private String response;

	@Column(name = "ind_fechada")
	private Boolean isClosed;

	public Survey(SurveyForm form, User administrator, Student student, Activity activity) {
		this.administrator = administrator;
		this.student = student;
		this.activity = activity;
		this.schoolClass = student != null ? student.getSchoolClass() : null;
		this.result = form.result();
		this.notes = form.notes();
		this.isDigital = false;
		this.status = false;
		this.isClosed = false;
		this.applicationPeriod = form.applicationPeriod();
		this.date = LocalDateTime.now();
	}

	public Survey(SurveyForm form, User administrator, Student student, Activity activity, SchoolClass schoolClass) {
		this(form, administrator, student, activity);
		if (schoolClass != null) {
			this.schoolClass = schoolClass;
		}
	}
}
