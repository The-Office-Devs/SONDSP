import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { DesktopLayout } from "@/auth/components/DesktopLayout";
import { AuthCard } from "@/auth/components/AuthCard";

import { ActivateAccountForm } from "./activate-account-form";

export function ActivateAccountDesktop() {
  return (
    <DesktopLayout>
      <AuthCard>
        <div className="mb-4 text-center">
          <p className="text-sm text-gray-500">
            Informe seus dados e o código de ativação recebido por e-mail
          </p>
        </div>

        <ActivateAccountForm />

        <div className="mt-5 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-secondary hover:underline"
          >
            <ArrowLeft size={14} />
            Voltar ao login
          </Link>
        </div>
      </AuthCard>
    </DesktopLayout>
  );
}