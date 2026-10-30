package br.com.sondsp.entities;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class UserTest {

    @Test
    @DisplayName("Deve consolidar permissões de todas as funções do usuário")
    void shouldConsolidatePermissionsFromAllRoles() {
        Permission p1 = Permission.builder().id(1).permission("SONDAGEM_MANAGE").build();
        Permission p2 = Permission.builder().id(2).permission("ALUNO_VIEW").build();
        Permission p3 = Permission.builder().id(3).permission("TURMA_VIEW").build();

        Role role1 = Role.builder().id(1).name("PROFESSOR").permissions(new HashSet<>(List.of(p1, p2))).build();
        Role role2 = Role.builder().id(2).name("COORDENADOR").permissions(new HashSet<>(List.of(p2, p3))).build();

        User user = User.builder()
                .id(1)
                .name("Carlos")
                .roles(new HashSet<>(List.of(role1, role2)))
                .build();

        Set<Permission> permissions = user.getPermissions();

        assertEquals(3, permissions.size());
        assertTrue(permissions.stream().anyMatch(p -> p.getPermission().equals("SONDAGEM_MANAGE")));
        assertTrue(permissions.stream().anyMatch(p -> p.getPermission().equals("ALUNO_VIEW")));
        assertTrue(permissions.stream().anyMatch(p -> p.getPermission().equals("TURMA_VIEW")));
    }

    @Test
    @DisplayName("Deve gerar authorities com ROLE_<NOME> e cada código de permissão")
    void shouldGenerateGrantedAuthoritiesForRolesAndPermissions() {
        Permission p1 = Permission.builder().id(1).permission("SONDAGEM_MANAGE").build();
        Role role = Role.builder().id(1).name("Professor").permissions(new HashSet<>(List.of(p1))).build();

        User user = User.builder()
                .id(1)
                .roles(new HashSet<>(List.of(role)))
                .build();

        Collection<? extends GrantedAuthority> authorities = user.getAuthorities();

        assertTrue(authorities.stream().anyMatch(a -> a.getAuthority().equals("ROLE_PROFESSOR")));
        assertTrue(authorities.stream().anyMatch(a -> a.getAuthority().equals("SONDAGEM_MANAGE")));
    }

    @Test
    @DisplayName("Deve identificar corretamente se usuário possui função de ADMIN")
    void shouldIdentifyAdminUser() {
        Role admin = Role.builder().id(1).name("ADMIN").build();
        User user = User.builder().roles(Set.of(admin)).build();

        assertTrue(user.isAdmin());
        assertTrue(user.hasRole("ADMIN"));
    }
}
