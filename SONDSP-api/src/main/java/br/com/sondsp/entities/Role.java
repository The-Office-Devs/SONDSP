package br.com.sondsp.entities;

import static br.com.sondsp.util.SystemConstants.ADMIN_ROLE_NAME;

import jakarta.persistence.*;
import java.util.*;
import lombok.*;

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

	@Column(name = "nome", nullable = false, unique = true)
	private String name;

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(
		name = "funcao_x_permissao",
		joinColumns = @JoinColumn(name = "id_funcao"),
		inverseJoinColumns = @JoinColumn(name = "id_permissao")
	)
	@Builder.Default
	private Set<Permission> permissions = new HashSet<>();

	public Boolean isAdmin() {
		return Objects.equals(name, ADMIN_ROLE_NAME);
	}
}
