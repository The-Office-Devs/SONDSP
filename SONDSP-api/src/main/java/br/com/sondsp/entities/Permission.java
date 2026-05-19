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
@Table(name = "permissao")
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "permissao")
    private String permission;

    @ManyToMany(mappedBy = "role")
    private Set<Role> roles = new HashSet<>();

    @ManyToMany(mappedBy = "user")
    private Set<User> users = new HashSet<>();
}
