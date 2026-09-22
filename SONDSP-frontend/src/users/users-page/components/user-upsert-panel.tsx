import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { type UserFormData, userSchema } from "../user-schema";
import { useCreateUser, useUpdateUser, useUser } from "../use-users";
import { getTitle } from "@/lib/card-utils";
import { getSubmitLabel } from "@/lib/form-utils";
import { permissionsOptions, roleOptions } from "@/lib/options-utils";

import { Card } from "@/components/Card/Card";
import { TextField } from "@/components/HookForm/fields/TextField";
import { SelectField } from "@/components/HookForm/fields/SelectField";
import { MultiSelectField } from "@/components/HookForm/fields/MultiSelectField";

const defaultValues: UserFormData = {
  email: "",
  registration: "",
  name: "",
  role: "",
  permissions: []
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
        role: user.role,
        permissions: user.permissions ?? [],
      });
    }
  }, [isEditMode, user, form]);

  const onSubmit = (data: UserFormData) => {
    if (isEditMode && userIdToEdit) {
      updateUser(
        { id: userIdToEdit, data },
        {
          onSuccess: () => {
            form.reset(defaultValues);
            onCancelEdit();
          },
        }
      );
      return;
    }

    createUser(data, {
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
        collapsible
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

        <SelectField
          name="role"
          label="Função"
          placeholder="Selecione a função"
          options={roleOptions}
        />

        <MultiSelectField
          name="permissions"
          label="Permissões"
          placeholder="Selecione as permissões"
          options={permissionsOptions}
        />
      </Card>
    </FormProvider>
  );
}