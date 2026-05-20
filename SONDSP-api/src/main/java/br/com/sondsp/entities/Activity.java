package br.com.sondsp.entities;

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
    private Users creator;

    @Column(name = "nome")
    private String name;

    @Column(name = "materia")
    private String subject;

    @Column(name = "eixo")
    private String axis;

    @Column(name = "model")
    private String model;
}
