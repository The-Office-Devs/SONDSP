package br.com.sondsp.services;

import br.com.sondsp.entities.User;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class AccountActivationEmailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${app.mail-from}")
    private String from;

    @Value("${app.account-activation-expiration-days:3}")
    private long expirationDays;

    public void send(User user, String rawCode) {
        try {
            var message = mailSender.createMimeMessage();
            var helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());
            helper.setFrom(from);
            helper.setTo(user.getEmail());
            helper.setSubject("Ativação de conta - SONDSP");

            Context context = new Context();
            context.setVariable("userName", user.getName());
            context.setVariable("activationCode", rawCode);
            context.setVariable("activationUrl", frontendUrl + "/ativar-conta");
            context.setVariable("expirationDays", expirationDays);

            helper.setText(templateEngine.process("email/account-activation", context), true);
            mailSender.send(message);
        } catch (MessagingException exception) {
            throw new IllegalStateException("Não foi possível enviar o e-mail de ativação.", exception);
        }
    }
}
