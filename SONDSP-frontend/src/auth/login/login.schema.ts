import { z } from 'zod/v4';

export const loginSchema = z.object({
  login: z
    .email('Digite um e-mail válido')
    .regex(/@sme\.prefeitura\.gov\.br$/i, "O e-mail deve ser institucional"),
  password: z
    .string()
    .min(1, 'Insira a senha'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
