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
  const title = getTitle("Escola", isEditMode, false);
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

  const isSubmitDisabled = isPending || isLoadingSchool || !form.formState.isValid;
  return (
    <FormProvider {...form}>
      <Card
        title={title} 
        submitLabel={submitLabel}
        isEditMode={isEditMode} 
        isSubmitDisabled={isSubmitDisabled}
        onSubmit={form.handleSubmit(onSubmit)}
        onCancelEdit={handleCancelEdit}
      >
        <TextField name="name" label="Nome" placeholder="Nome da escola" />
        <TextField name="principalName" label="Diretor" placeholder="Nome do diretor" />
      </Card>
    </FormProvider>
  );
}
