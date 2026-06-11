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

    @Column(name = "diretor")
    private String principalName;

    @Column(name = "status")
    private Boolean status;

    public School(SchoolForm school) {
        this.name = school.name();
        this.principalName = school.principalName();
        this.status = school.status();
    }

    public static School updateSchoolWithSchoolForm(School school, SchoolForm updatedSchool) {
        return School
                .builder()
                .id(school.getId())
                .name(updatedSchool.name())
                .principalName(updatedSchool.principalName())
                .status(updatedSchool.status())
                .build();
    }
}
