import { useEffect, useMemo } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldAlert, Lock } from "lucide-react";

import { useRole, useCreateRole, useUpdateRole, useGroupedPermissions } from "../use-roles";
import { roleSchema, defaultValues, type RoleFormSchema } from "../role-schema";
import { getSubmitLabel } from "@/lib/form-utils";
import { getTitle } from "@/lib/card-utils";
import { useHasPermission } from "@/auth/use-permission";

import { Card } from "@/components/Card/Card";
import { TextField } from "@/components/HookForm/fields/TextField";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface RoleUpsertPanelProps {
  roleIdToEdit: number | null;
  onCancelEdit: () => void;
}

const VIEW_PERMISSIONS_BY_AREA: Record<string, string> = {
  Alunos: "ALUNO_VIEW",
  Turmas: "TURMA_VIEW",
  Sondagens: "SONDAGEM_VIEW",
  Atividades: "ATIVIDADE_VIEW",
  Usuários: "USUARIO_VIEW",
  "Anotações / Portfólio": "PORTFOLIO_VIEW",
  "Funções e Permissões": "FUNCAO_VIEW",
};

export function RoleUpsertPanel({ roleIdToEdit, onCancelEdit }: Readonly<RoleUpsertPanelProps>) {
  const { mutate: createRole, isPending: isCreating } = useCreateRole();
  const { mutate: updateRole, isPending: isUpdating } = useUpdateRole();
  const { data: role, isLoading: isLoadingRole } = useRole(roleIdToEdit);
  const { data: rawGroupedPermissions, isLoading: isLoadingPermissions } = useGroupedPermissions();
  const canManageRoles = useHasPermission("FUNCAO_MANAGE");

  const isEditMode = roleIdToEdit !== null;
  const isPending = isCreating || isUpdating;

  const title = getTitle("Função", isEditMode, false);
  const submitType = isEditMode ? "edit" : "insert";
  const submitLabel = getSubmitLabel(isPending, submitType);

  // Filtra permissões relacionadas a escolas para nunca exibir no painel
  const groupedPermissions = useMemo(() => {
    if (!rawGroupedPermissions) return [];
    return rawGroupedPermissions
      .filter((group) => group.area?.toLowerCase() !== "escolas")
      .map((group) => ({
        ...group,
        permissions: group.permissions.filter(
          (p) => !p.permission.startsWith("ESCOLA_") && p.area?.toLowerCase() !== "escolas"
        ),
      }))
      .filter((group) => group.permissions.length > 0);
  }, [rawGroupedPermissions]);

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

  // Mapa de permissões de visualização obrigatórias no momento
  const requiredViewPermissionIds = useMemo(() => {
    const required = new Set<number>();
    if (!groupedPermissions) return required;

    for (const group of groupedPermissions) {
      const viewCode = VIEW_PERMISSIONS_BY_AREA[group.area];
      const viewPerm = group.permissions.find(
        (p) => p.permission === viewCode || p.permission.endsWith("_VIEW")
      );

      if (!viewPerm) continue;

      // Verifica se há alguma outra permissão da mesma área selecionada
      const otherSelectedInArea = group.permissions.some(
        (p) => p.id !== viewPerm.id && selectedPermissionIds.includes(p.id)
      );

      if (otherSelectedInArea) {
        required.add(viewPerm.id);
      }
    }

    return required;
  }, [groupedPermissions, selectedPermissionIds]);

  // Garante que, se há ações ativas, a visualização esteja selecionada no form
  useEffect(() => {
    if (isAdminRole) return;
    const current = new Set(selectedPermissionIds);
    let changed = false;

    requiredViewPermissionIds.forEach((id) => {
      if (!current.has(id)) {
        current.add(id);
        changed = true;
      }
    });

    if (changed) {
      form.setValue("permissionIds", Array.from(current), { shouldValidate: true });
    }
  }, [requiredViewPermissionIds, selectedPermissionIds, isAdminRole, form]);

  const handleTogglePermission = (permissionId: number, groupArea: string) => {
    if (isAdminRole) return;

    // Se a permissão for a de visualização e for obrigatória, não pode desmarcar
    if (requiredViewPermissionIds.has(permissionId)) {
      return;
    }

    const current = new Set(selectedPermissionIds);
    const willSelect = !current.has(permissionId);

    if (willSelect) {
      current.add(permissionId);
      // Ao marcar qualquer ação da área, adiciona automaticamente a permissão de visualização
      const group = groupedPermissions.find((g) => g.area === groupArea);
      if (group) {
        const viewCode = VIEW_PERMISSIONS_BY_AREA[groupArea];
        const viewPerm = group.permissions.find(
          (p) => p.permission === viewCode || p.permission.endsWith("_VIEW")
        );
        if (viewPerm) {
          current.add(viewPerm.id);
        }
      }
    } else {
      current.delete(permissionId);
    }

    form.setValue("permissionIds", Array.from(current), { shouldValidate: true });
  };

  const handleToggleArea = (_groupArea: string, areaPermissionIds: number[]) => {
    if (isAdminRole) return;
    const current = new Set(selectedPermissionIds);
    const allSelected = areaPermissionIds.every((id) => current.has(id));

    if (allSelected) {
      // Desmarcar todos da área
      areaPermissionIds.forEach((id) => current.delete(id));
    } else {
      // Selecionar todos da área
      areaPermissionIds.forEach((id) => current.add(id));
    }

    form.setValue("permissionIds", Array.from(current), { shouldValidate: true });
  };

  const onSubmit = (data: RoleFormSchema) => {
    if (!canManageRoles) return;

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

  const isSubmitDisabled =
    isPending || isLoadingRole || !form.formState.isValid || !canManageRoles;

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
        <div className="space-y-6 md:col-span-2 xl:col-span-3">
          <TextField
            name="name"
            label="Nome da Função"
            placeholder="Ex.: Coordenador Pedagógico, Professor Auxiliar"
            disabled={isAdminRole || !canManageRoles}
          />

          {isAdminRole && (
            <div className="flex items-center gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-900 dark:border-amber-700/50 dark:bg-amber-950/30 dark:text-amber-200">
              <ShieldAlert className="size-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div className="text-sm">
                <strong>Função de Administrador do Sistema:</strong> Esta função possui acesso pleno a todas as ações e ferramentas do sistema. Suas permissões são irrevogáveis.
              </div>
            </div>
          )}

          {!canManageRoles && (
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              <Lock className="size-4 shrink-0 text-slate-500" />
              <span>Você não possui permissão para criar ou editar funções (requer permissão de gerenciamento).</span>
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groupedPermissions.map((group) => {
                  const areaIds = group.permissions.map((p) => p.id);
                  const allAreaSelected =
                    areaIds.length > 0 && areaIds.every((id) => selectedPermissionIds.includes(id));

                  return (
                    <div
                      key={group.area}
                      className="min-w-0 rounded-lg border border-border/80 bg-card p-4 shadow-xs transition-colors"
                    >
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-foreground">{group.area}</span>
                          <span className="text-xs text-muted-foreground">
                            ({group.permissions.length} permissõ{group.permissions.length > 1 ? "es" : "ão"})
                          </span>
                        </div>

                        {!isAdminRole && canManageRoles && (
                          <button
                            type="button"
                            onClick={() => handleToggleArea(group.area, areaIds)}
                            className="cursor-pointer text-xs font-medium text-primary hover:underline"
                          >
                            {allAreaSelected ? "Desmarcar todos" : "Selecionar todos"}
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-2.5">
                        {group.permissions.map((perm) => {
                          const isRequiredView = requiredViewPermissionIds.has(perm.id);
                          const isChecked =
                            isAdminRole || isRequiredView || selectedPermissionIds.includes(perm.id);
                          const isDisabled = isAdminRole || isRequiredView || !canManageRoles;

                          return (
                            <label
                              key={perm.id}
                              className={`flex items-start gap-3 rounded-md border p-2.5 transition-all ${
                                isChecked
                                  ? "border-primary/40 bg-primary/5 text-foreground"
                                  : "border-border/60 bg-background/50 hover:bg-muted/40"
                              } ${isDisabled ? "cursor-default opacity-85" : "cursor-pointer"}`}
                            >
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={() => handleTogglePermission(perm.id, group.area)}
                                disabled={isDisabled}
                                className="mt-0.5"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-sm font-medium leading-tight">
                                    {perm.description || perm.permission}
                                  </span>
                                  {isRequiredView && !isAdminRole && (
                                    <Badge
                                      variant="outline"
                                      className="text-[10px] font-normal text-amber-700 bg-amber-50 border-amber-200 shrink-0"
                                    >
                                      Obrigatória
                                    </Badge>
                                  )}
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
