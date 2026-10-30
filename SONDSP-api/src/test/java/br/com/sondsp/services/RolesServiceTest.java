package br.com.sondsp.services;

import br.com.sondsp.dtos.GroupedPermissionsDTO;
import br.com.sondsp.entities.Permission;
import br.com.sondsp.entities.Role;
import br.com.sondsp.entities.User;
import br.com.sondsp.form.RoleForm;
import br.com.sondsp.repositories.PermissionsRepository;
import br.com.sondsp.repositories.RolesRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static br.com.sondsp.util.SystemMessages.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RolesServiceTest {

    @Mock
    private RolesRepository rolesRepository;

    @Mock
    private PermissionsRepository permissionsRepository;

    @InjectMocks
    private RolesService rolesService;

    private Permission permSondagem;
    private Permission permAluno;
    private Role adminRole;
    private Role customRole;

    @BeforeEach
    void setUp() {
        permSondagem = Permission.builder()
                .id(1)
                .permission("SONDAGEM_MANAGE")
                .description("Gerenciar Sondagens")
                .area("Sondagens")
                .build();

        permAluno = Permission.builder()
                .id(2)
                .permission("ALUNO_VIEW")
                .description("Visualizar Alunos")
                .area("Alunos")
                .build();

        adminRole = Role.builder()
                .id(1)
                .name("ADMIN")
                .permissions(new HashSet<>(List.of(permSondagem, permAluno)))
                .build();

        customRole = Role.builder()
                .id(2)
                .name("COORDENADOR")
                .permissions(new HashSet<>(List.of(permAluno)))
                .build();
    }

    @Test
    @DisplayName("Deve listar todas as funções ordenadas por ID")
    void shouldReturnAllRoles() {
        when(rolesRepository.findAllByOrderByIdAsc()).thenReturn(List.of(adminRole, customRole));

        List<Role> roles = rolesService.getAllRoles();

        assertEquals(2, roles.size());
        assertEquals("ADMIN", roles.get(0).getName());
        verify(rolesRepository, times(1)).findAllByOrderByIdAsc();
    }

    @Test
    @DisplayName("Deve buscar função por ID com sucesso")
    void shouldFindRoleById() {
        when(rolesRepository.findById(1)).thenReturn(Optional.of(adminRole));

        Role role = rolesService.getRoleById(1);

        assertNotNull(role);
        assertEquals("ADMIN", role.getName());
    }

    @Test
    @DisplayName("Deve lançar exceção quando ID da função não for encontrado")
    void shouldThrowExceptionWhenRoleNotFound() {
        when(rolesRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> rolesService.getRoleById(99));
    }

    @Test
    @DisplayName("Deve criar nova função com permissões selecionadas")
    void shouldCreateNewRole() {
        RoleForm form = new RoleForm("Orientador Pedagógico", List.of(1, 2));

        when(rolesRepository.existsByNameIgnoreCase("Orientador Pedagógico")).thenReturn(false);
        when(permissionsRepository.findAllByIdIn(List.of(1, 2))).thenReturn(Set.of(permSondagem, permAluno));
        when(rolesRepository.save(any(Role.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Role created = rolesService.createRole(form);

        assertNotNull(created);
        assertEquals("Orientador Pedagógico", created.getName());
        assertEquals(2, created.getPermissions().size());
        verify(rolesRepository).save(any(Role.class));
    }

    @Test
    @DisplayName("Deve impedir criação de função com nome duplicado")
    void shouldRejectDuplicateRoleNameOnCreate() {
        RoleForm form = new RoleForm("COORDENADOR", List.of(2));

        when(rolesRepository.existsByNameIgnoreCase("COORDENADOR")).thenReturn(true);

        ValidationException ex = assertThrows(ValidationException.class, () -> rolesService.createRole(form));
        assertEquals(ROLE_ALREADY_EXISTS, ex.getMessage());
        verify(rolesRepository, never()).save(any(Role.class));
    }

    @Test
    @DisplayName("Deve atualizar função customizada com sucesso")
    void shouldUpdateCustomRole() {
        RoleForm form = new RoleForm("Coordenador Geral", List.of(1));

        when(rolesRepository.findById(2)).thenReturn(Optional.of(customRole));
        when(rolesRepository.existsByNameIgnoreCaseAndIdNot("Coordenador Geral", 2)).thenReturn(false);
        when(permissionsRepository.findAllByIdIn(List.of(1))).thenReturn(Set.of(permSondagem));
        when(rolesRepository.save(any(Role.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Role updated = rolesService.updateRole(2, form);

        assertEquals("Coordenador Geral", updated.getName());
        assertEquals(1, updated.getPermissions().size());
    }

    @Test
    @DisplayName("Ao atualizar função ADMIN, deve garantir todas as permissões e não revogar nada")
    void shouldProtectAdminRolePermissionsOnUpdate() {
        RoleForm form = new RoleForm("ADMIN", List.of(1)); // Tentativa de enviar apenas uma permissão

        when(rolesRepository.findById(1)).thenReturn(Optional.of(adminRole));
        when(permissionsRepository.findAll()).thenReturn(List.of(permSondagem, permAluno));
        when(rolesRepository.save(any(Role.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Role updated = rolesService.updateRole(1, form);

        // Deve manter todas as permissões cadastradas no sistema
        assertEquals(2, updated.getPermissions().size());
        assertTrue(updated.isAdmin());
        verify(permissionsRepository).findAll();
    }

    @Test
    @DisplayName("Deve impedir a exclusão da função ADMIN")
    void shouldRejectDeletionOfAdminRole() {
        when(rolesRepository.findById(1)).thenReturn(Optional.of(adminRole));

        ValidationException ex = assertThrows(ValidationException.class, () -> rolesService.deleteRole(1));
        assertEquals(ADMIN_ROLE_CANNOT_BE_DELETED, ex.getMessage());
        verify(rolesRepository, never()).delete(any(Role.class));
    }

    @Test
    @DisplayName("Deve impedir a exclusão de função que possui usuários vinculados")
    void shouldRejectDeletionOfRoleWithUsers() {
        User user = User.builder().id(10).name("Maria").build();
        customRole.setUsers(Set.of(user));

        when(rolesRepository.findById(2)).thenReturn(Optional.of(customRole));

        ValidationException ex = assertThrows(ValidationException.class, () -> rolesService.deleteRole(2));
        assertEquals(ROLE_HAS_ASSOCIATED_USERS, ex.getMessage());
        verify(rolesRepository, never()).delete(any(Role.class));
    }

    @Test
    @DisplayName("Deve retornar permissões agrupadas por área")
    void shouldReturnPermissionsGroupedByArea() {
        when(permissionsRepository.findAllByOrderByAreaAscPermissionAsc())
                .thenReturn(List.of(permAluno, permSondagem));

        List<GroupedPermissionsDTO> grouped = rolesService.getGroupedPermissions();

        assertEquals(2, grouped.size());
        assertEquals("Alunos", grouped.get(0).area());
        assertEquals("Sondagens", grouped.get(1).area());
        assertEquals(1, grouped.get(0).permissions().size());
        assertEquals(1, grouped.get(1).permissions().size());
    }
}
