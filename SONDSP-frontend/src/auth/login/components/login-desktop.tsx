import { DesktopLayout } from '@/auth/components/DesktopLayout';
import { AuthCard } from '@/auth/components/AuthCard';

import { LoginForm } from './login-form';

export function LoginDesktop() {
  return (
    <DesktopLayout>
      <AuthCard type="desktop">
        <LoginForm showRemember />
      </AuthCard>
    </DesktopLayout>
  );
}
