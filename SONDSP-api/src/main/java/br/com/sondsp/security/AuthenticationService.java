package br.com.sondsp.security;

import br.com.sondsp.dtos.AuthenticationDTO;
import br.com.sondsp.dtos.RegisterDTO;
import br.com.sondsp.dtos.UserSelfDetailsDTO;
import br.com.sondsp.entities.Users;
import br.com.sondsp.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthenticationService implements UserDetailsService {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return usersRepository.findByUsername(username);
    }

    public ResponseEntity<?> loginUser(AuthenticationDTO authenticationDTO) {
        try{
            Users user = this.authenticateUser(authenticationDTO);
            if(user == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password.");
            if(!user.getStatus()) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário Inativado.");

            return new ResponseEntity<>(new UserSelfDetailsDTO(
                    user.getName(),
                    user.getUsername(),
                    user.getRegistration(),
                    user.getRole().getRoleName(),
                    this.getToken(user)
            ), HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }

    public Users authenticateUser(AuthenticationDTO authenticationDTO) {
        try{
            UsernamePasswordAuthenticationToken usernamePassword = new UsernamePasswordAuthenticationToken(
                    authenticationDTO.login(),
                    authenticationDTO.password()
            );
            Authentication auth = authenticationManager.authenticate(usernamePassword);
            return (Users) auth.getPrincipal();
        }
        catch (Exception e){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password.");
        }
    }

    public String getToken(Users user) {
        return tokenService.generateToken(user);
    }

    public ResponseEntity<?> registerUser(RegisterDTO registerDTO) {
        try{
            if(Boolean.TRUE.equals(this.verifyIfUserExists(registerDTO.username(), registerDTO.email())))
                throw new UsernameNotFoundException("Credentials already exists");

            Users user = this.buildUser(registerDTO);
            return ResponseEntity.ok().body(this.usersRepository.save(user).getIdUser());
        }
        catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public Boolean verifyIfUserExists(String username, String email) {
        return usersRepository.findByUsernameOrEmail(username, email) != null;
    }

    public Users buildUser(RegisterDTO registerDTO) {
        String encryptedPassword = new BCryptPasswordEncoder().encode(registerDTO.password());
        return Users.buildUserWithRegisterDTO(registerDTO, encryptedPassword);
    }
}
