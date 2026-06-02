package br.com.sondsp.controllers;

import br.com.sondsp.dtos.RegisterDTO;
import br.com.sondsp.form.UserForm;
import br.com.sondsp.security.AuthenticationService;
import br.com.sondsp.services.UsersService;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/api/users")
public class UsersController {

    @Autowired
    private UsersService usersService;

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/register")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuário registrado com sucesso."),
        @ApiResponse(responseCode = "400", description = "Erro ao registrar o usuário.")
    })
    public ResponseEntity<?> register(@RequestBody RegisterDTO registerDTO){
        return this.authenticationService.registerUser(registerDTO);
    }

    @PutMapping("/update/{idUser}")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuário atualizado com sucesso."),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado.")
    })
    public ResponseEntity<?> updateUser(@PathVariable Integer idUser, @RequestBody UserForm user){
        return this.usersService.updateUser(idUser, user);
    }

    @DeleteMapping("/delete/{idUser}")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuário desativado com sucesso."),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado.")
    })
    public ResponseEntity<?> deleteUser(@PathVariable Integer idUser){
        return this.usersService.deleteUser(idUser);
    }

    @GetMapping("/list")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Todos as usuários retornados.")
    })
    public ResponseEntity<?> listUser(){
        return ResponseEntity.ok(this.usersService.getAllUsers());
    }
    
    @GetMapping("/details/{idUser}")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuário retornado com sucesso.")
    })
    public ResponseEntity<?> detailsUser(@PathVariable Integer idUser){
        return ResponseEntity.ok(this.usersService.getUserDetails(idUser));
    }
}
