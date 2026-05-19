package br.com.sondsp.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "funcao")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "nome")
    private String name;

    @ManyToMany
    @JoinTable(
        name = "funcao_x_permissao",
        joinColumns = @JoinColumn(name = "id_funcao"),
        inverseJoinColumns = @JoinColumn(name = "id_permissao")
    )
    private Set<Permission> permissions = new HashSet<>();
}
