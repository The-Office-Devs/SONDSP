import { useEffect } from "react";
import { useShell } from "./use-shell";
import { DEFAULT_FOOTER, type FooterAction } from "@/contexts/shell-context";

export function useFooter(title: string, action?: FooterAction) {
  const { setFooter } = useShell();

  useEffect(() => {
    setFooter({ title, action });
    return () => setFooter(DEFAULT_FOOTER);
  }, [title, action?.label, action?.onClick, setFooter]);
}
