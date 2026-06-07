import { z } from 'zod/v4';

export const schoolSchema = z.object({
  name: z
    .string()
    .min(1, 'O nome da escola é obrigatório'),
  director: z
    .string()
    .optional(),
});

export type SchoolFormData = z.infer<typeof schoolSchema>;
