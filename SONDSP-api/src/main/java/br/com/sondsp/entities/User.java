package br.com.sondsp.entities;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

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

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
	private Set<UserSchoolClass> schoolClasses;

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		Set<GrantedAuthority> authorities = new HashSet<>();

		if (this.role != null && this.role.getPermissions() != null) {
			this.role.getPermissions()
				.forEach(permission -> authorities.add(new SimpleGrantedAuthority(permission.getPermission())));
		}

		return authorities;
	}

	@Override
	public String getUsername() {
		return this.email;
	}
}
