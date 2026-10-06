package br.com.sondsp.controllers;

import br.com.sondsp.dtos.AuthenticationDTO;
import br.com.sondsp.dtos.RefreshDTO;
import br.com.sondsp.dtos.UserDTO;
import br.com.sondsp.form.AuthenticationForm;
import br.com.sondsp.form.ChangePasswordForm;
import br.com.sondsp.form.FirstAccessForm;
import br.com.sondsp.form.RefreshTokenForm;
import br.com.sondsp.security.AuthenticationService;
import br.com.sondsp.services.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.sondsp.entities.User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import javax.security.auth.login.LoginException;

@RestController
@RequestMapping("/auth")
public class AuthenticationControllerImpl implements AuthenticationController{
    @Autowired
    private AuthenticationService service;

    @Autowired
    private UsersService usersService;

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getAuthenticatedUser(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok().body(new UserDTO(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(AuthenticationForm form) throws LoginException {
        return ResponseEntity.ok().body(new AuthenticationDTO(service.loginUser(form)));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> sendChangePasswordEmail(String email) {
        return ResponseEntity.ok().body(service.sendChangePasswordEmail(email));
    }

    @PostMapping("/first-access")
    public ResponseEntity<?> firstAccess(FirstAccessForm form) {
        return ResponseEntity.ok().body(new UserDTO(service.firstAccess(form)));
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(ChangePasswordForm form) {
        return ResponseEntity.ok().body(new UserDTO(usersService.changePassword(form)));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(RefreshTokenForm form) throws LoginException {
        return ResponseEntity.ok().body(new RefreshDTO(service.refreshToken(form.refreshToken())));
    }
}
