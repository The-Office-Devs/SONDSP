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
@Table(name = "tblUsuario")
public class Users implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idUsuario")
    private Integer idUser;

    @Column(name = "matricula")
    private String registration;

    @Column(name = "email")
    private String email;

    @Column(name = "nome")
    private String name;

    @ManyToOne
    @JoinColumn(name = "idRole")
    private Roles role;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "tblPermissaoUsuario",
            joinColumns = @JoinColumn(name = "idUsuario"),
            inverseJoinColumns = @JoinColumn(name = "idPermissao")
    )
    private Set<Permissions> permissions = new HashSet<>();

    @Column(name = "password")
    private String password;

    @Column(name = "status")
    private Boolean status;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String roleName = "ROLE_" + this.role.getName().toUpperCase();
        return List.of(new SimpleGrantedAuthority(roleName));
    }

    public static Users buildUserWithRegisterDTOAndEncodedPassword(RegisterDTO registerDTO, String encodedPassword, Roles role, Set<Permissions> permissions) {
        return Users
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

    public static Users updateUserWithRegisterDTO(RegisterDTO registerDTO, Users user, Roles role, Set<Permissions> permissions) {
        return Users
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


    public static Users updateUserWithUserForm(Users user, UserForm userUpdated, Roles role, Set<Permissions> permissions) {
        return Users
                .builder()
                .idUser(user.getIdUser())
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
