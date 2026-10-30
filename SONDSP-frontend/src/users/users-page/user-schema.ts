import { z } from "zod";

export const userSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "O e-mail institucional é obrigatório")
    .regex(/^[a-z0-9._]+@sme\.prefeitura\.gov\.br$/i, "O e-mail deve ser institucional (@sme.prefeitura.gov.br)"),
  registration: z
    .string()
    .trim()
    .min(1, "O registro funcional é obrigatório")
    .length(8, "O registro funcional deve ter exatamente 8 dígitos"),
  name: z
    .string()
    .trim()
    .min(1, "O nome completo do usuário é obrigatório"),
  roles: z
    .array(z.string())
    .min(1, "Selecione ao menos uma função para o usuário"),
});

export type UserFormData = z.infer<typeof userSchema>;
