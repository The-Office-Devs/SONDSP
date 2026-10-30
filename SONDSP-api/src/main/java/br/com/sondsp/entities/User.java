package br.com.sondsp.entities;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;
import java.util.stream.Collectors;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "usuario")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "nome")
    private String name;

    @Column(name = "matricula")
    private String registration;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "usuario_x_funcao",
            joinColumns = @JoinColumn(name = "id_usuario"),
            inverseJoinColumns = @JoinColumn(name = "id_funcao")
    )
    @Builder.Default
    private Set<Role> roles = new HashSet<>();

    @Column(name = "email")
    private String email;

    @Column(name = "status")
    private Boolean status;

    @Column(name = "senha")
    private String password;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private Set<UserSchool> schools;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private Set<UserSchoolClass> schoolClasses;

    public Set<Permission> getPermissions() {
        if (this.roles == null || this.roles.isEmpty()) {
            return Collections.emptySet();
        }
        return this.roles.stream()
                .filter(Objects::nonNull)
                .filter(r -> r.getPermissions() != null)
                .flatMap(r -> r.getPermissions().stream())
                .collect(Collectors.toSet());
    }

    public Role getRole() {
        if (this.roles == null || this.roles.isEmpty()) {
            return null;
        }
        for (Role r : this.roles) {
            if (r.isAdmin()) return r;
        }
        for (Role r : this.roles) {
            if ("COORDENADOR".equalsIgnoreCase(r.getName()) || "COORDINATOR".equalsIgnoreCase(r.getName())) return r;
        }
        return this.roles.iterator().next();
    }

    public void setRole(Role role) {
        if (this.roles == null) {
            this.roles = new HashSet<>();
        }
        this.roles.clear();
        if (role != null) {
            this.roles.add(role);
        }
    }

    public boolean hasRole(String roleName) {
        if (this.roles == null || roleName == null) return false;
        return this.roles.stream().anyMatch(r -> roleName.equalsIgnoreCase(r.getName()));
    }

    public boolean isAdmin() {
        if (this.roles == null) return false;
        return this.roles.stream().anyMatch(Role::isAdmin);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<GrantedAuthority> authorities = new HashSet<>();
        if (this.roles != null) {
            for (Role r : this.roles) {
                if (r != null && r.getName() != null) {
                    authorities.add(new SimpleGrantedAuthority("ROLE_" + r.getName().trim().toUpperCase()));
                    if (r.getPermissions() != null) {
                        for (Permission p : r.getPermissions()) {
                            if (p != null && p.getPermission() != null) {
                                authorities.add(new SimpleGrantedAuthority(p.getPermission().trim()));
                            }
                        }
                    }
                }
            }
        }
        return authorities;
    }

    @Override
    public String getUsername() {
        return this.email;
    }
}
