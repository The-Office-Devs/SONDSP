package br.com.sondsp.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserSchoolId {
    @Column(name = "id_usuario")
    private Long userId;

    @Column(name = "id_escola")
    private Long schoolId;
}
