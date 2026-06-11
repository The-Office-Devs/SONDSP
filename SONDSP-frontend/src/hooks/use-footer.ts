import { useEffect, useRef, type DependencyList } from "react";
import { useShell } from "./use-shell";
import { DEFAULT_FOOTER, type FooterConfig } from "@/contexts/shell-context";

// Deps para quando disabled true or false
export function useFooter(config: FooterConfig, deps: DependencyList = []) {
  const { setFooter } = useShell();

  const ref = useRef(config);
  useEffect(() => {
    ref.current = config;
  });

  useEffect(() => {
    const { title, leftAction, rightAction, useMobileDefaultFooter } = ref.current;

    setFooter({ 
      title, 
      useMobileDefaultFooter: useMobileDefaultFooter ?? true,
       leftAction: leftAction && {
        ...leftAction,
        onClick: () => ref.current.leftAction!.onClick(),
      },
      rightAction: rightAction && {
        ...rightAction,
        onClick: () => ref.current.rightAction!.onClick(),
      },  
    });
    return () => setFooter(DEFAULT_FOOTER);
  }, [
    config.title,
    config.leftAction?.label,
    config.leftAction?.disabled,
    config.rightAction?.label,
    config.rightAction?.disabled,
    config.useMobileDefaultFooter,
    setFooter,
    ...deps,
  ]);
}
