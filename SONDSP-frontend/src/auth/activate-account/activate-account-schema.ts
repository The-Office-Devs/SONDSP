import { z } from "zod/v4";

const passwordSchema = z
  .string()
  .min(6, { error: "" })
  .regex(/[0-9]/, { error: "" })
  .regex(/[A-Z]/, { error: "" })
  .regex(/[a-z]/, { error: "" });

export const activateAccountSchema = z.object({
  rf: z
    .string()
    .min(1, { error: "" }),
  email: z
    .email("Digite um e-mail válido"),
  newPassword: passwordSchema,
  confirmNewPassword: z
    .string()
    .min(6, { error: "" })
});

export type ActivateAccountFormData = z.infer<typeof activateAccountSchema>;