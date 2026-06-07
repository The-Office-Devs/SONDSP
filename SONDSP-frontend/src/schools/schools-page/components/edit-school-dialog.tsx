import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

import type { School } from '../../schools.types';
import { useUpdateSchool } from '../use-schools';

interface EditSchoolDialogProps {
  school: School | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditSchoolDialog({ school, open, onOpenChange }: Readonly<EditSchoolDialogProps>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {school && (
        <EditSchoolDialogContent
          key={school.id}
          school={school}
          onOpenChange={onOpenChange}
        />
      )}
    </Dialog>
  );
}

function EditSchoolDialogContent({
  school,
  onOpenChange,
}: Readonly<{ school: School; onOpenChange: (open: boolean) => void }>) {
  const [name, setName] = useState(school.name);
  const [director, setDirector] = useState('');
  const { mutate, isPending } = useUpdateSchool();

  const handleSave = () => {
    if (!name.trim()) return;
    mutate(
      { id: school.id, data: { name: name.trim() } },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Editar Escola</DialogTitle>
      </DialogHeader>

      <div className="grid gap-4 py-2">
        <div className="space-y-2">
          <Label htmlFor="edit-school-name" className="text-sm font-normal text-slate-700">
            Nome
          </Label>
          <Input
            id="edit-school-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-10 bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-school-director" className="text-sm font-normal text-slate-700">
            Diretor
          </Label>
          <Input
            id="edit-school-director"
            value={director}
            onChange={(e) => setDirector(e.target.value)}
            placeholder="Nome do diretor"
            className="h-10 bg-white"
          />
        </div>
      </div>

      <DialogFooter className="gap-2 sm:gap-2">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="flex-1 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 sm:flex-none"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          disabled={isPending || !name.trim()}
          className="flex-1 border-green-200 bg-green-50 text-green-700 hover:bg-green-100 sm:flex-none"
        >
          {isPending ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
