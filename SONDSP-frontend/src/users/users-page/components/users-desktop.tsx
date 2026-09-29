import { useState } from "react";

import type { UserListItem } from "@/users/users.types";
import { useChangeUserStatus, useUsers } from "../use-users";
import { useTableState } from "@/hooks/use-table-state";
import { buildPaginationProps } from "@/api/types";

import { UserUpsertPanel } from "./user-upsert-panel";
import { FilterBar } from "@/components/FilterBar/FilterBar";
import { DataTable, type ColumnDef, type RowAction } from "@/components/DataTable/DataTable";
import { InactivateDialog } from "@/components/Dialog/InactivateDialog";

const columns: ColumnDef<UserListItem>[] = [
  { id: "registration", header: "Registro Funcional (RF)", width: "14%" },
  { id: "name", header: "Nome", width: "20%" },
  { id: "email", header: "Email", width: "26%" },
  { id: "role", header: "Função", width: "16%" },
  { id: "status", header: "Status", width: "10%" }
];

export function UsersDesktop() {
  const { filter, setFilter, debouncedFilter, page, setPage, size } = useTableState(5);

  const { data: usersPage, isFetching } = useUsers({
    page,
    size,
    ...(debouncedFilter.trim() ? { search: debouncedFilter.trim() } : {})
  });
  const { mutate, isPending } = useChangeUserStatus();

  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [statusUser, setStatusUser] = useState<UserListItem | null>(null);

  const actions: RowAction<UserListItem>[] = [
    { type: "edit", onClick: (user) => setEditUserId(user.id), disabled: (user) => !user.status },
    { type: "inactivate", onClick: (user) => setStatusUser(user), isActive: (user) => user.status },
  ];

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <UserUpsertPanel
        userIdToEdit={editUserId}
        onCancelEdit={() => setEditUserId(null)} 
      />
      
      <FilterBar value={filter} onChange={setFilter} />

      <DataTable<UserListItem>
        data={usersPage?.content ?? []}
        columns={columns}
        rowKey={(user) => user.id}
        actions={actions}
        emptyMessage="Nenhum usuário encontrado"
        isFetching={isFetching}
        pagination={usersPage ? buildPaginationProps(usersPage, setPage) : undefined}
      />

      <InactivateDialog<UserListItem>
        data={statusUser}
        title={statusUser?.status ? "Inativar Usuário" : "Ativar Usuário"}
        open={statusUser !== null}
        onOpenChange={(open) => { if (!open) setStatusUser(null); }}
        isPending={isPending}
        onConfirm={(user) => 
          mutate(user.id, {
            onSuccess: () => {
              setStatusUser(null);
              
              if (user.id === editUserId) {
                setEditUserId(null);
              }
            } 
          })
        }
      />
    </div>
  );
}