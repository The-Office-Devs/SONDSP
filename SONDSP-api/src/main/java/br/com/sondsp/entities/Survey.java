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
public class Survey {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_aplicador", referencedColumnName = "id")
    private Users administrator;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_estudante", referencedColumnName = "id")
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
    // TODO: Adicionar converter
    private Boolean isDigital;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_atividade", referencedColumnName = "id")
    private Activity activity;
}
