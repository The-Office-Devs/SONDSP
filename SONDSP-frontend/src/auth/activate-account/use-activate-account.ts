import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { AxiosError } from "axios";

import { handleApiError } from "@/lib/utils";
import { 
  validateActivationService, 
  completeActivationService, 
  resendActivationService 
} from "../auth.service";
import type { 
  ValidateActivationRequest, 
  ActivationValidationResponse, 
  CompleteActivationRequest, 
  ResendActivationRequest 
} from "../auth.types";

interface UseActivateAccountOptions {
  onValidated?: (data: ActivationValidationResponse) => void;
}

export function useActivateAccount(options?: UseActivateAccountOptions) {
  const navigate = useNavigate();

  const validateMutation = useMutation({
    mutationFn: (data: ValidateActivationRequest) => validateActivationService(data),
    onSuccess: (response) => {
      toast.success("Código validado com sucesso! Agora defina a sua senha de acesso.");
      options?.onValidated?.(response);
    },
    onError: (error: AxiosError<{ error: string }>) => {
      handleApiError(error, "Erro ao validar código de ativação.");
    }
  });

  const completeMutation = useMutation({
    mutationFn: (data: CompleteActivationRequest) => completeActivationService(data),
    onSuccess: () => {
      toast.success("Conta ativada com sucesso! Você já pode fazer login.");
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    },
    onError: (error: AxiosError<{ error: string }>) => {
      handleApiError(error, "Erro ao definir senha e ativar conta.");
    }
  });

  const resendMutation = useMutation({
    mutationFn: (data: ResendActivationRequest) => resendActivationService(data),
    onSuccess: (response) => {
      toast.success(response.mensagem || "Novo código de ativação enviado.");
    },
    onError: (error: AxiosError<{ error: string }>) => {
      handleApiError(error, "Erro ao solicitar reenvio do código.");
    }
  });

  return {
    validateMutation,
    completeMutation,
    resendMutation,
    isValidating: validateMutation.isPending,
    isCompleting: completeMutation.isPending,
    isResending: resendMutation.isPending,
  };
}