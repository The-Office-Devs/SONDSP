import { useEffect } from "react";
import { DEFAULT_HEADER, type HeaderConfig } from "@/contexts/shell-context";
import { useShell } from "./use-shell";

export function useHeader(config: HeaderConfig) {
  const { setHeader } = useShell();

  useEffect(() => {
    setHeader({ title: config.title, variant: config.variant ?? "menu" });
    return () => setHeader(DEFAULT_HEADER);
  }, [config.title, config.variant, setHeader]);
}