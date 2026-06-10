import { Button } from "../ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "../ui/dialog";

interface DeleteDialogProps<T extends { id: number | string; name: string }> {
  data: T | null;
  title: string;
  open: boolean;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: T) => void;
}

export function DeleteDialog<T extends { id: number | string; name: string }>({ 
  data, 
  title,
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
            Tem certeza que deseja excluir {data?.name}?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex w-full flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            size="lg"
            onClick={() => onOpenChange(false)}
            className="flex-1 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
          >
            Não
          </Button>

          <Button
            size="lg"
            onClick={handleConfirm}
            disabled={isPending}
            className="flex-1 border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
          >
            {isPending ? 'Excluindo...' : 'Sim'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}