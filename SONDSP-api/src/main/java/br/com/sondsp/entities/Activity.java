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

    @Column(name = "nome")
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_eixo", referencedColumnName = "id")
    private Strand strand;

    @Column(name = "imagem_ref")
    private String strandImagePath;

    @Column(name = "ativo")
    private Boolean status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_criador", referencedColumnName = "id")
    private User creator;

    @Column(name = "ano_escolar")
    private String schoolYear;

    @Column(name = "bimestre")
    private String period;

    public Activity(ActivityForm form, Strand strand, User creator) {
        this.name = form.name();
        this.strand = strand;
        this.creator = creator;
        this.schoolYear = form.schoolYear();
        this.period = form.bimester();
        this.status = true;
    }
}
