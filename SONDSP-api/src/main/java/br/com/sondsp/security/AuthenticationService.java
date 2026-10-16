package br.com.sondsp.security;

import static br.com.sondsp.util.SystemMessages.*;

import br.com.sondsp.entities.User;
import br.com.sondsp.form.AuthenticationForm;
import br.com.sondsp.form.FirstAccessForm;
import br.com.sondsp.repositories.PermissionsRepository;
import br.com.sondsp.repositories.RolesRepository;
import br.com.sondsp.services.EmailService;
import br.com.sondsp.services.UsersService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ValidationException;
import java.util.Optional;
import javax.security.auth.login.LoginException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService implements UserDetailsService {

	private final UsersService usersService;
	private final TokenService tokenService;
	private final EmailService emailService;

	private final AuthenticationManager authenticationManager;

	@Autowired
	public AuthenticationService(
		UsersService usersService,
		RolesRepository rolesRepository,
		TokenService tokenService,
		PermissionsRepository permissionsRepository,
		EmailService emailService,
		@Lazy AuthenticationManager authenticationManager
	) {
		this.usersService = usersService;
		this.tokenService = tokenService;
		this.emailService = emailService;
		this.authenticationManager = authenticationManager;
	}

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		return usersService.getByEmail(email);
	}

	public UserAuthResult loginUser(AuthenticationForm form) throws LoginException {
		User user = authenticateUser(form);

		if (!user.getStatus()) throw new LoginException(INVALID_CREDENTIALS);

		return new UserAuthResult(user, getToken(user), getRefreshToken(user));
	}

	public User authenticateUser(AuthenticationForm form) throws LoginException {
		try {
			UsernamePasswordAuthenticationToken usernamePassword = new UsernamePasswordAuthenticationToken(
				form.login(),
				form.password()
			);
			Authentication auth = authenticationManager.authenticate(usernamePassword);

			return (User) auth.getPrincipal();
		} catch (Exception e) {
			throw new LoginException(INVALID_CREDENTIALS);
		}
	}

	public String getToken(User user) {
		return tokenService.generateToken(user);
	}

	public String getRefreshToken(User user) {
		return tokenService.generateRefreshToken(user);
	}

	public User firstAccess(FirstAccessForm form) {
		User user = usersService.findByEmailAndRegistration(form.email(), form.registration());

		if (user == null) throw new EntityNotFoundException(EMAIL_OR_REGISTRATION_NOT_FOUND);

		if (!user.getStatus()) {
			if (user.getPassword() != null) throw new ValidationException(INACTIVATED_USER);

			user.setPassword(encodePassword(form.password()));
			user.setStatus(true);
			return usersService.save(user);
		} else {
			throw new ValidationException(USER_ALREADY_ACTIVE);
		}
	}

	public String encodePassword(String password) {
		return new BCryptPasswordEncoder().encode(password);
	}

	public User sendFirstAccessEmail(String email) throws Exception {
		if (email != null) throw new Exception("Envio do email de primeiro acesso não feito.");

		return new User();
	}

	public String sendChangePasswordEmail(String email) {
		emailService.sendSimpleEmail(email, "Teste SONDSP", "Teste");

		return "Teste de email enviado!";
	}

	public Optional<User> getCurrentUser() {
		var authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication != null && authentication.getPrincipal() instanceof User user) {
			return Optional.of(user);
		}

		return Optional.empty();
	}

	public String refreshToken(String refreshToken) throws LoginException {
		String email = tokenService.validateToken(refreshToken);

		if (email == null || email.isBlank()) {
			throw new LoginException(INVALID_CREDENTIALS);
		}

		User user = usersService.getByEmail(email);

		if (user == null || !user.getStatus()) {
			throw new LoginException(INVALID_CREDENTIALS);
		}

		return getToken(user);
	}
}
