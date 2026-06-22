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

interface DeleteDialogProps<T extends { id: number | string; name: string; status?: boolean }> {
  data: T | null;
  title: string;
  open: boolean;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: T) => void;
  children?: React.ReactNode;
}

export function DeleteDialog<T extends { id: number | string; name: string; status?: boolean }>({ 
  data, 
  title,
  open, 
  isPending,
  onOpenChange,
  onConfirm,
  children,
}: Readonly<DeleteDialogProps<T>>) {
  const handleConfirm = () => {
    if (!data) return;
    onConfirm(data);
  };

  const isInactive = data?.status === false;
  const actionText = isInactive ? "ativar" : "inativar";
  const pendingText = isInactive ? "Ativando..." : "Inativando...";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
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
            className="flex-1 border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-700"
          >
            Não
          </Button>

          <Button
            size="lg"
            onClick={handleConfirm}
            disabled={isPending}
            className={cn(
              "flex-1 border-transparent text-white",
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