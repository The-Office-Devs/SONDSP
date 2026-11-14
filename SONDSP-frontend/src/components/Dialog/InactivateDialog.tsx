import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "../ui/dialog";

interface InactivateDialogProps<T extends { id: number | string; name: string; status?: boolean }> {
  data: T | null;
  title: string;
  open: boolean;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: T) => void;
  children?: React.ReactNode;
}

export function InactivateDialog<T extends { id: number | string; name: string; status?: boolean }>({ 
  data, 
  title,
  open, 
  isPending,
  onOpenChange,
  onConfirm,
  children,
}: Readonly<InactivateDialogProps<T>>) {
  const handleConfirm = () => {
    if (!data) return;
    onConfirm(data);
  };

  const isInactive = data?.status === false;
  const actionText = isInactive ? "ativar" : "inativar";
  const pendingText = isInactive ? "Ativando..." : "Inativando...";

    return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[calc(100%-2rem)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja {actionText} {data?.name}?
          </DialogDescription>
        </DialogHeader>
        {children}

        <DialogFooter className="flex w-full flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            size="lg"
            onClick={() => onOpenChange(false)}
            className="border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-700 sm:flex-1"
          >
            Não
          </Button>

          <Button
            size="lg"
            onClick={handleConfirm}
            disabled={isPending}
            className={cn(
              "border-transparent text-white sm:flex-1",
              isInactive 
                ? "bg-emerald-600 hover:bg-emerald-700" 
                : "bg-destructive hover:bg-destructive/90"
            )}
          >
            {isPending ? pendingText : 'Sim'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}