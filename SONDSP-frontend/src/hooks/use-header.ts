import { useEffect, useRef, type DependencyList } from "react";
import { DEFAULT_HEADER, type HeaderConfig } from "@/contexts/shell-context";
import { useShell } from "./use-shell";

// Deps apenas para o seguir o mesmo padrão do footer
export function useHeader(config: HeaderConfig, deps: DependencyList = []) {
  const { setHeader } = useShell();

  const ref = useRef(config);
  useEffect(() => {
    ref.current = config;
  });

  useEffect(() => {
    const { title, variant, onSearch } = ref.current;

    setHeader({
      title,
      variant: variant ?? "menu",
      onSearch: onSearch && (() => ref.current.onSearch!()),
    });
    return () => setHeader(DEFAULT_HEADER);
  }, [config.title, config.variant, setHeader, ...deps]);
}