import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Loader2 } from "lucide-react";

import type { Ui } from "@/components/HookForm/types";

import { TextField } from "@/components/HookForm/fields/TextField";
import { Button } from "@/components/ui/button";

import { useForgotPassword } from "../use-forgot-password";

const forgotPasswordSchema = z.object({
  email: z.email("Digite um e-mail válido ").regex(/@sme\.prefeitura\.gov\.br$/i, "O e-mail deve ser institucional"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  ui?: Ui;
}

export function ForgotPasswordForm({
  ui = 'desktop'
}: Readonly<ForgotPasswordFormProps>) {
  const { mutate, isPending } = useForgotPassword();

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
          placeholder="Digite o seu e-mail institucional"
          disabled={isPending}
          ui={ui}
        />

        <Button
          type="submit"
          variant="secondary"
          disabled={isPending || !form.formState.isValid}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Enviando e-mail...</span>
            </>
          ) : (
            "Enviar link de redefinição"
          )}
        </Button>
      </form>
    </FormProvider>
  );
}