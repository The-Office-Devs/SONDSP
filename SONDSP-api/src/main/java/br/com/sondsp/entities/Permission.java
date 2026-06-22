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

    @Column(name = "permissao")
    private String permission;

    @ManyToMany(mappedBy = "permissions")
    private Set<Role> roles;

    @ManyToMany(mappedBy = "permissions")
    private Set<User> users;
}
