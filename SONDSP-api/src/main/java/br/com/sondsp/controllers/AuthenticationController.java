package br.com.sondsp.controllers;

import br.com.sondsp.dtos.AuthenticationDTO;
import br.com.sondsp.dtos.RegisterDTO;
import br.com.sondsp.security.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/auth")
public class AuthenticationController {
    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationDTO authenticationDTO){
        return this.authenticationService.loginUser(authenticationDTO);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDTO registerDTO){
        return this.authenticationService.registerUser(registerDTO);
    }
}
