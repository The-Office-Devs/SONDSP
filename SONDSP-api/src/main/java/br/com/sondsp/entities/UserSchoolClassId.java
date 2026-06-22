package br.com.sondsp.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class UserSchoolClassId {
    @Column(name = "id_usuario")
    private Integer userId;

    @Column(name = "id_escola")
    private Integer schoolClassId;
}