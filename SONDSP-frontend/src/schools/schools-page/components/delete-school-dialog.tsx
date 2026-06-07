import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

import type { School } from '../../schools.types';
import { useDeleteSchool } from '../use-schools';

interface DeleteSchoolDialogProps {
  school: School | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteSchoolDialog({ school, open, onOpenChange }: Readonly<DeleteSchoolDialogProps>) {
  const { mutate, isPending } = useDeleteSchool();

  const handleConfirm = () => {
    if (!school) return;
    mutate(school.id, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Excluir Escola</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir a {school?.name}?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 sm:flex-none"
          >
            Não
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isPending}
            className="flex-1 border-green-200 bg-green-50 text-green-700 hover:bg-green-100 sm:flex-none"
          >
            {isPending ? 'Excluindo...' : 'Sim'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
