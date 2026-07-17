import { z } from "zod/v4";

const passwordSchema = z
  .string()
  .min(6, { error: "" })
  .regex(/[0-9]/, { error: "" })
  .regex(/[A-Z]/, { error: "" })
  .regex(/[a-z]/, { error: "" });

export const activateAccountSchema = z.object({
  registration: z
    .string()
    .trim()
    .min(1, { error: "" }),
  email: z
    .email("Digite um e-mail válido")
    .endsWith("@sme.prefeitura.gov.br", "O e-mail deve ser institucional (@sme.prefeitura.gov.br)"),
  newPassword: passwordSchema,
  confirmNewPassword: z
    .string()
    .min(6, { error: "" })
})
.refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "As senhas não coincidem",
    path: ["confirmNewPassword"],
  });

export type ActivateAccountFormData = z.infer<typeof activateAccountSchema>;