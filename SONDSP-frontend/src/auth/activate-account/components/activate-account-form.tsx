import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, RotateCw } from "lucide-react";
import { toast } from "sonner";

import type { Ui } from "@/components/HookForm/types";
import { 
  type ValidateActivationFormData, 
  validateActivationSchema,
  type SetPasswordFormData,
  setPasswordSchema
} from "../activate-account-schema";
import type { ActivationValidationResponse } from "@/auth/auth.types";

import { TextField } from "@/components/HookForm/fields/TextField";
import { NewPasswordFields } from "@/auth/components/NewPasswordFields";
import { Button } from "@/components/ui/button";

import { useActivateAccount } from "../use-activate-account";

interface ActivateAccountFormProps {
  ui?: Ui;
}

export function ActivateAccountForm({
  ui = 'desktop'
}: Readonly<ActivateAccountFormProps>) {
  const [step, setStep] = useState<'validate' | 'password'>('validate');
  const [validatedData, setValidatedData] = useState<ActivationValidationResponse | null>(null);

  const { 
    validateMutation, 
    completeMutation, 
    resendMutation, 
    isValidating, 
    isCompleting, 
    isResending 
  } = useActivateAccount({
    onValidated: (data) => {
      setValidatedData(data);
      setStep('password');
    }
  });

  const validateForm = useForm<ValidateActivationFormData>({
    resolver: zodResolver(validateActivationSchema),
    mode: "onChange",
    defaultValues: {
      registration: "",
      email: "",
      code: ""
    }
  });

  const passwordForm = useForm<SetPasswordFormData>({
    resolver: zodResolver(setPasswordSchema),
    mode: "onChange",
    defaultValues: {
      newPassword: "",
      confirmNewPassword: ""
    }
  });

  const onValidateSubmit = (data: ValidateActivationFormData) => {
    validateMutation.mutate({
      registration: data.registration.trim(),
      email: data.email.trim().toLowerCase(),
      code: data.code.trim().toUpperCase()
    });
  };

  const onCompleteSubmit = (data: SetPasswordFormData) => {
    if (!validatedData?.temporaryToken) {
      toast.error("Token de validação ausente. Por favor, valide o código novamente.");
      setStep('validate');
      return;
    }

    completeMutation.mutate({
      temporaryToken: validatedData.temporaryToken,
      newPassword: data.newPassword,
      confirmPassword: data.confirmNewPassword
    });
  };

  const handleResendCode = () => {
    const email = validateForm.getValues("email")?.trim().toLowerCase();
    const registration = validateForm.getValues("registration")?.trim();

    if (!email || !registration) {
      toast.error("Informe o RF e o e-mail institucional para solicitar o reenvio do código.");
      return;
    }

    resendMutation.mutate({ email, registration });
  };

  if (step === 'password') {
    return (
      <div className="space-y-5">
        <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600 border border-slate-200">
          <p className="font-medium text-slate-800">
            {validatedData?.name ? `Olá, ${validatedData.name}!` : 'Código validado!'}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Defina sua nova senha de acesso para a conta <span className="font-semibold">{validatedData?.email}</span>.
          </p>
        </div>

        <FormProvider {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onCompleteSubmit)} className="space-y-5">
            <NewPasswordFields ui={ui} />

            <Button
              type="submit"
              variant="secondary"
              disabled={isCompleting || !passwordForm.formState.isValid}
            >
              {isCompleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Ativando conta...</span>
                </>
              ) : (
                "Concluir e ativar conta"
              )}
            </Button>

            <button
              type="button"
              onClick={() => setStep('validate')}
              disabled={isCompleting}
              className="flex w-full items-center justify-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 transition"
            >
              <ArrowLeft size={14} />
              Voltar para validação do código
            </button>
          </form>
        </FormProvider>
      </div>
    );
  }

  return (
    <FormProvider {...validateForm}>
      <form onSubmit={validateForm.handleSubmit(onValidateSubmit)} className="space-y-4">
        <TextField
          name="registration"
          label="Registro Funcional (RF)"
          placeholder="Insira o registro funcional"
          onlyNumbers
          disabled={isValidating || isResending}
          ui={ui}
        />

        <TextField
          name="email"
          label="E-mail Institucional"
          type="email"
          placeholder="Digite o seu e-mail institucional"
          disabled={isValidating || isResending}
          ui={ui}
        />

        <TextField
          name="code"
          label="Código de Ativação"
          placeholder="Ex: ABC123"
          disabled={isValidating || isResending}
          ui={ui}
        />

        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={handleResendCode}
            disabled={isResending || isValidating}
            className="flex items-center gap-1.5 text-xs font-medium text-secondary hover:underline cursor-pointer disabled:opacity-50"
          >
            {isResending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Reenviando...</span>
              </>
            ) : (
              <>
                <RotateCw size={13} />
                <span>Não recebeu o código? Reenviar</span>
              </>
            )}
          </button>
        </div>

        <Button
          type="submit"
          variant="secondary"
          disabled={isValidating || isResending || !validateForm.formState.isValid}
          className="mt-2"
        >
          {isValidating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Validando código...</span>
            </>
          ) : (
            "Validar código e avançar"
          )}
        </Button>
      </form>
    </FormProvider>
  );
}