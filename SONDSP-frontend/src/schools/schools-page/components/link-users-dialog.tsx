import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { FilterBar } from '@/components/FilterBar/FilterBar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import type { School } from '../../schools.types';
import type { UserListItem } from "@/users/users.types";
import { useUsers } from '../use-schools';
import { DataTable, type ColumnDef, type RowAction } from '@/components/DataTable/DataTable';
import { useDebounce } from '@/hooks/useDebounce';

interface LinkUsersDialogProps {
  school: School | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const columns: ColumnDef<UserListItem>[] = [
  { id: "registration", header: "Registro Funcional (RF)", width: "150px" },
  { id: "name", header: "Nome", width: "250px" },
  { id: "role", header: "Função", width: "100px" },
];

export function LinkUsersDialog({ school, open, onOpenChange }: Readonly<LinkUsersDialogProps>) {
  const [filter, setFilter] = useState('');
  const debouncedFilter = useDebounce(filter);

  const { data: users = [], isLoading } = useUsers({
    status: true,
    ...debouncedFilter.trim() ? { search: debouncedFilter.trim() } : undefined
  })
    

  const handleLink = (userName: string) => {
    toast.success(`Usuário "${userName}" vinculado à escola "${school?.name}".`);
  };

  const actions: RowAction<UserListItem>[] = [
    { type: "link", onClick: (user) => handleLink(user.name) },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Vincular Usuários</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <p className="text-sm text-slate-500">Carregando usuários...</p>
          </div>
        ) : (
          <>
            <FilterBar value={filter} onChange={setFilter} />

            <DataTable<UserListItem>
              data={users}
              columns={columns}
              rowKey={(user) => user.id}
              actions={actions}
              emptyMessage="Nenhum usuário encontrado"
            />

            <div className="flex justify-start">
              <Button
                variant="ghost"
                className="text-slate-600 hover:text-slate-900"
                onClick={() => onOpenChange(false)}
              >
                Fechar
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
