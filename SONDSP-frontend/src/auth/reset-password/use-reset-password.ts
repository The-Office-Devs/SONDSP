import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { handleApiError } from "@/lib/utils";
import { resetPasswordService } from "../auth.service";
import { toast } from "sonner";

import type { ResetPasswordRequest } from "../auth.types";
import type { AxiosError } from "axios";

export function useResetPassword() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data: ResetPasswordRequest) => 
      resetPasswordService(data),

    onSuccess: () => {
      toast.success("Senha redefinida!");

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