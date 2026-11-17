import { useHasPermission } from "@/auth/use-permission";
import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { type UserFormData, type UserFormInput, userSchema } from "../user-schema";
import { useCreateUser, useUpdateUser, useUser } from "../use-users";
import { useRoles } from "@/roles/roles-page/use-roles";
import { getTitle } from "@/lib/card-utils";
import { getSubmitLabel } from "@/lib/form-utils";
import { roleOptions } from "@/lib/options-utils";

import { Card } from "@/components/Card/Card";
import { TextField } from "@/components/HookForm/fields/TextField";
import { ComboboxField } from "@/components/HookForm/fields/ComboBoxField";

const defaultValues: UserFormInput = {
  email: "",
  registration: "",
  name: "",
  roleId: 0
};

type UserUpsertPanelProps = {
  userIdToEdit: number | null;
  onCancelEdit: () => void;
};

export function UserUpsertPanel({
  userIdToEdit,
  onCancelEdit,
}: Readonly<UserUpsertPanelProps>) {
  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { data: user, isLoading: isLoadingUser } = useUser(userIdToEdit);
  const { data: dynamicRoles } = useRoles();

  const isEditMode = userIdToEdit !== null;
  const isPending = isCreating || isUpdating;
  const canManageUsers = useHasPermission("USUARIO_MANAGE");


  const title = getTitle("Usuário", isEditMode, false);
  const submitType = isEditMode ? "edit" : "insert";
  const submitLabel = getSubmitLabel(isPending, submitType);

  const form = useForm<UserFormInput, unknown, UserFormData>({
    resolver: zodResolver(userSchema),
    mode: "onChange",
    defaultValues
  });

  const availableRoleOptions = useMemo(() => {
    if (dynamicRoles && dynamicRoles.length > 0) {
      return dynamicRoles.map((r) => ({
        value: String(r.id),
        label: r.name,
      }));
    }
    return roleOptions;
  }, [dynamicRoles]);

  useEffect(() => {
    if (!isEditMode) {
      form.reset(defaultValues);
      return;
    }

    if (user) {
      form.reset({
        email: user.email,
        registration: user.registration,
        name: user.name,
        roleId: user.role.id,
      });
    }
  }, [isEditMode, user, form]);

  const onSubmit = (data: UserFormData) => {
    const payload = {
      ...data,
      roleId: data.roleId,
    };

    if (isEditMode && userIdToEdit) {
      updateUser(
        { id: userIdToEdit, data: payload },
        {
          onSuccess: () => {
            form.reset(defaultValues);
            onCancelEdit();
          },
        }
      );
      return;
    }

    createUser(payload, {
      onSuccess: () => {
        form.reset(defaultValues);
      },
    });
  };

  const handleCancelEdit = () => {
    form.reset(defaultValues);
    onCancelEdit();
  };

  const isSubmitDisabled = isPending || isLoadingUser || !form.formState.isValid || !canManageUsers;

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
        <TextField
          name="email"
          label="E-mail Institucional"
          placeholder="email@sme.prefeitura.gov.br"
        />

        <TextField
          name="registration"
          label="Registro Funcional (RF)"
          placeholder="Registro funcional do usuário"
          maxLength={8}
          onlyNumbers
        />

        <TextField name="name" label="Nome Completo" placeholder="Nome completo do usuário" />

        <ComboboxField
          name="roleId"
          label="Função no Sistema"
          placeholder="Selecione a função"
          options={availableRoleOptions}
          emptyMessage="Nenhuma função encontrada."
        />


      </Card>
    </FormProvider>
  );
}
