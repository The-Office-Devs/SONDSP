package br.com.sondsp.controllers;

import br.com.sondsp.form.PasswordRecoveryForm;
import br.com.sondsp.form.PasswordResetForm;
import br.com.sondsp.services.PasswordRecoveryService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class PasswordRecoveryControllerImpl implements PasswordRecoveryController {

    private final PasswordRecoveryService passwordRecoveryService;

    @Override
    @PostMapping("/password-recovery")
    public ResponseEntity<Map<String, String>> requestRecovery(
            @Valid @RequestBody PasswordRecoveryForm form,
            HttpServletRequest httpRequest) {
        String message = passwordRecoveryService.requestReset(form, resolveIp(httpRequest));
        return ResponseEntity.ok(Map.of("mensagem", message));
    }

    @Override
    @PostMapping("/password-reset")
    public ResponseEntity<Map<String, String>> resetPassword(
            @Valid @RequestBody PasswordResetForm form,
            HttpServletRequest httpRequest) {
        passwordRecoveryService.resetPassword(form, resolveIp(httpRequest));
        return ResponseEntity.ok(Map.of("mensagem", "Senha redefinida com sucesso."));
    }

    private String resolveIp(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        return forwardedFor == null || forwardedFor.isBlank()
                ? request.getRemoteAddr()
                : forwardedFor.split(",")[0].trim();
    }
}
