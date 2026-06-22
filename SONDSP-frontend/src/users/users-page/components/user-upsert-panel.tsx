import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "lucide-react";

import { type UserFormData, userSchema } from "../user-schema";
import { useCreateUser, useUpdateUser, useUser } from "../use-users";
import { getSubmitLabel } from "@/lib/form-utils";

import { Card } from "@/components/ui/card";
import { TextField } from "@/components/HookForm/fields/TextField";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/HookForm/fields/SelectField";
import { MultiSelectField } from "@/components/HookForm/fields/MultiSelectField";

const roleOptions = [
  { value: "Administrador", label: "Administrador" },
  { value: "Administrador da Escola", label: "Administrador Escolar" },
  { value: "Coordenador", label: "Coordenador" },
  { value: "Professor", label: "Professor" },
  { value: "POA", label: "Professor Orientador de Área" }
];

const permissionsOptions = [
  { value: "CREATE_USER", label: "Criar usuário" },
  { value: "UPDATE_USER", label: "Editar usuário" },
  { value: "DELETE_USER", label: "Excluir usuário" }
];

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
  const submitLabel = getSubmitLabel(isPending, isEditMode);

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

  return (
    <Card className="border-0 bg-[#efefef] px-5 py-5 shadow-sm">
      <div className="space-y-5">
        <h2 className="text-lg font-semibold text-slate-950">
          {isEditMode ? "Edição de Usuário" : "Cadastro de Usuário"}
        </h2>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            <TextField
              name="email"
              label="E-mail Institucional"
              placeholder="nome@sme.prefeitura.gov.br"
            />

            <TextField
              name="registration"
              label="Registro Funcional (RF)"
              onlyNumbers
            />

            <TextField
              name="name"
              label="Nome"
              placeholder="Nome do usuário"
            />

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

            <div className="flex gap-2 items-end justify-end">
              {isEditMode && (
                <Button
                  type="button"
                  variant="outline"
                  isRounded={true}
                  onClick={handleCancelEdit}
                >
                  <X className="size-4" />
                  Cancelar
                </Button>
              )}

              <Button
                type="submit"
                isRounded={true}
                disabled={isPending || isLoadingUser || !form.formState.isValid}
              >
                <Check className="size-4" />
                {submitLabel}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </Card>
  );
}