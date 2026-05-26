package br.com.sondsp.entities;

import br.com.sondsp.dtos.RegisterDTO;
import br.com.sondsp.entities.enums.UserRoles;
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

    @ManyToOne(fetch = FetchType.LAZY)
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
    private Set<Permission> permissions = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "usuario_x_escola",
            joinColumns = @JoinColumn(name = "id_usuario"),
            inverseJoinColumns = @JoinColumn(name = "id_escola")
    )
    private Set<School> schools = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "usuario_x_turma",
            joinColumns = @JoinColumn(name = "id_usuario"),
            inverseJoinColumns = @JoinColumn(name = "id_turma")
    )
    private Set<SchoolClass> schoolsClasses = new HashSet<>();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String roleName = "ROLE_" + this.role.getName().toUpperCase();
        return List.of(new SimpleGrantedAuthority(roleName));
    }

    public static User buildUserWithRegisterDTOAndEncodedPassword(
            RegisterDTO registerDTO,
            String encodedPassword,
            Role role,
            Set<Permission> permissions
    ) {
        return User
                .builder()
                .name(registerDTO.name())
                .password(encodedPassword)
                .registration(registerDTO.registration())
                .email(registerDTO.email())
                .role(role)
                .status(true)
                .permissions(permissions)
                .build();
    }

    public static User updateUserWithRegisterDTO(
            RegisterDTO registerDTO,
            User user,
            Role role,
            Set<Permission> permissions
    ) {
        return User
                .builder()
                .name(registerDTO.name())
                .password(user.password)
                .registration(registerDTO.registration())
                .email(user.email)
                .role(role)
                .status(true)
                .permissions(permissions)
                .build();
    }


    public static User updateUserWithUserForm(
            User user,
            UserForm userUpdated,
            Role role,
            Set<Permission> permissions
    ) {
        return User
                .builder()
                .id(user.getId())
                .registration(userUpdated.registration())
                .email(userUpdated.email())
                .name(userUpdated.name())
                .password(user.getPassword())
                .role(role)
                .status(userUpdated.status())
                .permissions(permissions)
                .build();
    }

    @Override
    public String getUsername() {
        return this.email;
    }
}
