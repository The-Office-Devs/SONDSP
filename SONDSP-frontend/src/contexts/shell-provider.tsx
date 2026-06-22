import { useMemo, useState, type PropsWithChildren } from "react";
import { 
  DEFAULT_FOOTER, 
  DEFAULT_HEADER, 
  ShellContext, 
  type FooterConfig, 
  type HeaderConfig 
} from "./shell-context";

export function ShellProvider({ children }: PropsWithChildren) {
  const [footer, setFooter] = useState<FooterConfig>(DEFAULT_FOOTER);
  const [header, setHeader] = useState<HeaderConfig>(DEFAULT_HEADER);

  const value = useMemo(
    () => ({ footer, setFooter, header, setHeader }),
    [footer, header],
  );

  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}