import { z } from "zod/v4";

export const studentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "O nome do aluno é obrigatória"),
  schoolClassId: z.coerce
    .number()
    .int()
    .positive("Selecione uma turma"),
  rowNumber: z.coerce
    .number()
    .int()
    .positive("O número de chamada do aluno é obrigatório"),
  registration: z
    .string()
    .trim()
    .min(1, "A matrícula do aluno é obrigatória"),
    status: z.boolean()
});

export type StudentFormInput = z.input<typeof studentSchema>;
export type StudentFormData = z.output<typeof studentSchema>;