import z from "zod";

export const studentFilterSchema = z.object({
  schoolId: z.coerce
    .number()
    .int()
    .positive("Selecione uma escola"),
  schoolClassId: z.coerce
    .number()
    .int()
    .positive("Selecione uma turma")
});

export type StudentFilterFormInput = z.input<typeof studentFilterSchema>
export type StudentFilterFormData = z.infer<typeof studentFilterSchema>