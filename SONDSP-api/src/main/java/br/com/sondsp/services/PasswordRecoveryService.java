package br.com.sondsp.services;

import br.com.sondsp.dtos.PasswordRecoveryRequest;
import br.com.sondsp.dtos.PasswordResetRequest;
import br.com.sondsp.entities.PasswordRecoveryAttempt;
import br.com.sondsp.entities.PasswordResetToken;
import br.com.sondsp.entities.User;
import br.com.sondsp.repositories.PasswordRecoveryAttemptRepository;
import br.com.sondsp.repositories.PasswordResetTokenRepository;
import br.com.sondsp.repositories.UsersRepository;
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

@Service
@RequiredArgsConstructor
public class PasswordRecoveryService {

    private static final String GENERIC_MESSAGE =
            "Se este e-mail estiver cadastrado, você receberá um link de recuperação.";
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final UsersRepository usersRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordRecoveryAttemptRepository attemptRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetEmailService emailService;

    @Value("${app.password-reset-expiration-minutes:15}")
    private long expirationMinutes;

    @Transactional
    public String requestReset(PasswordRecoveryRequest request, String requestIp) {
        LocalDateTime now = LocalDateTime.now();
        String normalizedEmail = request.email().trim().toLowerCase();
        String emailHash = sha256(normalizedEmail);
        LocalDateTime since = now.minusMinutes(15);

        if (attemptRepository.countByEmailHashSince(emailHash, since) >= 3
                || attemptRepository.countByRequestIpSince(requestIp, since) >= 10) {
            saveAttempt(emailHash, requestIp, now, "RATE_LIMITED", "Rate limit exceeded");
            return GENERIC_MESSAGE;
        }

        User user = usersRepository.findByEmailAndStatusTrue(normalizedEmail).orElse(null);
        if (user == null) {
            saveAttempt(emailHash, requestIp, now, "IGNORED", "User not found or inactive");
            return GENERIC_MESSAGE;
        }

        tokenRepository.invalidateActiveTokens(user.getId(), now, now);
        String rawToken = generateToken();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .user(user)
                .tokenHash(sha256(rawToken))
                .expiresAt(now.plusMinutes(expirationMinutes))
                .createdAt(now)
                .requestIp(requestIp)
                .build();
        tokenRepository.save(resetToken);
        emailService.send(user, rawToken);
        saveAttempt(emailHash, requestIp, now, "SENT", null);
        return GENERIC_MESSAGE;
    }

    @Transactional
    public void resetPassword(PasswordResetRequest request, String requestIp) {
        validatePassword(request);
        LocalDateTime now = LocalDateTime.now();
        String tokenHash = sha256(request.token());
        PasswordResetToken resetToken = tokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> invalidResetRequest(tokenHash, requestIp, now, "Token not found"));

        if (resetToken.isUsed()) {
            throw invalidResetRequest(tokenHash, requestIp, now, "Token already used");
        }
        if (resetToken.isExpired(now)) {
            throw invalidResetRequest(tokenHash, requestIp, now, "Token expired");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        usersRepository.save(user);
        resetToken.setUsedAt(now);
        tokenRepository.save(resetToken);
        tokenRepository.invalidateActiveTokens(user.getId(), now, now);
    }

    private void validatePassword(PasswordResetRequest request) {
        if (!request.newPassword().equals(request.confirmPassword())
                || !request.newPassword().matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Senha inválida.");
        }
    }

    private void saveAttempt(String emailHash, String requestIp, LocalDateTime attemptedAt,
                             String outcome, String reason) {
        attemptRepository.save(PasswordRecoveryAttempt.builder()
                .emailHash(emailHash)
                .requestIp(requestIp)
                .attemptedAt(attemptedAt)
                .outcome(outcome)
                .reason(reason)
                .build());
    }

    private String generateToken() {
        byte[] token = new byte[32];
        SECURE_RANDOM.nextBytes(token);
        return HexFormat.of().formatHex(token);
    }

    private String sha256(String value) {
        try {
            return HexFormat.of().formatHex(
                    MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 não está disponível.", exception);
        }
    }

    private ResponseStatusException invalidResetRequest(
            String tokenHash, String requestIp, LocalDateTime attemptedAt, String reason) {
        saveAttempt(tokenHash, requestIp, attemptedAt, "RESET_REJECTED", reason);
        return new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitação inválida ou token expirado.");
    }
}
