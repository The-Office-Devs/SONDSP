package br.com.sondsp.security;

import br.com.sondsp.entities.Permission;
import br.com.sondsp.entities.Role;
import br.com.sondsp.entities.User;
import br.com.sondsp.exceptions.UserAlreadyExistsException;
import br.com.sondsp.form.AuthenticationForm;
import br.com.sondsp.form.RegisterForm;
import br.com.sondsp.repositories.PermissionsRepository;
import br.com.sondsp.repositories.RolesRepository;
import br.com.sondsp.services.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.security.auth.login.LoginException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static br.com.sondsp.util.SystemMessages.*;

@Service
public class AuthenticationService implements UserDetailsService {

    private final UsersService usersService;
    private final RolesRepository rolesRepository;
    private final TokenService tokenService;
    private final PermissionsRepository permissionsRepository;

    private final AuthenticationManager authenticationManager;

    @Autowired
    public AuthenticationService(UsersService usersService,
                                 RolesRepository rolesRepository,
                                 TokenService tokenService,
                                 PermissionsRepository permissionsRepository,
                                 @Lazy AuthenticationManager authenticationManager) {
        this.usersService = usersService;
        this.rolesRepository = rolesRepository;
        this.tokenService = tokenService;
        this.permissionsRepository = permissionsRepository;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return usersService.getByEmail(email);
    }

    public UserAuthResult loginUser(AuthenticationForm form) throws LoginException {
        ///TODO: IMPLEMENTS KEEPMESIGNED
        User user = authenticateUser(form);

        if (!user.getStatus())
            throw new LoginException(INACTIVATED_USER);

        return new UserAuthResult(user, getToken(user));
    }

    public User authenticateUser(AuthenticationForm form) throws LoginException {
        try{
            UsernamePasswordAuthenticationToken usernamePassword = new UsernamePasswordAuthenticationToken(
                    form.login(),
                    form.password()
            );
            Authentication auth = authenticationManager.authenticate(usernamePassword);

            return (User) auth.getPrincipal();
        }
        catch (Exception e){
            throw new LoginException(INVALID_CREDENTIALS);
        }
    }

    public String getToken(User user) {
        return tokenService.generateToken(user);
    }

    public User registerUser(RegisterForm form) {
        User user = verifyIfUserExists(form.email())
                ? activeUser(form)
                : buildUserWithEncryptedPassword(form, getUserPermissions(form.permissions()));

        return usersService.save(user);
    }

    public User activeUser(RegisterForm form){
        User user = usersService.getByEmail(form.email());

        if (!user.getStatus())
            return User.updateUserWithRegisterForm(form, user, getRole(form.role()), getUserPermissions(form.permissions()));

        throw new UserAlreadyExistsException(USER_ALREADY_EXISTS);
    }

    public Boolean verifyIfUserExists(String email) {
        return usersService.existsByEmail(email);
    }

    public User buildUserWithEncryptedPassword(RegisterForm form, Set<Permission> permissions) {
        String encryptedPassword = new BCryptPasswordEncoder().encode(form.password());

        return User.buildUserWithRegisterDTOAndEncodedPassword(
                form,
                encryptedPassword,
                getRole(form.role()),
                permissions
        );
    }

    private Role getRole(String role){
        return rolesRepository.getRoleByName(role);
    }

    public Set<Permission> getUserPermissions(List<String> permissions){
        return permissionsRepository.findAllByPermissionIn(permissions);
    }

    public User firstAccess(String email) throws Exception {
        User user = usersService.getByEmail(email);

        if (!user.getStatus()) {
            return sendFirstAccessEmail(email);
        }

        throw new LoginException(INACTIVATED_USER);
    }

    public User sendFirstAccessEmail(String email) throws Exception {
        if (email != null)
            throw new Exception("Envio do email de primeiro acesso não feito.");

        return new User();
    }

    public User sendChangePasswordEmail(String email) throws Exception {
        if (email != null)
            throw new Exception("Troca de senha por email não feita.");

        return new User();
    }
}
