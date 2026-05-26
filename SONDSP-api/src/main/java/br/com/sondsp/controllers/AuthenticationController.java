package br.com.sondsp.controllers;

import br.com.sondsp.dtos.AuthenticationDTO;
import br.com.sondsp.dtos.RegisterDTO;
import br.com.sondsp.security.AuthenticationService;
import br.com.sondsp.services.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/auth")
public class AuthenticationController {
    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private UsersService  usersService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationDTO authenticationDTO){
        return this.authenticationService.loginUser(authenticationDTO);
    }

    @PostMapping("/send-change-password-email")
    public ResponseEntity<?> sendChangePasswordEmail(@RequestBody String email){
        return this.authenticationService.sendChangePasswordEmail(email);
    }

    @PostMapping("/first-access")
    public ResponseEntity<?> firstAccess(@RequestBody String email){
        return this.authenticationService.firstAccess(email);
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody String email, @RequestBody String password){
        return this.usersService.changePassword(email, password);
    }

    @PostMapping("/activate-user")
    public ResponseEntity<?> activateUser(
            @RequestBody String rf,
            @RequestBody String email,
            @RequestBody String password
    ){
        return this.usersService.activateUser(rf, email, password);
    }
}
