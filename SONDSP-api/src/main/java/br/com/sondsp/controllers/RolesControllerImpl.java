package br.com.sondsp.controllers;

import br.com.sondsp.dtos.GroupedPermissionsDTO;
import br.com.sondsp.dtos.RoleDTO;
import br.com.sondsp.entities.Role;
import br.com.sondsp.form.RoleForm;
import br.com.sondsp.services.RolesService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
@AllArgsConstructor
public class RolesControllerImpl implements RolesController {

    private final RolesService rolesService;

    @Override
    @GetMapping
    public ResponseEntity<List<RoleDTO>> getAllRoles() {
        List<RoleDTO> roles = rolesService.getAllRoles().stream()
                .map(RoleDTO::new)
                .toList();
        return ResponseEntity.ok(roles);
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<RoleDTO> getRoleById(@PathVariable Integer id) {
        Role role = rolesService.getRoleById(id);
        return ResponseEntity.ok(new RoleDTO(role));
    }

    @Override
    @PostMapping
    public ResponseEntity<RoleDTO> createRole(@Valid @RequestBody RoleForm form) {
        Role created = rolesService.createRole(form);
        return ResponseEntity.status(HttpStatus.CREATED).body(new RoleDTO(created));
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<RoleDTO> updateRole(@PathVariable Integer id, @Valid @RequestBody RoleForm form) {
        Role updated = rolesService.updateRole(id, form);
        return ResponseEntity.ok(new RoleDTO(updated));
    }

    @Override
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRole(@PathVariable Integer id) {
        rolesService.deleteRole(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    @GetMapping("/permissions")
    public ResponseEntity<List<GroupedPermissionsDTO>> getPermissionsGroupedByArea() {
        return ResponseEntity.ok(rolesService.getGroupedPermissions());
    }
}
