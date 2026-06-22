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
@Table(name = "usuario_x_escola")
public class UserSchool {
    @Builder.Default
    @EmbeddedId
    private UserSchoolId id = new UserSchoolId();

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "id_usuario")
    private User user;

    @ManyToOne
    @MapsId("schoolId")
    @JoinColumn(name = "id_escola")
    private School school;

    @Column(name = "atuacao")
    private String atuacao;
}
