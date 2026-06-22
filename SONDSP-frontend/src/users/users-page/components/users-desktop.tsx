import { useState } from "react";

import type { UserListItem } from "@/users/users.types";
import { useChangeUserStatus, useUsers } from "../use-users";
import { useTableState } from "@/hooks/useTableState";
import { buildPaginationProps } from "@/api/types";

import { UserUpsertPanel } from "./user-upsert-panel";
import { FilterBar } from "@/components/FilterBar/FilterBar";
import { DataTable, type ColumnDef, type RowAction } from "@/components/DataTable/DataTable";

const columns: ColumnDef<UserListItem>[] = [
  { id: "registration", header: "Registro Funcional (RF)", width: "140px" },
  { id: "name", header: "Nome", width: "180px" },
  { id: "email", header: "Email", width: "260px" },
  { id: "role", header: "Função", width: "140px" },
  { id: "status", header: "Status", width: "120px" }
];

export function UsersDesktop() {
  const { filter, setFilter, debouncedFilter, page, setPage, size } = useTableState(5);

  const { data: usersPage, isLoading, isFetching } = useUsers({
    page,
    size,
    ...(debouncedFilter.trim() ? { search: debouncedFilter.trim() } : {})
  });
  const { mutate } = useChangeUserStatus();

  const [editUserId, setEditUserId] = useState<number | null>(null);

  const actions: RowAction<UserListItem>[] = [
    { type: "edit", onClick: (user) => setEditUserId(user.id), disabled: (user) => !user.status },
    { type: "delete", onClick: (user) => mutate(user.id) },
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
        data={usersPage?.content ?? []}
        columns={columns}
        rowKey={(user) => user.id}
        actions={actions}
        emptyMessage="Nenhum usuário encontrado"
        isFetching={isFetching}
        pagination={usersPage ? buildPaginationProps(usersPage, setPage) : undefined}
      />
    </div>
  );
}