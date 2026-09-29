import { FormProvider, useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";

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
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      newPassword: "",
      confirmNewPassword: ""
    },
    shouldFocusError: false,
  });

  if (!token) {
    return (
      <div className="space-y-4 text-center py-2">
        <p className="text-sm font-medium text-destructive">
          Token de recuperação não encontrado no link acessado.
        </p>
        <p className="text-sm text-muted-foreground">
          Verifique se copiou o link completo recebido no e-mail ou solicite um novo link de recuperação.
        </p>
        <Button asChild variant="outline" className="w-full">
          <Link to="/esqueci-senha">Solicitar nova recuperação</Link>
        </Button>
      </div>
    );
  }

  const onSubmit = (data: ResetPasswordFormData) => {
    mutate({
      token,
      newPassword: data.newPassword,
      confirmPassword: data.confirmNewPassword,
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