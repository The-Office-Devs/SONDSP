package br.com.sondsp.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Table(name = "usuario_x_turma")
public class UserSchoolClass {
    @Builder.Default
    @EmbeddedId
    @EqualsAndHashCode.Include
    private UserSchoolClassId id = new UserSchoolClassId();

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "id_usuario")
    private User user;

    @ManyToOne
    @MapsId("schoolClassId")
    @JoinColumn(name = "id_turma")
    private SchoolClass schoolClass;

    @Column(name = "atuacao")
    private String atuacao;
}
