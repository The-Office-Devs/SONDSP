package br.com.sondsp.entities;

import br.com.sondsp.form.SchoolClassForm;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "turma")
public class SchoolClass {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_escola", referencedColumnName = "id", updatable = false)
    private School school;

    @Column(name = "nome")
    private String name;

    @Column(name = "ano_letivo")
    private String schoolYear;

    @Column(name = "status")
    private Boolean status;

    public SchoolClass(SchoolClassForm form, School school) {
        this.school = school;
        this.name = form.name();
        this.schoolYear = form.schoolYear();
    }

    public static SchoolClass updateSchoolClassWithForm(SchoolClass schoolClass, SchoolClassForm form) {
        return SchoolClass.builder()
                .id(schoolClass.getId())
                .name(form.name())
                .schoolYear(form.schoolYear())
                .build();
    }
}
