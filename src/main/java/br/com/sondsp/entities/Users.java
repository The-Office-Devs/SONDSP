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
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tblUsers")
public class Users implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer idUser;

    @Column(name = "username")
    private String username;

    @Column(name = "email")
    private String email;

    @Column(name = "name")
    private String name;

    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private UserRoles role;

    @Column(name = "senha")
    private String password;

    @Column(name = "status")
    private Boolean status;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        switch (this.role) {
            case ADMINISTRATOR -> {
                return List.of(new SimpleGrantedAuthority("ROLE_ADMINISTRATOR"));
            }
            case SCHOOL_ADMINISTRATOR -> {
                return List.of(
                        new SimpleGrantedAuthority("ROLE_SCHOOL_ADMINISTRATOR"),
                        new SimpleGrantedAuthority("ROLE_COORDINATOR"),
                        new SimpleGrantedAuthority("ROLE_TEACHER")
                );
            }
            case COORDINATOR -> {
                return List.of(
                        new SimpleGrantedAuthority("ROLE_COORDINATOR"),
                        new SimpleGrantedAuthority("ROLE_TEACHER")
                );
            }
            case TEACHER -> {
                return List.of(new SimpleGrantedAuthority("ROLE_TEACHER"));
            }
            case STUDENT -> {
                return List.of(new SimpleGrantedAuthority("ROLE_STUDENT"));
            }
            default -> {
                return null;
            }
        }
    }


    public static Users buildUserWithRegisterDTO(RegisterDTO registerDTO, String encodedPassword) {
        return Users
                .builder()
                .username(registerDTO.username())
                .email(registerDTO.email())
                .name(registerDTO.name())
                .password(encodedPassword)
                .role(UserRoles.valueOf(registerDTO.role()))
                .status(true)
                .build();
    }

    public static Users updateUserWithUserForm(Users user, UserForm userUpdated) {
        return Users
                .builder()
                .idUser(user.getIdUser())
                .username(userUpdated.username())
                .email(userUpdated.email())
                .name(userUpdated.name())
                .password(user.getPassword())
                .role(UserRoles.valueOf(userUpdated.role()))
                .status(userUpdated.status())
                .build();
    }


}
