import { AuthCard } from "@/auth/components/AuthCard";
import { MobileLayout } from "@/auth/components/MobileLayout";

import { ForgotPasswordForm } from "./forgot-password-form";
import { ArrowLeft, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ForgotPasswordMobile() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <AuthCard type="mobile">
        <div className="mb-4 flex w-full items-center gap-2 text-sm font-bold text-secondary">
          <KeyRound size={18} />
          <span>Recuperar a senha</span>
        </div>

        <p className="mb-6 text-sm leading-relaxed text-gray-500">
          Digite o seu e-mail para receber o link de redefinição de senha.
        </p>

        <ForgotPasswordForm ui="mobile" />

        <div className="mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex w-full items-center justify-center gap-2 text-sm font-medium text-secondary transition hover:underline"
          >
            <ArrowLeft size={16} />
            Voltar ao login
          </button>
        </div>
      </AuthCard>
    </MobileLayout>
  );
}