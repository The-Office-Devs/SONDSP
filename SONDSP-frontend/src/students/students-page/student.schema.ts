import { z } from "zod/v4";

export const studentSchema = z.object({
  rowNumber: z.coerce
    .number()
    .int()
    .positive("O número de chamada do aluno é obrigatório"),
  registration: z
    .string()
    .trim()
    .min(1, "A matrícula do aluno é obrigatória"),
    status: z.boolean(),
  name: z
    .string()
    .trim()
    .min(1, "O nome completo do aluno é obrigatório"),
  schoolId: z.coerce
    .number()
    .int()
    .positive("Selecione uma escola"),
  schoolClassId: z.coerce
    .number()
    .int()
    .positive("Selecione uma turma"),
  birthDate: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Informe a data no formato dd/mm/aaaa"),

});

export type StudentFormInput = z.input<typeof studentSchema>;
export type StudentFormData = z.output<typeof studentSchema>;