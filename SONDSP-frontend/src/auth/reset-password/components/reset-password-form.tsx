import { FormProvider, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useResetPassword } from "../use-reset-password";

import { type ResetPasswordFormData, resetPasswordSchema } from "../reset-password-schema";
import type { Ui } from "@/components/HookForm/types";
import { Button } from "@/components/ui/button";
import { NewPasswordFields } from "@/auth/components/NewPasswordFields";

interface ResetPasswordProps {
  ui?: Ui
  submitClassName?: string;
}

export function ResetPasswordForm({
  ui = 'desktop',
  submitClassName,
}: Readonly<ResetPasswordProps>) {
  const { mutate, isPending } = useResetPassword();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: ""
    },
    shouldFocusError: false,
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    if (data.newPassword !== data.confirmNewPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

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
          className={cn('w-full', submitClassName)}
          disabled={isPending}
        >
          {isPending ? 'Redefinindo senha...' : 'Redefinir senha'}
        </Button>
      </form>
    </FormProvider>
  );
}