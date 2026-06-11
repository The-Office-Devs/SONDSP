import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, X } from 'lucide-react';

import { schoolSchema, type SchoolFormData } from '../schools.schema';
import { useCreateSchool, useSchool, useUpdateSchool } from '../use-schools';
import { getSubmitLabel } from '@/lib/form-utils';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TextField } from '@/components/HookForm/fields/TextField';

const defaultValues: SchoolFormData = {
  name: "",
  principalName: "",
  status: true
};

type SchoolUpsertPanelProps = {
  schoolIdToEdit: number | null;
  onCancelEdit: () => void;
};

export function SchoolUpsertPanel({
  schoolIdToEdit,
  onCancelEdit,
}: Readonly<SchoolUpsertPanelProps>) {
  const { mutate: createSchool, isPending: isCreating } = useCreateSchool();
  const { mutate: updateSchool, isPending: isUpdating } = useUpdateSchool();
  const { data: school, isLoading: isLoadingSchool } = useSchool(schoolIdToEdit);

  const isEditMode = schoolIdToEdit !== null;
  const isPending = isCreating || isUpdating;
  const submitLabel = getSubmitLabel(isPending, isEditMode);

  const form = useForm<SchoolFormData>({
    resolver: zodResolver(schoolSchema),
    mode: "onChange",
    defaultValues
  });

  useEffect(() => {
    if (!isEditMode) {
      form.reset(defaultValues);
      return;
    }
  
    if (school) {
      form.reset({ 
        name: school.name,
        principalName: school.principalName,
        status: true
      });
    }
  }, [isEditMode, school, form]);

  const onSubmit = (data: SchoolFormData) => {
    if (isEditMode && schoolIdToEdit) {
      updateSchool(
        { id: schoolIdToEdit, data },
        {
          onSuccess: () => {
            form.reset(defaultValues);
            onCancelEdit();
          },
        }
      );
      return;
    }
  
    createSchool(data, {
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
          {isEditMode ? "Edição de Escola" : "Cadastro de Escola"}
        </h2>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            <TextField name="name" label="Nome" placeholder="Nome da escola" />

            <TextField name="principalName" label="Diretor" placeholder="Nome do diretor" />

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
                disabled={isPending || isLoadingSchool || !form.formState.isValid}
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
