package br.com.sondsp.controllers;

import br.com.sondsp.dtos.RegisterDTO;
import br.com.sondsp.form.UserForm;
import br.com.sondsp.services.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/api/users")
public class UsersController {

    @Autowired
    private UsersService usersService;

    @PutMapping("/update/{idUser}")
    public ResponseEntity<?> updateUser(@PathVariable Integer idUser, @RequestBody UserForm user){
        return this.usersService.updateUser(idUser, user);
    }

    @PutMapping("/active-user/{idUser}")
    public ResponseEntity<?> register(@RequestBody RegisterDTO registerDTO){
        return this.usersService.activeUser(registerDTO);
    }

    @DeleteMapping("/delete/{idUser}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer idUser){
        return this.usersService.deleteUser(idUser);
    }

    @GetMapping("/list")
    public ResponseEntity<?> listUser(){
        return ResponseEntity.ok(this.usersService.getAllUsers());
    }
    
    @GetMapping("/details/{idUser}")
    public ResponseEntity<?> detailsUser(@PathVariable Integer idUser){
        return ResponseEntity.ok(this.usersService.getUserDetails(idUser));
    }
}
