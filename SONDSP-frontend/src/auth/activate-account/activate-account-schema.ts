import { z } from "zod/v4";

export const validateActivationSchema = z.object({
  registration: z
    .string()
    .trim()
    .min(1, "O registro funcional é obrigatório"),
  email: z
    .email("Digite um e-mail válido")
    .regex(/@sme\.prefeitura\.gov\.br$/i, "O e-mail deve ser institucional"),
  code: z
    .string()
    .trim()
    .min(6, "O código de ativação deve conter no mínimo 6 caracteres")
    .max(8, "Código de ativação inválido"),
});

export type ValidateActivationFormData = z.infer<typeof validateActivationSchema>;

export const setPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .regex(/[0-9]/, "Deve conter pelo menos 1 número")
    .regex(/[A-Z]/, "Deve conter pelo menos 1 letra maiúscula")
    .regex(/[a-z]/, "Deve conter pelo menos 1 letra minúscula"),
  confirmNewPassword: z.string().min(1, "Confirme a sua senha"),
})
.refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "As senhas não coincidem",
  path: ["confirmNewPassword"],
});

export type SetPasswordFormData = z.infer<typeof setPasswordSchema>;

export const resendActivationSchema = z.object({
  registration: z
    .string()
    .trim()
    .min(1, "O registro funcional é obrigatório"),
  email: z
    .email("Digite um e-mail válido")
    .regex(/@sme\.prefeitura\.gov\.br$/i, "O e-mail deve ser institucional"),
});

export type ResendActivationFormData = z.infer<typeof resendActivationSchema>;