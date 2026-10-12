import { useNavigate } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";

import { MobileLayout } from "@/auth/components/MobileLayout";
import { AuthCard } from "@/auth/components/AuthCard";

import { ActivateAccountForm } from "./activate-account-form";

export function ActivateAccountMobile() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <AuthCard type="mobile">
        <div className="mb-4 flex w-full items-center gap-2 text-sm font-bold text-secondary">
          <User size={18} />
          <span>Primeiro acesso / Ativação</span>
        </div>

        <p className="mb-6 text-sm leading-relaxed text-gray-500">
          Informe seus dados e o código de ativação recebido por e-mail para cadastrar sua senha.
        </p>

        <ActivateAccountForm ui="mobile" />

        <div className="mt-6">
          <button
            type="button"
            onClick={() => navigate('/login')}
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