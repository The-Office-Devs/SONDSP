import { useIsDesktop } from "@/hooks/use-media-query";

import { ResetPasswordDesktop } from "./components/reset-password-desktop";
import { ResetPasswordMobile } from "./components/reset-password-mobile";

export function ResetPasswordPage() {
  const isDesktop = useIsDesktop();

  return isDesktop ? <ResetPasswordDesktop /> : <ResetPasswordMobile />
}