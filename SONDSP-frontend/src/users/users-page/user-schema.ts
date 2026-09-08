import { z } from "zod/v4";

export const userSchema = z.object({
  email: z
    .email("Digite um e-mail válido")
    .regex(/@sme\.prefeitura\.gov\.br$/i, "O e-mail deve ser institucional"),
  registration: z
    .string()
    .trim()
    .min(1, "O registro funcional é obrigatório"),
  name: z
    .string()
    .trim()
    .min(1, "O nome completo do usuário é obrigatório"),
  role: z
    .string()
    .min(1, { error: "" }),
  permissions: z
    .array(z.string())
    .min(1, 'Selecione ao menos uma permissão')
});

export type UserFormData = z.infer<typeof userSchema>;