import { useContext } from "react";
import { ShellContext } from "@/contexts/shell-context";

export function useShell() {
  const ctx = useContext(ShellContext);
  if (!ctx) 
    throw new Error('Uso indevido do useShell');
  return ctx;
}
