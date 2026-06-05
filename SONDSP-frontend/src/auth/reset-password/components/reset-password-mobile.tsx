import { MobileLayout } from "@/auth/components/MobileLayout";
import { AuthCard } from "@/auth/components/AuthCard";

import { ResetPasswordForm } from "./reset-password-form";

export function ResetPasswordMobile() {
  return (
    <MobileLayout>
      <AuthCard type="mobile">
        <ResetPasswordForm ui="mobile" submitClassName="h-12 text-base" />
      </AuthCard>
    </MobileLayout>
  );
}