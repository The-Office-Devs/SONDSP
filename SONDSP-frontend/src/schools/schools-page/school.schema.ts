import { z } from 'zod/v4';

export const schoolSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'O nome da escola é obrigatório'),
  principalName: z
    .string()
    .trim()
    .min(1, 'O nome do diretor é obrigatório'),
  codigoInep: z
    .string()
    .trim()
    .min(1, 'O código INEP é obrigatório')
    .regex(/^\d{8}$/, 'O código INEP deve conter exatamente 8 dígitos numéricos'),
  status: z.boolean()
});

export type SchoolFormData = z.infer<typeof schoolSchema>;
