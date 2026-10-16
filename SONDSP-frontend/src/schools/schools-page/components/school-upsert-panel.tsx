import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { schoolSchema, type SchoolFormData } from '../school.schema';
import { useCreateSchool, useSchool, useUpdateSchool } from '../use-schools';
import { getTitle } from '@/lib/card-utils';
import { getSubmitLabel } from '@/lib/form-utils';

import { Card } from "@/components/Card/Card";
import { TextField } from '@/components/HookForm/fields/TextField';

const defaultValues: SchoolFormData = {
  name: "",
  codigoInep: "",
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

  const title = getTitle("Escola", isEditMode, false);
  const submitType = isEditMode ? "edit" : "insert";
  const submitLabel = getSubmitLabel(isPending, submitType);

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
        codigoInep: school.codigoInep ?? "",
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

  const isSubmitDisabled = isPending || isLoadingSchool || !form.formState.isValid;
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
        <TextField name="codigoInep" label="Código INEP" placeholder="Código INEP" onlyNumbers maxLength={8} />
        <TextField name="name" label="Nome" placeholder="Nome da escola" />
      </Card>
    </FormProvider>
  );
}
