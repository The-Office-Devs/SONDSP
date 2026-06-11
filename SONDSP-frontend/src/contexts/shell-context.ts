import { createContext, type ReactNode } from "react";

export type FooterAction = { 
  label: string; 
  onClick: () => void 
  icon?: ReactNode;
  disabled?: boolean;
};

export type FooterConfig = {
  title: string;
  leftAction?: FooterAction;
  rightAction?: FooterAction;
  useMobileDefaultFooter?: boolean;
}

export type HeaderConfig = {
  title: string;
  variant?: "menu" | "back";
  onSearch?: () => void;
};

export type ShellContextValue = {
  footer: FooterConfig;
  setFooter: (config: FooterConfig) => void;
  header: HeaderConfig;
  setHeader: (config: HeaderConfig) => void;
};

export const ShellContext = createContext<ShellContextValue | null>(null);

export const DEFAULT_FOOTER: FooterConfig = { title: "", useMobileDefaultFooter: true };
export const DEFAULT_HEADER: HeaderConfig = { title: "", variant: "menu" };
