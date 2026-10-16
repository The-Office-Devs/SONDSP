package br.com.sondsp.entities;

import br.com.sondsp.entities.enums.AnnotationTag;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "anotacao_aluno")
public class StudentAnnotation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_aluno", referencedColumnName = "id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_autor", referencedColumnName = "id", nullable = false)
    private User author;

    @Column(name = "texto_anotacao", nullable = false, columnDefinition = "TEXT")
    private String text;

    @ElementCollection(targetClass = AnnotationTag.class, fetch = FetchType.EAGER)
    @CollectionTable(
        name = "anotacao_aluno_x_tag",
        joinColumns = @JoinColumn(name = "id_anotacao", referencedColumnName = "id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "tag", length = 20, nullable = false)
    @Builder.Default
    private Set<AnnotationTag> tags = new HashSet<>();

    @Column(name = "data_criacao", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "data_atualizacao")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
