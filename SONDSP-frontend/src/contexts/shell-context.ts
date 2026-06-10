import { createContext } from "react";

export type FooterAction = { label: string; onClick: () => void };
export type FooterConfig = { title: string; action?: FooterAction };

export type ShellContextValue = {
  footer: FooterConfig;
  setFooter: (config: FooterConfig) => void;
};

export const ShellContext = createContext<ShellContextValue | null>(null);
export const DEFAULT_FOOTER: FooterConfig = { title: "" };
