import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { Ui } from "@/components/HookForm/types";
import { type ActivateAccountFormData, activateAccountSchema } from "../activate-account-schema";

import { TextField } from "@/components/HookForm/fields/TextField";
import { NewPasswordFields } from "@/auth/components/NewPasswordFields";
import { Button } from "@/components/ui/button";

import { useActivateAccount } from "../use-activate-account";

interface ActivateAccountFormProps {
  ui?: Ui
}

export function ActivateAccountForm({
  ui = 'desktop'
}: Readonly<ActivateAccountFormProps>) {
  const { mutate, isPending } = useActivateAccount();

  const form = useForm<ActivateAccountFormData>({
    resolver: zodResolver(activateAccountSchema),
    mode: "onChange",
    defaultValues: {
      registration: "",
      email: "",
      newPassword: "",
      confirmNewPassword: ""
    }
  });

  const onSubmit = (data: ActivateAccountFormData) => {
    mutate(data);
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <TextField
          name="registration"
          label="Registro Funcional (RF)"
          placeholder="Insira o registro funcional do usuário"
          onlyNumbers
          ui={ui}
        />

        <TextField
          name="email"
          label="E-mail Institucional"
          type="email"
          placeholder="seu.nome@instituicao.br"
          ui={ui}
        />

        <NewPasswordFields ui={ui} />

        <Button
          type="submit"
          variant="secondary"
          disabled={isPending || !form.formState.isValid}
        >
          {isPending ? 'Ativando conta...' : 'Ativar conta'}
        </Button>
      </form>
    </FormProvider>
  );
}