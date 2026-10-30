package br.com.sondsp.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @Column(name = "nome", nullable = false)
    private String name;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "funcao_x_permissao",
        joinColumns = @JoinColumn(name = "id_funcao"),
        inverseJoinColumns = @JoinColumn(name = "id_permissao")
    )
    @Builder.Default
    private Set<Permission> permissions = new HashSet<>();

    @JsonIgnore
    @ManyToMany(mappedBy = "roles")
    @Builder.Default
    private Set<User> users = new HashSet<>();

    public boolean isAdmin() {
        if (id != null && id == 1) return true;
        if (name == null) return false;
        String normalized = name.trim().toUpperCase();
        return normalized.equals("ADMIN") || normalized.equals("ADMINISTRADOR");
    }
}
