import { useIsDesktop } from '@/hooks/use-media-query';

import { LoginDesktop } from './components/login-desktop';
import { LoginMobile } from './components/login-mobile';

export function LoginPage() {
  const isDesktop = useIsDesktop();

  return isDesktop ? <LoginDesktop /> : <LoginMobile />;
}
