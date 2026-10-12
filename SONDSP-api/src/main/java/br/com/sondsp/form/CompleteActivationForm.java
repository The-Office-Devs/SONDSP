package br.com.sondsp.form;

import jakarta.validation.constraints.NotBlank;

public record CompleteActivationForm(
        @NotBlank(message = "O token de ativação é obrigatório.")
        String temporaryToken,

        @NotBlank(message = "A nova senha não pode estar em branco.")
        String newPassword,

        @NotBlank(message = "A confirmação de senha não pode estar em branco.")
        String confirmPassword
) {
}
