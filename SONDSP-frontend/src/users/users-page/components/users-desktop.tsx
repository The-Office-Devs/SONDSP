import { useMemo, useState } from "react";

import type { UserListItem } from "@/users/users.types";
import { useDeleteUser, useUsers } from "../use-users";

import { UserUpsertPanel } from "./user-upsert-panel";
import { FilterBar } from "@/components/FilterBar/FilterBar";
import { DataTable, type ColumnDef, type RowAction } from "@/components/DataTable/DataTable";
import { DeleteDialog } from "@/components/Dialog/DeleteDialog";

const columns: ColumnDef<UserListItem>[] = [
  { id: "registration", header: "Registro Funcional (RF)", width: "160px" },
  { id: "name", header: "Nome", width: "220px" },
  { id: "email", header: "Email", width: "300px" },
  { id: "role", header: "Função", width: "160px" },
];

export function UsersDesktop() {
  const { data: users = [], isLoading } = useUsers();
  const { mutate, isPending } = useDeleteUser();

  const [filter, setFilter] = useState('');
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserListItem | null>(null);

  const filteredUsers = useMemo(() => {
    //TODO: implementar paginação na tabela e filtro disparando requisição para o backend
    if (!filter.trim()) return users;
    const lowerFilter = filter.toLowerCase();
    return users.filter((s) => s.name.toLowerCase().includes(lowerFilter));
  }, [users, filter]);

  const actions: RowAction<UserListItem>[] = [
    { type: "edit", onClick: (user) => setEditUserId(user.id) },
    { type: "delete", onClick: (user) => setDeleteUser(user) }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-sm text-slate-500">Carregando usuários...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <UserUpsertPanel
        userIdToEdit={editUserId}
        onCancelEdit={() => setEditUserId(null)} 
      />
      
      <FilterBar value={filter} onChange={setFilter} />

      <DataTable<UserListItem>
        data={users}
        columns={columns}
        rowKey={(user) => user.id}
        actions={actions}
        emptyMessage="Nenhum usuário encontrado"
      />

      <DeleteDialog<UserListItem>
        data={deleteUser}
        title="Excluir Usuário"
        open={deleteUser !== null}
        onOpenChange={(open) => { if (!open) setDeleteUser(null); }}
        isPending={isPending}
        onConfirm={(user) => 
          mutate(user.id, {
            onSuccess: () => setDeleteUser(null)
          })
        }
      />
    </div>
  );
}