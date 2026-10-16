import { z } from "zod/v4";

const requiredId = (message: string) => z.coerce.number().int().positive(message);

export const learningTrajectoriesSchema = z.object({
  schoolId: requiredId("Selecione uma escola"),
  schoolClassId: requiredId("Selecione uma turma"),
  subjectId: requiredId("Selecione uma matéria"),
  strandId: requiredId("Selecione um eixo")
});

export type LearningTrajectoriesFormInput = z.input<typeof learningTrajectoriesSchema>
export type LearningTrajectoriesFormData = z.infer<typeof learningTrajectoriesSchema>