import { useIsDesktop } from "@/hooks/use-media-query";

import { ForgotPasswordDesktop } from "./components/forgot-password-desktop";
import { ForgotPasswordMobile } from "./components/forgot-password-mobile";

export function ForgotPasswordPage() {
  const isDesktop = useIsDesktop();

  return isDesktop ? <ForgotPasswordDesktop /> : <ForgotPasswordMobile />
}