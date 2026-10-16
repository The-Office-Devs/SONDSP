package br.com.sondsp.entities;

import br.com.sondsp.entities.enums.EnrollmentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "aluno_x_turma")
public class StudentEnrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_aluno", referencedColumnName = "id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_turma", referencedColumnName = "id")
    private SchoolClass schoolClass;

    @Column(name = "ano_letivo", length = 4, nullable = false)
    private String schoolYear;

    @Column(name = "descricao_externa")
    private String externalDescription;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_matricula", length = 20, nullable = false)
    private EnrollmentStatus status;

    @Column(name = "data_inicio")
    private LocalDate startDate;

    @Column(name = "data_fim")
    private LocalDate endDate;
}
