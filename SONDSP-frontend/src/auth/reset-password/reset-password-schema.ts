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
})
.refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "As senhas não coincidem",
    path: ["confirmNewPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;