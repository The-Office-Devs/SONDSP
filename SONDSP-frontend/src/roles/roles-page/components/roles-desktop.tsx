import { useState, useMemo } from "react";

import { useRoles, useDeleteRole } from "../use-roles";
import type { Role } from "../../roles.types";
import { RoleUpsertPanel } from "./role-upsert-panel";
import { FilterBar } from "@/components/FilterBar/FilterBar";
import { DataTable, type ColumnDef, type RowAction } from "@/components/DataTable/DataTable";
import { DeleteDialog } from "@/components/Dialog/DeleteDialog";

export function RolesDesktop() {
  const { data: roles = [], isFetching } = useRoles();
  const { mutate: deleteRole, isPending: isDeleting } = useDeleteRole();

  const [filter, setFilter] = useState("");
  const [editRoleId, setEditRoleId] = useState<number | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  const filteredRoles = useMemo(() => {
    if (!filter.trim()) return roles;
    const term = filter.toLowerCase().trim();
    return roles.filter(
      (r) =>
        r.name.toLowerCase().includes(term) ||
        r.id.toString().includes(term) ||
        r.permissions.some((p) => p.description.toLowerCase().includes(term))
    );
  }, [roles, filter]);

  const columns: ColumnDef<Role>[] = [
    { id: "id", header: "ID", width: "10%" },
    {
      id: "name",
      header: "Nome da Função",
      width: "45%",
      accessor: (role: Role) => (role.isAdmin ? `${role.name} (Admin)` : role.name),
    },
    {
      id: "permissions",
      header: "Permissões",
      width: "45%",
      accessor: (role: Role) =>
        role.isAdmin
          ? `Acesso Total (${role.permissions?.length ?? 0} permissões)`
          : `${role.permissions?.length ?? 0} permissão(ões) vinculada(s)`,
    },
  ];

  const actions: RowAction<Role>[] = [
    {
      type: "edit",
      onClick: (role) => setEditRoleId(role.id),
    },
    {
      type: "delete",
      onClick: (role) => setRoleToDelete(role),
      disabled: (role) => role.isAdmin,
    },
  ];

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <RoleUpsertPanel
        roleIdToEdit={editRoleId}
        onCancelEdit={() => setEditRoleId(null)}
      />

      <FilterBar value={filter} onChange={setFilter} />

      <DataTable<Role>
        data={filteredRoles}
        columns={columns}
        rowKey={(role) => role.id}
        actions={actions}
        emptyMessage="Nenhuma função encontrada"
        isFetching={isFetching}
      />

      <DeleteDialog<Role>
        data={roleToDelete}
        title="Excluir Função"
        itemName={roleToDelete ? `a função "${roleToDelete.name}"` : ""}
        open={roleToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setRoleToDelete(null);
        }}
        isPending={isDeleting}
        onConfirm={(role) =>
          deleteRole(role.id, {
            onSuccess: () => {
              setRoleToDelete(null);
              if (role.id === editRoleId) {
                setEditRoleId(null);
              }
            },
          })
        }
      />
    </div>
  );
}
