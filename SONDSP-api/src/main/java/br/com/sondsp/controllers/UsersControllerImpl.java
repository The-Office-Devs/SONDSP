package br.com.sondsp.controllers;

import br.com.sondsp.dtos.UserDTO;
import br.com.sondsp.dtos.UsersListDTO;
import br.com.sondsp.filters.UserFilter;
import br.com.sondsp.form.RegisterForm;
import br.com.sondsp.form.UserForm;
import br.com.sondsp.services.UsersService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UsersControllerImpl implements UsersController {
    @Autowired
    private UsersService service;

    @PostMapping()
    public ResponseEntity<?> register(@Valid @RequestBody RegisterForm form){
        return ResponseEntity.ok().body(new UserDTO(service.registerUser(form)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Integer id) {
        return ResponseEntity.ok().body(new UserDTO(service.getUser(id)));
    }

    @GetMapping()
    public ResponseEntity<?> listUser(@ModelAttribute UserFilter filter){
        return ResponseEntity.ok().body(service.getUsers(filter).stream().map(UsersListDTO::new));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Integer id, @Valid @RequestBody UserForm user){
        return ResponseEntity.ok().body(new UserDTO(service.updateUser(id, user)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer id){
        service.deleteUser(id);
        return ResponseEntity.ok("Usuário desativado com sucesso.");
    }
}
