package br.com.sondsp.services;

import br.com.sondsp.dtos.UsersDetailsDTO;
import br.com.sondsp.entities.Permissions;
import br.com.sondsp.entities.Roles;
import br.com.sondsp.entities.Users;
import br.com.sondsp.form.UserForm;
import br.com.sondsp.repositories.PermissionsRepository;
import br.com.sondsp.repositories.RolesRepository;
import br.com.sondsp.repositories.UsersRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;

@Service
@AllArgsConstructor
public class UsersService {

    private UsersRepository usersRepository;
    private RolesRepository rolesRepository;
    private PermissionsRepository permissionsRepository;

    public ResponseEntity<?> updateUser(Integer idUser, UserForm user) {
        try{
            Users userToUpdate = getUserById(idUser);
            validateUserForm(user, userToUpdate);
            Users userUpdated = Users.updateUserWithUserForm(
                    userToUpdate,
                    user,
                    this.getRole(user.role()),
                    this.getUserPermissions(user.permissions())
            );
            String userName = this.usersRepository.save(userUpdated).getName();
            return ResponseEntity.ok("Usuario "+ userName +" atualizado com sucesso!");
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    public ResponseEntity<?> deleteUser(Integer idUser) {
        try{
            Users userToDelete = getUserById(idUser);
            userToDelete.setStatus(false);
            this.usersRepository.save(userToDelete);
            return ResponseEntity.ok("Usuario "+ userToDelete.getName() +" atualizado com sucesso!");
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    public List<UsersDetailsDTO> getAllUsers() {
        return this.usersRepository.findAllByStatus(true);
    }

    private void validateUserForm(UserForm newUser, Users oldUser) {
        this.validateEmail(newUser, oldUser);
    }

    private void validateEmail(UserForm newUser, Users oldUser) {
        if(!(newUser.email().equals(oldUser.getEmail()))) {
            boolean emailExists = this.usersRepository.existsByEmail(newUser.email());
            if(emailExists)
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }
    }

    private Users getUserById(Integer idUser){
        return usersRepository.findById(idUser)
                .orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private Roles getRole(String role){
        return this.rolesRepository.getRoleByName(role);
    }

    public Set<Permissions> getUserPermissions(List<String> permissions){
        return this.permissionsRepository.findAllByPermissionIn(permissions);
    }
}
