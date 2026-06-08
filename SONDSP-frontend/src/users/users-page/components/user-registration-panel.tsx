import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";

import { type UsersFormData, usersSchema } from "../users-schema";
import { useCreateUser } from "../use-users";

import { TextField } from "@/components/HookForm/fields/TextField";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/HookForm/fields/SelectField";

export function UserRegistrationPanel() {
  const { mutate, isPending } = useCreateUser();

  const form = useForm<UsersFormData>({
    resolver: zodResolver(usersSchema),
    defaultValues: {
      email: "",
      registration: "",
      name: "",
      role: "",
      permissions: []
    }
  });

  const roleOptions = [
    { value: "Administrador", label: "Administrador" },
    { value: "Administrador Escolar", label: "Administrador Escolar" },
    { value: "Coordenador", label: "Coordenador" },
    { value: "Professor", label: "Professor" },
  ];

  const permissionsOptions = [
    { value: "Todas", label: "Todas"}
  ];
  // nao vai ser um select

  const onSubmit = (data: UsersFormData) => {
    mutate(data);
  }

  // TODO: Adicionar limpar campos no modo de edição
  return (
    <Card className="border-0 bg-[#efefef] px-5 py-5 shadow-sm">
      <div className="space-y-5">
        <h2 className="text-sm font-semibold text-slate-950">
          Cadastro de Usuário
        </h2>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            <TextField
              name="email"
              label="E-mail Institucional"
            />

            <TextField
              name="registration"
              label="Registro Funcional (RF)"
            />

            <TextField
              name="name"
              label="Nome"
            />

            <SelectField
              name="role"
              label="Função"
              options={roleOptions}
            />

            <SelectField
              name="permissions"
              label="Permissões"
              options={permissionsOptions}
            />

            <div className="flex items-end justify-end">
              <Button
                type="submit"
                className="h-10 rounded-full px-6 shadow-sm"
                size="lg"
                disabled={isPending}
              >
                <Check className="size-4" />
                {isPending ? 'Cadastrando...' : 'Cadastrar'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </Card>
  );
}