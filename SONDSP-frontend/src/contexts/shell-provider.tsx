import { useMemo, useState, type PropsWithChildren } from "react";
import { DEFAULT_FOOTER, ShellContext, type FooterConfig } from "./shell-context";

export function ShellProvider({ children }: PropsWithChildren) {
  const [footer, setFooter] = useState<FooterConfig>(DEFAULT_FOOTER);
  const value = useMemo(() => ({ footer, setFooter}), [footer]);
  return <ShellContext.Provider value={value}> {children} </ShellContext.Provider>;
}