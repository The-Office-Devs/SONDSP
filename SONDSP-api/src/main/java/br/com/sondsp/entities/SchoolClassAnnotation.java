package br.com.sondsp.entities;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedBy;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "anotacao_turma")
public class SchoolClassAnnotation {

    @EmbeddedId
    private SchoolClassAnnotationID id;

    @ManyToOne
    @JoinColumn(name = "id_turma", referencedColumnName = "id", insertable = false, updatable = false)
    private SchoolClass schoolClass;

    @CreatedBy
    @ManyToOne
    @JoinColumn(name = "id_autor", referencedColumnName = "id", updatable = false)
    private User author;

    @Column(name = "texto_anotacao")
    private String annotationText;

    @Column(name = "data_criacao", updatable = false)
    private LocalDateTime creationDate;
}