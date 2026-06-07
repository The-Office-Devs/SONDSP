import { DesktopLayout } from "@/auth/components/DesktopLayout";
import { AuthCard } from "@/auth/components/AuthCard";

import { ForgotPasswordForm } from "./forgot-password-form";

export function ForgotPasswordDesktop() {
  return (
    <DesktopLayout>
      <AuthCard type="desktop">
        <p className="text-sm text-gray-500">
          Digite o seu e-mail para receber o link de redefinição de senha
        </p>

        <ForgotPasswordForm />
      </AuthCard>
    </DesktopLayout>
  );
}