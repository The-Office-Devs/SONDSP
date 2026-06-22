package br.com.sondsp.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "turma")
public class SchoolClass {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_escola", referencedColumnName = "id", updatable = false)
    private School school;

    @Column(name = "nome")
    private String name;

    @Column(name = "ano_letivo")
    private String schoolYear;

    @Column(name = "status")
    private Boolean status;
}
