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

import type { UserListItem } from "@/users/users.types";
import { useUsers } from '../use-schools';
import { DataTable, type ColumnDef, type RowAction } from '@/components/DataTable/DataTable';
import { useTableState } from '@/hooks/useTableState';
import { buildPaginationProps } from '@/api/types';

interface LinkUsersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isTeachers?: boolean;
}

const columns: ColumnDef<UserListItem>[] = [
  { id: "registration", header: "Registro Funcional (RF)", width: "150px" },
  { id: "name", header: "Nome", width: "250px" },
  { id: "role", header: "Função", width: "100px" },
];

export function LinkUsersDialog({ open, onOpenChange, isTeachers = false }: Readonly<LinkUsersDialogProps>) {
  const { filter, setFilter, debouncedFilter, page, setPage, size } = useTableState(5);

  const { data: usersPage, isLoading, isFetching } = useUsers({
    status: true,
    page,
    size,
    ...(debouncedFilter.trim() ? { search: debouncedFilter.trim() } : {})
  });

  const handleLink = (userName: string) => {
    const userType = isTeachers ? "Professor" : "Usuário";
    toast.success(`${userType} "${userName}" vinculado com sucesso.`);
  };

  const actions: RowAction<UserListItem>[] = [
    { type: "link", onClick: (user) => handleLink(user.name) },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Vincular {isTeachers ? "Professores" : "Usuários"}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <p className="text-sm text-slate-500">Carregando {isTeachers ? "professores" : "usuários"}...</p>
          </div>
        ) : (
          <>
            <FilterBar value={filter} onChange={setFilter} />

            <DataTable<UserListItem>
              data={usersPage?.content ?? []}
              columns={columns}
              rowKey={(user) => user.id}
              actions={actions}
              emptyMessage={isTeachers ? "Nenhum professor encontrado" : "Nenhum usuário encontrado"}
              isFetching={isFetching}
              pagination={usersPage ? buildPaginationProps(usersPage, setPage) : undefined}
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
