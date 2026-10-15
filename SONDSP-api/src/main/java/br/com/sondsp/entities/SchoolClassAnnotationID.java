package br.com.sondsp.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class SchoolClassAnnotationID implements Serializable {

    @Column(name = "id_turma")
    private Integer schoolClassId;

    @Column(name = "id")
    private Integer id;
}
