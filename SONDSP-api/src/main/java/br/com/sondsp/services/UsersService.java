package br.com.sondsp.services;

import br.com.sondsp.dtos.UserDetailsDTO;
import br.com.sondsp.dtos.UsersListDetailsDTO;
import br.com.sondsp.entities.Permission;
import br.com.sondsp.entities.Role;
import br.com.sondsp.entities.User;
import br.com.sondsp.form.UserForm;
import br.com.sondsp.repositories.PermissionsRepository;
import br.com.sondsp.repositories.RolesRepository;
import br.com.sondsp.repositories.UsersRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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
            User userToUpdate = getUserById(idUser);
            validateEmail(user, userToUpdate);
            User userUpdated = User.updateUserWithUserForm(
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
            User userToDelete = getUserById(idUser);
            userToDelete.setStatus(false);
            this.usersRepository.save(userToDelete);
            return ResponseEntity.ok("Usuario "+ userToDelete.getName() +" atualizado com sucesso!");
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    public List<UsersListDetailsDTO> getAllUsers() {
        return this.usersRepository.findAllByStatus(true);
    }

    public UserDetailsDTO getUserDetails(Integer idUser) {
        User user = this.getUserById(idUser);
        return new UserDetailsDTO(
                user.getId(),
                user.getName(),
                user.getRegistration(),
                user.getEmail(),
                user.getRole().getName(),
                this.getPermissionsNameList(user.getPermissions())
        );
    }

    public ResponseEntity<?> changePassword(String email, String password){
        User user = this.usersRepository.getByEmail(email);
        if(user == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email Inválido.");

        if (Boolean.TRUE.equals(user.getStatus())){
            user.setPassword(this.encodePassword(password));
            return new ResponseEntity<>(this.usersRepository.save(user), HttpStatus.OK);

        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário Inativado.");
        }
    }

    public ResponseEntity<?> activateUser(String rf, String email, String password){
        User user = this.usersRepository.getByEmailAndRegistration(email, rf);
        if(user == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email inválido.");

        if(Boolean.FALSE.equals(user.getStatus())){
            user.setPassword(this.encodePassword(password));
            user.setStatus(true);
            return new ResponseEntity<>(this.usersRepository.save(user), HttpStatus.OK);

        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário já foi ativado.");
        }
    }

    private void validateEmail(UserForm newUser, User oldUser) {
        if(!(newUser.email().equals(oldUser.getEmail()))) {
            boolean emailExists = this.usersRepository.existsByEmail(newUser.email());
            if(emailExists)
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }
    }

    private User getUserById(Integer idUser){
        return usersRepository.findById(idUser)
                .orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private Role getRole(String role){
        return this.rolesRepository.getRoleByName(role);
    }

    public Set<Permission> getUserPermissions(List<String> permissions){
        return this.permissionsRepository.findAllByPermissionIn(permissions);
    }

    public List<String> getPermissionsNameList(Set<Permission> permissions){
        return permissions.stream().map(Permission::getPermission).toList();
    }

    public String encodePassword(String password){
        return new BCryptPasswordEncoder().encode(password);
    }
}
