import { useIsDesktop } from "@/hooks/use-media-query";

import { ActivateAccountDesktop } from "./components/activate-account-desktop";
import { ActivateAccountMobile } from "./components/activate-account-mobile";

export function ActivateAccountPage() {
  const isDesktop = useIsDesktop();

  return isDesktop ? <ActivateAccountDesktop /> : <ActivateAccountMobile />
}