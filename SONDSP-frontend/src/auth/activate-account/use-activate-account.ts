import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { handleApiError } from "@/lib/utils";
import { activateAccountService } from "../auth.service";
import { toast } from "sonner";

import type { ActivateAccountFormData } from "./activate-account-schema";
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

    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error)
  });

  return { 
    mutate: mutation.mutate,
    isPending: mutation.isPending
  };
};