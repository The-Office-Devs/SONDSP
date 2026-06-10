import { useShell } from "@/hooks/use-shell";

export function ShellFooter() {
  const { footer } = useShell();

  return (
    <footer className="border-t border-white/10 bg-[#0a4b93] px-4 py-6 text-center text-sm font-medium text-white lg:px-6">
      <span> {footer.title} </span>

      { /* botao basico - alterar dps */ }
      {footer.action && (
        <button onClick={footer.action.onClick}>{footer.action.label}</button>
      )}
    </footer>
  );
}
