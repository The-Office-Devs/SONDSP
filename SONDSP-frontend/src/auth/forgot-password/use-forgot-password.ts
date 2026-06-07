import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { forgotPasswordService } from "../auth.service";
import { toast } from "sonner";

export function useForgotPassword() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (email: string) => forgotPasswordService(email),

    onSuccess: () => {
      navigate('/home');
      toast.success("Link de redefinição de senha enviado!");
    },

    onError: () => {
      toast.error("Ocorreu um erro ao enviar o link. Tente novamente.");
    }
  });

  return { mutate: mutation.mutate };
};