import { z } from "zod/v4";
import { ALL_VALUE } from "@/lib/options-utils";

const optionalFilter = z
  .string()
  .optional()
  .transform((v) => (!v || v === ALL_VALUE ? undefined : v));

export const classFilterSchema = z.object({
  shift: optionalFilter,
  gradeLevel: optionalFilter,
  schoolYear: optionalFilter
});

export type ClassFilterFormInput = z.input<typeof classFilterSchema>
export type ClassFilterFormData = z.infer<typeof classFilterSchema>