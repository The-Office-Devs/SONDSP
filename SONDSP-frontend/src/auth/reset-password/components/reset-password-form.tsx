import { useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
  const navigate = useNavigate();

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

    toast.success("Senha redefinida!");
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <NewPasswordFields ui={ui} />

        <Button
          type="submit"
          variant="secondary"
          className={cn('w-full', submitClassName)}
          disabled={false}
        >
          Redefinir senha
        </Button>
      </form>
    </FormProvider>
  );
}