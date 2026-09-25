package br.com.sondsp.controllers;

import br.com.sondsp.form.PasswordRecoveryForm;
import br.com.sondsp.form.PasswordResetForm;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@Tag(name = "Recuperação de Senha", description = "Endpoints de solicitação e redefinição de senha")
public interface PasswordRecoveryController {

    @Operation(
            summary = "Solicitação de recuperação de senha",
            description = "Envia e-mail com link de recuperação de senha se o e-mail estiver cadastrado e ativo. A resposta é genérica por segurança.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Solicitação processada com sucesso"),
                    @ApiResponse(responseCode = "400", description = "Formato de e-mail inválido")
            }
    )
    ResponseEntity<Map<String, String>> requestRecovery(
            @Valid @RequestBody PasswordRecoveryForm form,
            HttpServletRequest httpRequest
    );

    @Operation(
            summary = "Redefinição de senha",
            description = "Redefine a senha do usuário validando o token recebido por e-mail e os requisitos de senha forte.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Senha redefinida com sucesso"),
                    @ApiResponse(responseCode = "400", description = "Senha inválida ou confirmação divergente"),
                    @ApiResponse(responseCode = "404", description = "Token inválido ou expirado")
            }
    )
    ResponseEntity<Map<String, String>> resetPassword(
            @Valid @RequestBody PasswordResetForm form,
            HttpServletRequest httpRequest
    );
}
