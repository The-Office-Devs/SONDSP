package br.com.sondsp.services;

import br.com.sondsp.entities.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import jakarta.mail.MessagingException;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class PasswordResetEmailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${app.mail-from}")
    private String from;

    @Value("${app.password-reset-expiration-minutes:15}")
    private long expirationMinutes;

    public void send(User user, String token) {
        try {
            var message = mailSender.createMimeMessage();
            var helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());
            helper.setFrom(from);
            helper.setTo(user.getEmail());
            helper.setSubject("Recuperação de senha - SONDSP");

            Context context = new Context();
            context.setVariable("userName", user.getName());
            context.setVariable("resetUrl", frontendUrl + "?token=" + token);
            context.setVariable("expirationMinutes", expirationMinutes);
            helper.setText(templateEngine.process("email/password-reset", context), true);
            mailSender.send(message);
        } catch (MessagingException exception) {
            throw new IllegalStateException("Não foi possível enviar o e-mail de recuperação.", exception);
        }
    }
}
