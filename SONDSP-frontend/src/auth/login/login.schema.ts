import { z } from 'zod/v4';

export const loginSchema = z.object({
  login: z
    .email('Digite um e-mail válido')
    .endsWith('@sme.prefeitura.gov.br', 'O e-mail deve ser institucional (@sme.prefeitura.gov.br)'),
  password: z
    .string()
    .min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
