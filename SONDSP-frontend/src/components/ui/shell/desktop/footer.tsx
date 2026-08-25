import { useShell } from "@/hooks/use-shell";
import { Button } from "../../button";

export function DesktopShellFooter() {
  const { footer } = useShell();

  return (
    <footer className="min-w-0 overflow-hidden border-t border-white/10 bg-[#0a4b93] px-4 py-6 text-sm font-medium text-white lg:px-6">
      <div className="grid min-w-0 grid-cols-[minmax(0,auto)_minmax(0,1fr)_minmax(0,auto)] items-center gap-2">
        <div className="min-w-0 flex justify-start overflow-hidden">
          {footer.leftAction && (
            <Button
              onClick={footer.leftAction.onClick}
              className="max-w-full shrink overflow-hidden px-4 shadow-sm"
              disabled={footer.leftAction.disabled}
              title={footer.leftAction.label}
            >
              {footer.leftAction.icon}
              <span className="truncate">{footer.leftAction.label}</span>
            </Button>
          )}
        </div>

        <div className="min-w-0 overflow-hidden text-center">
          <span className="block truncate">{footer.title}</span>
        </div>

        <div className="min-w-0 flex justify-end overflow-hidden">
          {footer.rightAction && (
            <Button
              onClick={footer.rightAction.onClick}
              className="max-w-full shrink overflow-hidden px-4 shadow-sm"
              disabled={footer.rightAction.disabled}
              title={footer.rightAction.label}
            >
              {footer.rightAction.icon}
              <span className="truncate">{footer.rightAction.label}</span>
            </Button>
          )}
        </div>
      </div>
    </footer>
  );
}