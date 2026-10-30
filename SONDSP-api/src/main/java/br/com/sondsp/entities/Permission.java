package br.com.sondsp.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "permissao")
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "permissao", nullable = false, unique = true)
    private String permission;

    @Column(name = "descricao")
    private String description;

    @Column(name = "area")
    private String area;

    @ManyToMany(mappedBy = "permissions")
    private Set<Role> roles;
}
