import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";

import type { Ui } from "@/components/HookForm/types";

import { TextField } from "@/components/HookForm/fields/TextField";
import { Button } from "@/components/ui/button";

import { useForgotPassword } from "../use-forgot-password";

const forgotPasswordSchema = z.object({
  email: z.email("Digite um e-mail válido ").endsWith("@sme.prefeitura.gov.br", "O e-mail deve ser institucional (@sme.prefeitura.gov.br)")
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  ui?: Ui;
}

export function ForgotPasswordForm({
  ui = 'desktop'
}: Readonly<ForgotPasswordFormProps>) {
  const { mutate } = useForgotPassword();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: { email: "" }
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    mutate(data.email.toLowerCase());
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-5">
        <TextField
          name="email"
          label="E-mail Institucional"
          type="email"
          placeholder="nome@sme.prefeitura.gov.br"
          ui={ui}
        />

        <Button
          type="submit"
          variant="secondary"
          disabled={!form.formState.isValid}
        >
          Enviar link de redefinição
        </Button>
      </form>
    </FormProvider>
  );
}