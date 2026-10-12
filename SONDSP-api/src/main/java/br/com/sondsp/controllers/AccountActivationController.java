package br.com.sondsp.controllers;

import br.com.sondsp.dtos.ActivationValidationDTO;
import br.com.sondsp.form.CompleteActivationForm;
import br.com.sondsp.form.ResendActivationForm;
import br.com.sondsp.form.ValidateActivationForm;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@Tag(name = "Ativação de Conta", description = "Endpoints de ativação de conta por código de primeiro acesso")
public interface AccountActivationController {

    @Operation(
            summary = "Validação do código de ativação",
            description = "Valida os dados de RF, e-mail institucional e código de ativação enviado por e-mail. Retorna token temporário para definição de senha.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Código validado com sucesso"),
                    @ApiResponse(responseCode = "400", description = "Código já utilizado ou dados incorretos"),
                    @ApiResponse(responseCode = "401", description = "Código inválido ou não pertencente ao usuário"),
                    @ApiResponse(responseCode = "410", description = "Código de ativação expirado")
            }
    )
    ResponseEntity<ActivationValidationDTO> validateActivation(
            @Valid @RequestBody ValidateActivationForm form,
            HttpServletRequest httpRequest
    );

    @Operation(
            summary = "Definição de senha e conclusão da ativação",
            description = "Define a nova senha de acesso e ativa o usuário no sistema.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Conta ativada com sucesso"),
                    @ApiResponse(responseCode = "400", description = "Senha não atende aos requisitos ou divergente"),
                    @ApiResponse(responseCode = "401", description = "Token temporário expirado ou inválido")
            }
    )
    ResponseEntity<Map<String, String>> completeActivation(
            @Valid @RequestBody CompleteActivationForm form,
            HttpServletRequest httpRequest
    );

    @Operation(
            summary = "Reenvio de código de ativação",
            description = "Reenvia um novo código de ativação caso o usuário ainda não tenha ativado sua conta.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Solicitação processada com sucesso")
            }
    )
    ResponseEntity<Map<String, String>> resendActivation(
            @Valid @RequestBody ResendActivationForm form,
            HttpServletRequest httpRequest
    );
}
