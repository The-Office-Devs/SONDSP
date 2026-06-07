import { AuthCard } from '@/auth/components/AuthCard';
import { MobileLayout } from '@/auth/components/MobileLayout';

import { LoginForm } from './login-form';

export function LoginMobile() {
  return (
    <MobileLayout>
      <AuthCard type="mobile">
        <LoginForm linksStyle="mobile" submitClassName="h-12 text-base" />
      </AuthCard>
    </MobileLayout>
  );
}
