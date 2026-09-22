import { Button } from "../ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "../ui/dialog";

interface DeleteDialogProps<T extends { id: number | string; }> {
  data: T | null;
  title: string;
  itemName?: string;
  open: boolean;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: T) => void;
}

export function DeleteDialog<T extends { id: number | string; }>({ 
  data, 
  title,
  itemName,
  open, 
  isPending,
  onOpenChange,
  onConfirm,
}: Readonly<DeleteDialogProps<T>>) {
  const handleConfirm = () => {
    if (!data) return;
    onConfirm(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir {itemName}?
          </DialogDescription>
        </DialogHeader>

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
            className="flex-1 border-transparent text-white bg-destructive hover:bg-destructive/90"
          >
            {isPending ? 'Excluindo...' : 'Sim'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}