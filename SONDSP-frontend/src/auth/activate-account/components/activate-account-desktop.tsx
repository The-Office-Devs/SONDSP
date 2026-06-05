import { DesktopLayout } from "@/auth/components/DesktopLayout";
import { AuthCard } from "@/auth/components/AuthCard";

import { ActivateAccountForm } from "./activate-account-form";

export function ActivateAccountDesktop() {
  return (
    <DesktopLayout>
      <AuthCard>
        <ActivateAccountForm />
      </AuthCard>
    </DesktopLayout>
  );
}