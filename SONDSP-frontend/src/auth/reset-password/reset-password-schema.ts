import { z } from "zod/v4";

const passwordSchema = z
  .string()
  .min(6, { error: "" })
  .regex(/[0-9]/, { error: "" })
  .regex(/[A-Z]/, { error: "" })
  .regex(/[a-z]/, { error: "" });

export const resetPasswordSchema = z.object({
  newPassword: passwordSchema,
  confirmNewPassword: z.string().min(6, { error: "" })
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;