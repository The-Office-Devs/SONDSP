package br.com.sondsp.services;

import br.com.sondsp.dtos.ActivationValidationDTO;
import br.com.sondsp.entities.AccountActivationAttempt;
import br.com.sondsp.entities.AccountActivationCode;
import br.com.sondsp.entities.User;
import br.com.sondsp.form.CompleteActivationForm;
import br.com.sondsp.form.ResendActivationForm;
import br.com.sondsp.form.ValidateActivationForm;
import br.com.sondsp.repositories.AccountActivationAttemptRepository;
import br.com.sondsp.repositories.AccountActivationCodeRepository;
import br.com.sondsp.repositories.UsersRepository;
import br.com.sondsp.security.TokenService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountActivationService {

    private static final String CODE_CHARS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final String GENERIC_RESEND_MESSAGE =
            "Se os dados informados conferirem com um cadastro pendente de ativação, um novo código foi enviado ao seu e-mail institucional.";

    private final UsersRepository usersRepository;
    private final AccountActivationCodeRepository codeRepository;
    private final AccountActivationAttemptRepository attemptRepository;
    private final AccountActivationEmailService emailService;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.account-activation-expiration-days:3}")
    private long expirationDays;

    @Transactional
    public void generateAndSendCode(User user, String requestIp) {
        if (Boolean.TRUE.equals(user.getStatus())) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();
        invalidateActiveCodes(user.getId(), now);

        String rawCode = generateSecureCode();
        String codeHash = sha256(rawCode);

        AccountActivationCode activationCode = AccountActivationCode.builder()
                .user(user)
                .codeHash(codeHash)
                .createdAt(now)
                .expiresAt(now.plusDays(expirationDays))
                .requestIp(requestIp)
                .build();

        codeRepository.save(activationCode);
        emailService.send(user, rawCode);

        saveAttempt(sha256(user.getEmail().toLowerCase()), requestIp, now, "CODE_SENT", null);
    }

    @Transactional
    public ActivationValidationDTO validateActivation(ValidateActivationForm form, String requestIp) {
        LocalDateTime now = LocalDateTime.now();
        String emailHash = sha256(form.email());
        LocalDateTime since = now.minusMinutes(15);

        if (attemptRepository.countByEmailHashAndAttemptedAtGreaterThanEqual(emailHash, since) >= 5
                || attemptRepository.countByRequestIpAndAttemptedAtGreaterThanEqual(requestIp, since) >= 15) {
            saveAttempt(emailHash, requestIp, now, "RATE_LIMITED", "Limite de tentativas excedido");
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Muitas tentativas. Aguarde 15 minutos e tente novamente.");
        }

        User user = usersRepository.findByEmailAndRegistration(form.email(), form.registration());
        if (user == null) {
            saveAttempt(emailHash, requestIp, now, "USER_NOT_FOUND", "Usuário não encontrado por e-mail e RF");
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Dados de ativação inválidos.");
        }

        if (Boolean.TRUE.equals(user.getStatus())) {
            saveAttempt(emailHash, requestIp, now, "ALREADY_ACTIVE", "Usuário já se encontra ativo");
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Esta conta já foi ativada. Efetue login diretamente.");
        }

        String inputCodeHash = sha256(form.code());
        AccountActivationCode code = codeRepository
                .findFirstByUserIdAndCodeHashOrderByCreatedAtDesc(user.getId(), inputCodeHash)
                .orElse(null);

        if (code == null) {
            saveAttempt(emailHash, requestIp, now, "INVALID_CODE", "Código incorreto ou não pertence ao usuário");
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Código de ativação inválido.");
        }

        if (code.isUsed()) {
            saveAttempt(emailHash, requestIp, now, "CODE_ALREADY_USED", "Código já utilizado");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Este código de ativação já foi utilizado.");
        }

        if (code.isExpired(now)) {
            saveAttempt(emailHash, requestIp, now, "CODE_EXPIRED", "Código expirado");
            throw new ResponseStatusException(HttpStatus.GONE, "O código de ativação expirou. Solicite um novo código.");
        }

        String temporaryToken = tokenService.generateActivationToken(user);
        saveAttempt(emailHash, requestIp, now, "VALIDATION_SUCCESS", null);

        return new ActivationValidationDTO(temporaryToken, user.getEmail(), user.getName());
    }

    @Transactional
    public void completeActivation(CompleteActivationForm form, String requestIp) {
        validatePassword(form);
        LocalDateTime now = LocalDateTime.now();

        String email = tokenService.validateActivationToken(form.temporaryToken());
        if (email == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token de ativação expirado ou inválido. Valide o código novamente.");
        }

        String emailHash = sha256(email);
        User user = usersRepository.findByEmail(email);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado.");
        }

        if (Boolean.TRUE.equals(user.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Esta conta já foi ativada.");
        }

        user.setPassword(passwordEncoder.encode(form.newPassword()));
        user.setStatus(true);
        usersRepository.save(user);

        invalidateActiveCodes(user.getId(), now);
        saveAttempt(emailHash, requestIp, now, "ACTIVATION_COMPLETED", null);
    }

    @Transactional
    public String resendActivation(ResendActivationForm form, String requestIp) {
        LocalDateTime now = LocalDateTime.now();
        String emailHash = sha256(form.email());
        LocalDateTime since = now.minusMinutes(15);

        if (attemptRepository.countByEmailHashAndAttemptedAtGreaterThanEqual(emailHash, since) >= 3
                || attemptRepository.countByRequestIpAndAttemptedAtGreaterThanEqual(requestIp, since) >= 10) {
            saveAttempt(emailHash, requestIp, now, "RESEND_RATE_LIMITED", "Limite de reenvio excedido");
            return GENERIC_RESEND_MESSAGE;
        }

        User user = usersRepository.findByEmailAndRegistration(form.email(), form.registration());
        if (user == null || Boolean.TRUE.equals(user.getStatus())) {
            saveAttempt(emailHash, requestIp, now, "RESEND_IGNORED", "Usuário inexistente ou já ativo");
            return GENERIC_RESEND_MESSAGE;
        }

        generateAndSendCode(user, requestIp);
        return GENERIC_RESEND_MESSAGE;
    }

    private void invalidateActiveCodes(Integer userId, LocalDateTime now) {
        List<AccountActivationCode> activeCodes =
                codeRepository.findAllByUserIdAndUsedAtIsNullAndExpiresAtGreaterThan(userId, now);
        if (!activeCodes.isEmpty()) {
            activeCodes.forEach(code -> code.setUsedAt(now));
            codeRepository.saveAll(activeCodes);
        }
    }

    private void validatePassword(CompleteActivationForm form) {
        if (!form.newPassword().equals(form.confirmPassword())
                || !form.newPassword().matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Senha inválida. A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números.");
        }
    }

    private void saveAttempt(String emailHash, String requestIp, LocalDateTime attemptedAt,
                             String outcome, String reason) {
        attemptRepository.save(AccountActivationAttempt.builder()
                .emailHash(emailHash)
                .requestIp(requestIp)
                .attemptedAt(attemptedAt)
                .outcome(outcome)
                .reason(reason)
                .build());
    }

    private String generateSecureCode() {
        StringBuilder sb = new StringBuilder(6);
        for (int i = 0; i < 6; i++) {
            sb.append(CODE_CHARS.charAt(SECURE_RANDOM.nextInt(CODE_CHARS.length())));
        }
        return sb.toString();
    }

    private String sha256(String value) {
        try {
            return HexFormat.of().formatHex(
                    MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 não está disponível.", exception);
        }
    }
}
