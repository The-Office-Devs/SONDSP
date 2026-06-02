package br.com.sondsp.entities;

import br.com.sondsp.form.SchoolForm;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "escola")
public class School {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "nome")
    private String name;

    public School(String name) {
        this.name = name;
    }

    public static School updateSchoolWithSchoolForm(School school, SchoolForm updatedSchool) {
        return School.builder().id(school.getId()).name(updatedSchool.name()).build();
    }
}
