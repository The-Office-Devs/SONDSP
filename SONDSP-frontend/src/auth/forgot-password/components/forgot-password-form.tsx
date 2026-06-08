import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { z } from "zod/v4";

import type { Ui } from "@/components/HookForm/types";

import { TextField } from "@/components/HookForm/fields/TextField";
import { Button } from "@/components/ui/button";

import { useForgotPassword } from "../use-forgot-password";

const forgotPasswordSchema = z.object({
  email: z.email({ error: "Digite um e-mail válido "})
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  ui?: Ui;
  submitClassName?: string;
}

export function ForgotPasswordForm({
  ui = 'desktop',
  submitClassName,
}: Readonly<ForgotPasswordFormProps>) {
  const { mutate } = useForgotPassword();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" }
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    mutate(data.email);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-5">
        <TextField
          name="email"
          label="E-mail institucional"
          type="email"
          placeholder="nome@sondsp.gov.br"
          hasWhiteBackground={false}
          ui={ui}
        />

        <Button
          type="submit"
          variant="secondary"
          className={cn('w-full', submitClassName)}
          disabled={false}
        >
          Enviar link de redefinição
        </Button>
      </form>
    </FormProvider>
  );
}