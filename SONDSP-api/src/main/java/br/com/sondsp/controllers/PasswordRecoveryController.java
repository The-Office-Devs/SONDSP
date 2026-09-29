package br.com.sondsp.controllers;

import br.com.sondsp.dtos.PasswordRecoveryRequest;
import br.com.sondsp.dtos.PasswordResetRequest;
import br.com.sondsp.services.PasswordRecoveryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
@Tag(name = "Recuperação de Senha", description = "Endpoints de solicitação e redefinição de senha")
public class PasswordRecoveryController {

    private final PasswordRecoveryService passwordRecoveryService;

    @Operation(
            summary = "Solicitação de recuperação de senha",
            description = "Envia e-mail com link de recuperação de senha se o e-mail estiver cadastrado e ativo. A resposta é genérica por segurança.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Solicitação processada com sucesso"),
                    @ApiResponse(responseCode = "400", description = "Formato de e-mail inválido")
            }
    )
    @PostMapping("/password-recovery")
    public ResponseEntity<Map<String, String>> requestRecovery(
            @Valid @RequestBody PasswordRecoveryRequest request,
            HttpServletRequest httpRequest) {
        String message = passwordRecoveryService.requestReset(request, resolveIp(httpRequest));
        return ResponseEntity.ok(Map.of("mensagem", message));
    }

    @Operation(
            summary = "Redefinição de senha",
            description = "Redefine a senha do usuário validando o token recebido por e-mail e os requisitos de senha forte.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Senha redefinida com sucesso"),
                    @ApiResponse(responseCode = "400", description = "Senha inválida ou confirmação divergente"),
                    @ApiResponse(responseCode = "404", description = "Token inválido ou expirado")
            }
    )
    @PostMapping("/password-reset")
    public ResponseEntity<Map<String, String>> resetPassword(
            @Valid @RequestBody PasswordResetRequest request,
            HttpServletRequest httpRequest) {
        passwordRecoveryService.resetPassword(request, resolveIp(httpRequest));
        return ResponseEntity.ok(Map.of("mensagem", "Senha redefinida com sucesso."));
    }

    private String resolveIp(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        return forwardedFor == null || forwardedFor.isBlank()
                ? request.getRemoteAddr()
                : forwardedFor.split(",")[0].trim();
    }
}
