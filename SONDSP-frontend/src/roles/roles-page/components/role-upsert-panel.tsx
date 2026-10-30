import { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldAlert } from "lucide-react";

import { type RoleFormSchema, roleSchema } from "../role-schema";
import { useCreateRole, useUpdateRole, useRole, useGroupedPermissions } from "../use-roles";
import { getTitle } from "@/lib/card-utils";
import { getSubmitLabel } from "@/lib/form-utils";

import { Card } from "@/components/Card/Card";
import { TextField } from "@/components/HookForm/fields/TextField";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const defaultValues: RoleFormSchema = {
  name: "",
  permissionIds: [],
};

type RoleUpsertPanelProps = {
  roleIdToEdit: number | null;
  onCancelEdit: () => void;
};

export function RoleUpsertPanel({
  roleIdToEdit,
  onCancelEdit,
}: Readonly<RoleUpsertPanelProps>) {
  const { mutate: createRole, isPending: isCreating } = useCreateRole();
  const { mutate: updateRole, isPending: isUpdating } = useUpdateRole();
  const { data: role, isLoading: isLoadingRole } = useRole(roleIdToEdit);
  const { data: groupedPermissions, isLoading: isLoadingPermissions } = useGroupedPermissions();

  const isEditMode = roleIdToEdit !== null;
  const isPending = isCreating || isUpdating;

  const title = getTitle("Função", isEditMode, false);
  const submitType = isEditMode ? "edit" : "insert";
  const submitLabel = getSubmitLabel(isPending, submitType);

  const form = useForm<RoleFormSchema>({
    resolver: zodResolver(roleSchema),
    mode: "onChange",
    defaultValues,
  });

  const selectedPermissionIds = useWatch({
    control: form.control,
    name: "permissionIds",
    defaultValue: [],
  }) ?? [];

  const isAdminRole = role?.isAdmin ?? false;

  useEffect(() => {
    if (!isEditMode) {
      form.reset(defaultValues);
      return;
    }

    if (role) {
      form.reset({
        name: role.name,
        permissionIds: role.permissions ? role.permissions.map((p) => p.id) : [],
      });
    }
  }, [isEditMode, role, form]);

  const handleTogglePermission = (permissionId: number) => {
    if (isAdminRole) return;
    const current = new Set(selectedPermissionIds);
    if (current.has(permissionId)) {
      current.delete(permissionId);
    } else {
      current.add(permissionId);
    }
    form.setValue("permissionIds", Array.from(current), { shouldValidate: true });
  };

  const handleToggleArea = (areaPermissionIds: number[]) => {
    if (isAdminRole) return;
    const current = new Set(selectedPermissionIds);
    const allSelected = areaPermissionIds.every((id) => current.has(id));

    if (allSelected) {
      areaPermissionIds.forEach((id) => current.delete(id));
    } else {
      areaPermissionIds.forEach((id) => current.add(id));
    }

    form.setValue("permissionIds", Array.from(current), { shouldValidate: true });
  };

  const onSubmit = (data: RoleFormSchema) => {
    if (isEditMode && roleIdToEdit) {
      updateRole(
        { id: roleIdToEdit, data },
        {
          onSuccess: () => {
            form.reset(defaultValues);
            onCancelEdit();
          },
        }
      );
      return;
    }

    createRole(data, {
      onSuccess: () => {
        form.reset(defaultValues);
      },
    });
  };

  const handleCancelEdit = () => {
    form.reset(defaultValues);
    onCancelEdit();
  };

  const isSubmitDisabled = isPending || isLoadingRole || !form.formState.isValid;

  return (
    <FormProvider {...form}>
      <Card
        title={title}
        submitLabel={submitLabel}
        isEditMode={isEditMode}
        isFilter={false}
        isSubmitDisabled={isSubmitDisabled}
        onSubmit={form.handleSubmit(onSubmit)}
        onReset={handleCancelEdit}
      >
        <div className="space-y-6">
          <TextField
            name="name"
            label="Nome da Função"
            placeholder="Ex.: Coordenador Pedagógico, Professor Auxiliar"
            disabled={isAdminRole}
          />

          {isAdminRole && (
            <div className="flex items-center gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-900 dark:border-amber-700/50 dark:bg-amber-950/30 dark:text-amber-200">
              <ShieldAlert className="size-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div className="text-sm">
                <strong>Função de Administrador do Sistema:</strong> Esta função possui acesso pleno a todas as ações e ferramentas do sistema. Suas permissões são irrevogáveis.
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <h3 className="text-base font-semibold text-foreground">Permissões da Função</h3>
                <p className="text-xs text-muted-foreground">
                  Selecione as permissões que os usuários com esta função terão no sistema.
                </p>
              </div>
              <Badge variant="outline" className="font-normal">
                {selectedPermissionIds.length} selecionada(s)
              </Badge>
            </div>

            {isLoadingPermissions ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Carregando catálogo de permissões...
              </div>
            ) : (
              <div className="space-y-5">
                {groupedPermissions?.map((group) => {
                  const areaIds = group.permissions.map((p) => p.id);
                  const allAreaSelected = areaIds.length > 0 && areaIds.every((id) => selectedPermissionIds.includes(id));

                  return (
                    <div
                      key={group.area}
                      className="rounded-lg border border-border/80 bg-card p-4 shadow-xs transition-colors"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-foreground">{group.area}</span>
                          <span className="text-xs text-muted-foreground">
                            ({group.permissions.length} permissõ{group.permissions.length > 1 ? "es" : "ão"})
                          </span>
                        </div>

                        {!isAdminRole && (
                          <button
                            type="button"
                            onClick={() => handleToggleArea(areaIds)}
                            className="cursor-pointer text-xs font-medium text-primary hover:underline"
                          >
                            {allAreaSelected ? "Desmarcar todos" : "Selecionar todos"}
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-2">
                        {group.permissions.map((perm) => {
                          const isChecked = isAdminRole || selectedPermissionIds.includes(perm.id);

                          return (
                            <label
                              key={perm.id}
                              className={`flex items-start gap-3 rounded-md border p-2.5 transition-all ${
                                isChecked
                                  ? "border-primary/40 bg-primary/5 text-foreground"
                                  : "border-border/60 bg-background/50 hover:bg-muted/40"
                              } ${isAdminRole ? "cursor-default opacity-85" : "cursor-pointer"}`}
                            >
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={() => handleTogglePermission(perm.id)}
                                disabled={isAdminRole}
                                className="mt-0.5"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium leading-tight">
                                  {perm.description || perm.permission}
                                </div>
                                <div className="mt-0.5 text-[11px] font-mono text-muted-foreground">
                                  {perm.permission}
                                </div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Card>
    </FormProvider>
  );
}
