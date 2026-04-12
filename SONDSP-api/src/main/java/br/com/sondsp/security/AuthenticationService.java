package br.com.sondsp.security;

import br.com.sondsp.dtos.AuthenticationDTO;
import br.com.sondsp.dtos.RegisterDTO;
import br.com.sondsp.dtos.UserSelfDetailsDTO;
import br.com.sondsp.entities.Permissions;
import br.com.sondsp.entities.Roles;
import br.com.sondsp.entities.Users;
import br.com.sondsp.repositories.PermissionsRepository;
import br.com.sondsp.repositories.RolesRepository;
import br.com.sondsp.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
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

import java.util.List;
import java.util.Set;

@Service
public class AuthenticationService implements UserDetailsService {

    private final UsersRepository usersRepository;
    private final RolesRepository rolesRepository;
    private final TokenService tokenService;
    private final PermissionsRepository permissionsRepository;

    private final AuthenticationManager authenticationManager;

    @Autowired
    public AuthenticationService(UsersRepository usersRepository,
                                 RolesRepository rolesRepository,
                                 TokenService tokenService,
                                 PermissionsRepository permissionsRepository,
                                 @Lazy AuthenticationManager authenticationManager) {
        this.usersRepository = usersRepository;
        this.rolesRepository = rolesRepository;
        this.tokenService = tokenService;
        this.permissionsRepository = permissionsRepository;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return usersRepository.findByEmail(email);
    }

    public ResponseEntity<?> loginUser(AuthenticationDTO authenticationDTO) {
        try{
            Users user = this.authenticateUser(authenticationDTO);
            if(user == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password.");
            if(!user.getStatus()) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário Inativado.");
            return new ResponseEntity<>(new UserSelfDetailsDTO(
                    user.getName(),
                    user.getRegistration(),
                    user.getRole().getName(),
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
            if(Boolean.TRUE.equals(this.verifyIfUserExists(registerDTO.email())))
                throw new UsernameNotFoundException("Credentials already exists");

            Users user = this.buildUserWithEncryptedPassword(registerDTO, this.getUserPermissions(registerDTO.permissions()));
            return ResponseEntity.ok().body(this.usersRepository.save(user).getIdUser());
        }
        catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public Boolean verifyIfUserExists(String email) {
        return usersRepository.findByEmail(email) != null;
    }

    public Users buildUserWithEncryptedPassword(RegisterDTO registerDTO, Set<Permissions> permissions) {
        String encryptedPassword = new BCryptPasswordEncoder().encode(registerDTO.password());
        return Users.buildUserWithRegisterDTO(
                registerDTO,
                encryptedPassword,
                getRole(registerDTO.role()),
                permissions
        );
    }

    private Roles getRole(String role){
        return this.rolesRepository.getRoleByName(role);
    }

    public Set<Permissions> getUserPermissions(List<String> permissions){
        return this.permissionsRepository.findAllByPermissionIn(permissions);
    }
}
