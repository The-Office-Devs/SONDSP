import { z } from "zod";

export const roleSchema = z.object({
  name: z.string().trim().min(1, "O nome da função é obrigatório"),
  permissionIds: z.array(z.number()),
});

export type RoleFormSchema = z.infer<typeof roleSchema>;
