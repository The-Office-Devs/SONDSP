package br.com.sondsp.controllers;

import br.com.sondsp.dtos.ActivationValidationDTO;
import br.com.sondsp.form.CompleteActivationForm;
import br.com.sondsp.form.ResendActivationForm;
import br.com.sondsp.form.ValidateActivationForm;
import br.com.sondsp.services.AccountActivationService;
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
public class AccountActivationControllerImpl implements AccountActivationController {

    private final AccountActivationService accountActivationService;

    @Override
    @PostMapping("/validate-activation")
    public ResponseEntity<ActivationValidationDTO> validateActivation(
            @Valid @RequestBody ValidateActivationForm form,
            HttpServletRequest httpRequest) {
        ActivationValidationDTO dto = accountActivationService.validateActivation(form, resolveIp(httpRequest));
        return ResponseEntity.ok(dto);
    }

    @Override
    @PostMapping("/complete-activation")
    public ResponseEntity<Map<String, String>> completeActivation(
            @Valid @RequestBody CompleteActivationForm form,
            HttpServletRequest httpRequest) {
        accountActivationService.completeActivation(form, resolveIp(httpRequest));
        return ResponseEntity.ok(Map.of("mensagem", "Conta ativada com sucesso."));
    }

    @Override
    @PostMapping("/resend-activation")
    public ResponseEntity<Map<String, String>> resendActivation(
            @Valid @RequestBody ResendActivationForm form,
            HttpServletRequest httpRequest) {
        String message = accountActivationService.resendActivation(form, resolveIp(httpRequest));
        return ResponseEntity.ok(Map.of("mensagem", message));
    }

    private String resolveIp(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        return forwardedFor == null || forwardedFor.isBlank()
                ? request.getRemoteAddr()
                : forwardedFor.split(",")[0].trim();
    }
}
