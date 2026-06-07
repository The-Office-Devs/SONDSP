import { DesktopLayout } from "@/auth/components/DesktopLayout";
import { AuthCard } from "@/auth/components/AuthCard";

import { ResetPasswordForm } from "./reset-password-form";

export function ResetPasswordDesktop() {
  return (
    <DesktopLayout>
      <AuthCard>
        <ResetPasswordForm />
      </AuthCard>
    </DesktopLayout>
  );
}