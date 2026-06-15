package br.com.sondsp.entities;

import br.com.sondsp.form.RegisterForm;
import br.com.sondsp.form.UserForm;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_funcao", referencedColumnName = "id")
    private Role role;

    @Column(name = "email")
    private String email;

    @Column(name = "status")
    private Boolean status;

    @Column(name = "senha")
    private String password;

    @ManyToMany
    @JoinTable(
            name = "permissao_x_usuario",
            joinColumns = @JoinColumn(name = "id_usuario"),
            inverseJoinColumns = @JoinColumn(name = "id_permissao")
    )
    private Set<Permission> permissions;

    @ManyToMany
    @JoinTable(
            name = "usuario_x_escola",
            joinColumns = @JoinColumn(name = "id_usuario"),
            inverseJoinColumns = @JoinColumn(name = "id_escola")
    )
    private Set<School> schools;

    @ManyToMany
    @JoinTable(
            name = "usuario_x_turma",
            joinColumns = @JoinColumn(name = "id_usuario"),
            inverseJoinColumns = @JoinColumn(name = "id_turma")
    )
    private Set<SchoolClass> schoolsClasses;

    public static User buildUserWithRegisterForm(RegisterForm form, Role role, Set<Permission> permissions) {
        return User.builder()
                .name(form.name())
                .registration(form.registration())
                .role(role)
                .email(form.email())
                .permissions(permissions)
                .status(false)
                .password(null)
                .build();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String roleName = "ROLE_" + this.role.getName().toUpperCase();
        return List.of(new SimpleGrantedAuthority(roleName));
    }

    public static User updateUserWithUserForm(User user, UserForm form) {
        return User
                .builder()
                .id(user.getId())
                .registration(form.registration())
                .email(form.email())
                .name(form.name())
                .password(user.getPassword())
                .role(user.getRole())
                .permissions(user.getPermissions())
                .build();
    }

    @Override
    public String getUsername() {
        return this.email;
    }
}
