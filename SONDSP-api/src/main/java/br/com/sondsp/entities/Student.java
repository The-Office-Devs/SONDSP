package br.com.sondsp.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "aluno")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "nome")
    private String name;

    @Column(name = "matricula")
    private String registration;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_turma", referencedColumnName = "id")
    private SchoolClass schoolClass;

    @Column(name = "num_chamada")
    private Integer rowNumber;

    @Column(name = "data_nascimento")
    private LocalDate birthDate;

    @Column(name = "data_inclusao_turma")
    private LocalDate classEntryDate;

    @Column(name = "status")
    private Boolean status;
}
