package br.com.sondsp.controllers;

import br.com.sondsp.dtos.StandardErrorDTO;
import br.com.sondsp.dtos.UserDTO;
import br.com.sondsp.dtos.UsersListDTO;
import br.com.sondsp.filters.UserFilter;
import br.com.sondsp.form.RegisterForm;
import br.com.sondsp.form.UserForm;
import br.com.sondsp.security.AuthenticationService;
import br.com.sondsp.services.UsersService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UsersController {

    @Autowired
    private UsersService service;

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping()
    @Operation(description = "Registra um novo usuário", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Usuário registrado com sucesso.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UserDTO.class)
                    )
            )
    })
    public ResponseEntity<?> register(@Valid @RequestBody RegisterForm form){
        return ResponseEntity.ok().body(new UserDTO(authenticationService.registerUser(form)));
    }

    @GetMapping("/{id}")
    @Operation(description = "Retorna o usuário com o id passado.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Usuário retornado com sucesso.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UserDTO.class)
                    )
            )
    })
    public ResponseEntity<?> getUserById(@PathVariable Integer id) {
        return ResponseEntity.ok().body(new UserDTO(service.getUser(id)));
    }

    @GetMapping()
    @Operation(
            description = "Retorna todos os usuários com base no filtro passado. Se nenhum filtro for passado, retorna todos os usuários.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Retorna os usuários encontrados",
                            content = @Content(
                                    mediaType = "application/json",
                                    array = @ArraySchema(schema = @Schema(implementation = UsersListDTO.class))
                            )
                    )
            }
    )
    public ResponseEntity<?> listUser(@RequestBody(required = false) UserFilter filter){
        return ResponseEntity.ok().body(service.getUsers(filter).stream().map(UsersListDTO::new));
    }

    @PutMapping("/{id}")
    @Operation(description = "Atualiza o usuário com o id passado.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Usuário atualizado com sucesso",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UserDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Usuário não encontrado.",
                    content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            )
    })
    public ResponseEntity<?> updateUser(@PathVariable Integer id, @Valid @RequestBody UserForm user){
        return ResponseEntity.ok().body(new UserDTO(service.updateUser(id, user)));
    }

    @DeleteMapping("/{id}")
    @Operation(description = "Desativa o usuário com o ID passado.", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Usuário desativado com sucesso",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UserDTO.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Usuário não encontrado.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = StandardErrorDTO.class)
                    )
            )
    })
    public ResponseEntity<?> deleteUser(@PathVariable Integer id){
        service.deleteUser(id);
        return ResponseEntity.ok().body("Usuário desativado com sucesso.");
    }
}
