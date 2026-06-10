import { FormProvider, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useResetPassword } from "../use-reset-password";

import { type ResetPasswordFormData, resetPasswordSchema } from "../reset-password-schema";
import type { Ui } from "@/components/HookForm/types";
import { Button } from "@/components/ui/button";
import { NewPasswordFields } from "@/auth/components/NewPasswordFields";

interface ResetPasswordProps {
  ui?: Ui
}

export function ResetPasswordForm({
  ui = 'desktop'
}: Readonly<ResetPasswordProps>) {
  const { mutate, isPending } = useResetPassword();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      newPassword: "",
      confirmNewPassword: ""
    },
    shouldFocusError: false,
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    mutate({
      email: "admin@teste.com",
      password: data.newPassword,
    });
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <NewPasswordFields ui={ui} />

        <Button
          type="submit"
          variant="secondary"
          disabled={isPending || !form.formState.isValid}
        >
          {isPending ? 'Redefinindo senha...' : 'Redefinir senha'}
        </Button>
      </form>
    </FormProvider>
  );
}