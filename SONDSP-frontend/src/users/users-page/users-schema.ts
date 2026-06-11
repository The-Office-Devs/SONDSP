import { z } from "zod/v4";

export const usersSchema = z.object({
  email: z
    .email("Digite um e-mail válido"),
  registration: z
    .string()
    .trim()
    .min(1, "O registro funcional é obrigatório"),
  name: z
    .string()
    .trim()
    .min(1, "O nome do usuário é obrigatório"),
  role: z
    .string()
    .min(1, { error: "" }),
  permissions: z
    .array(z.string())
    .min(1, 'Selecione ao menos uma permissão')
});

export type UsersFormData = z.infer<typeof usersSchema>;