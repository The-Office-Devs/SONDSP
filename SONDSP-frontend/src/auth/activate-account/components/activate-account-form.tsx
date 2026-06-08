import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import type { Ui } from "@/components/HookForm/types";
import { type ActivateAccountFormData, activateAccountSchema } from "../activate-account-schema";

import { TextField } from "@/components/HookForm/fields/TextField";
import { NewPasswordFields } from "@/auth/components/NewPasswordFields";
import { Button } from "@/components/ui/button";

import { useActivateAccount } from "../use-activate-account";

interface ActivateAccountFormProps {
  ui?: Ui
  submitClassName?: string;
}

export function ActivateAccountForm({
  ui = 'desktop',
  submitClassName,
}: Readonly<ActivateAccountFormProps>) {
  const { mutate, isPending } = useActivateAccount();

  const form = useForm<ActivateAccountFormData>({
    resolver: zodResolver(activateAccountSchema),
    defaultValues: {
      rf: "",
      email: "",
      newPassword: "",
      confirmNewPassword: ""
    }
  });

  const onSubmit = (data: ActivateAccountFormData) => {
    if (data.newPassword !== data.confirmNewPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    mutate(data);
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <TextField
          name="rf"
          label="Registro Funcional (RF)"
          hasWhiteBackground={false}
          ui={ui}
        />

        <TextField
          name="email"
          label="E-mail institucional"
          type="email"
          placeholder="nome@sondsp.gov.br"
          hasWhiteBackground={false}
          ui={ui}
        />

        <NewPasswordFields ui={ui} />

        <Button
          type="submit"
          variant="secondary"
          className={cn('w-full', submitClassName)}
          disabled={isPending}
        >
          {isPending ? 'Ativando conta...' : 'Ativar conta'}
        </Button>
      </form>
    </FormProvider>
  );
}