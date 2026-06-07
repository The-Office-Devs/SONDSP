import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { ActivateAccountFormData } from "./activate-account-schema";
import { activateAccountService } from "../auth.service";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export function useActivateAccount() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data: ActivateAccountFormData) =>
        activateAccountService({
          rf: data.rf,
          email: data.email,
          password: data.newPassword
        }),

    onSuccess: () => {
      toast.success("Conta ativada!");

      setTimeout(() => {
        navigate('/login');
      }, 1000);
    },

    onError: (error: AxiosError<{ error: string }>) => {
      const message = error.response?.data?.error ?? "Ocorreu um erro ao ativar a conta. Tente novamente.";
      toast.error(message);
    }
  });

  return { mutate: mutation.mutate };
};