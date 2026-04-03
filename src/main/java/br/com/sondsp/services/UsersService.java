package br.com.sondsp.services;

import br.com.sondsp.dtos.UsersDetailsDTO;
import br.com.sondsp.entities.Users;
import br.com.sondsp.form.UserForm;
import br.com.sondsp.repositories.UsersRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@AllArgsConstructor
public class UsersService {

    private UsersRepository usersRepository;

    public ResponseEntity<?> updateUser(Integer idUser, UserForm user) {
        try{
            Users userToUpdate = getUserById(idUser);
            validateUserForm(user, userToUpdate);
            Users userUpdated = Users.updateUserWithUserForm(userToUpdate, user);
            String username = this.usersRepository.save(userUpdated).getName();

            return ResponseEntity.ok("Usuario "+ username +" atualizado com sucesso!");
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
        this.validateUsername(newUser, oldUser);
        this.validateEmail(newUser, oldUser);
    }

    private void validateUsername(UserForm newUser, Users oldUser) {
        if(!(newUser.username().equals(oldUser.getUsername()))) {
            boolean usernameExists = this.usersRepository.existsByUsername(newUser.username());
            if(usernameExists)
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
        }
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
}
