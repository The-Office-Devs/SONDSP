import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

import { useDeleteUser } from '../use-users';
import type { User } from '@/users/users.types';

interface DeleteUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteUserDialog({ user, open, onOpenChange }: Readonly<DeleteUserDialogProps>) {
  const { mutate, isPending } = useDeleteUser();

  const handleConfirm = () => {
    if (!user) return;
    mutate(user.id, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Excluir Usuário</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir a {user?.name}?
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
