import { useMemo, useState } from "react";

import type { User } from "@/users/users.types";
import { useUsers } from "../use-users";

import { UserFilterBar } from "./user-filter-bar";
import { UsersTable } from "./users-table";
import { DeleteUserDialog } from "./delete-user-dialog";
import { UserRegistrationPanel } from "./user-registration-panel";

export function UsersDesktop() {
  const { data: users = [], isLoading } = useUsers();
  const [filter, setFilter] = useState('');

  // Dialog state
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  const filteredUsers = useMemo(() => {
    //TODO: implementar paginação na tabela e filtro disparando requisição para o backend
    if (!filter.trim()) return users;
    const lowerFilter = filter.toLowerCase();
    return users.filter((s) => s.name.toLowerCase().includes(lowerFilter));
  }, [users, filter]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-sm text-slate-500">Carregando usuários...</p>
      </div>
    );
  }

  //TODO: Adicionar edição
  return (
    <div className="space-y-4 p-4 lg:p-6">
      <UserRegistrationPanel />
      <UserFilterBar value={filter} onChange={setFilter} />
      <UsersTable
        users={filteredUsers}
        onEdit={(user) => setEditUser(user)}
        onDelete={(user) => setDeleteUser(user)}
      />

      <DeleteUserDialog
        user={deleteUser}
        open={deleteUser !== null}
        onOpenChange={(open) => { if (!open) setDeleteUser(null); }}
      />
    </div>
  );
}