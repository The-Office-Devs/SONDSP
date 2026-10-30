import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { type UserFormData, userSchema } from "../user-schema";
import { useCreateUser, useUpdateUser, useUser } from "../use-users";
import { useRoles } from "@/roles/roles-page/use-roles";
import { getTitle } from "@/lib/card-utils";
import { getSubmitLabel } from "@/lib/form-utils";
import { roleOptions } from "@/lib/options-utils";

import { Card } from "@/components/Card/Card";
import { TextField } from "@/components/HookForm/fields/TextField";
import { MultiSelectField } from "@/components/HookForm/fields/MultiSelectField";

const defaultValues: UserFormData = {
  email: "",
  registration: "",
  name: "",
  roles: []
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

  const title = getTitle("Usuário", isEditMode, false);
  const submitType = isEditMode ? "edit" : "insert";
  const submitLabel = getSubmitLabel(isPending, submitType);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    mode: "onChange",
    defaultValues
  });

  const availableRoleOptions = useMemo(() => {
    if (dynamicRoles && dynamicRoles.length > 0) {
      return dynamicRoles.map((r) => ({
        value: r.name,
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
      const userRoles =
        user.roles && user.roles.length > 0
          ? user.roles
          : user.role
          ? [user.role]
          : [];

      form.reset({
        email: user.email,
        registration: user.registration,
        name: user.name,
        roles: userRoles,
      });
    }
  }, [isEditMode, user, form]);

  const onSubmit = (data: UserFormData) => {
    const payload = {
      ...data,
      role: data.roles[0], // retrocompatibilidade
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

  const isSubmitDisabled = isPending || isLoadingUser || !form.formState.isValid;

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

        <MultiSelectField
          name="roles"
          label="Funções no Sistema"
          placeholder="Selecione uma ou mais funções"
          options={availableRoleOptions}
        />
      </Card>
    </FormProvider>
  );
}
