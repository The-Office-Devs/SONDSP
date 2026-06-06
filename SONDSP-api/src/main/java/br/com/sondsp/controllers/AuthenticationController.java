package br.com.sondsp.controllers;

import br.com.sondsp.dtos.AuthenticationDTO;
import br.com.sondsp.dtos.UserDTO;
import br.com.sondsp.form.AuthenticationForm;
import br.com.sondsp.form.ChangePasswordForm;
import br.com.sondsp.security.AuthenticationService;
import br.com.sondsp.services.UsersService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.security.auth.login.LoginException;

@Controller
@RequestMapping("/auth")
public class AuthenticationController {
    @Autowired
    private AuthenticationService service;

    @Autowired
    private UsersService usersService;

    @PostMapping("/login")
    @Operation(description = "Efetua o login do usuário", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Usuário logado com sucesso.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = AuthenticationDTO.class)
                    )
            )
    })
    public ResponseEntity<?> login(@RequestBody AuthenticationForm form) throws LoginException {
        return ResponseEntity.status(HttpStatus.OK).body(new AuthenticationDTO(service.loginUser(form)));
    }

    @PostMapping("/change-password")
    @Operation(description = "Envia email de troca de senha", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Email enviado com sucesso.",
                    content = @Content(
                            mediaType = "application/json"
                    )
            )
    })
    public ResponseEntity<?> sendChangePasswordEmail(@RequestBody String email) throws Exception {
        return ResponseEntity.status(HttpStatus.OK).body(service.sendChangePasswordEmail(email));
    }

    @PostMapping("/first-access")
    @Operation(description = "Realiza o primeiro acesso do usuário.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Primeiro acesso realizado com sucesso.",
                    content = @Content(
                            mediaType = "application/json"
                    )
            )
    })
    public ResponseEntity<?> firstAccess(@RequestBody String email) throws Exception {
        return ResponseEntity.status(HttpStatus.OK).body(service.firstAccess(email));
    }

    @PutMapping("/change-password")
    @Operation(description = "Realiza a troca de senha do usuário.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Senha trocada com sucesso.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UserDTO.class)
                    )
            )
    })
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordForm form){
        return ResponseEntity.status(HttpStatus.OK).body(new UserDTO(usersService.changePassword(form)));
    }
}
