import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { getSubmitLabel } from "@/lib/form-utils";
import { studentFilterSchema, type StudentFilterFormData, type StudentFilterFormInput } from "../student-filter.schema";

import { Card } from "@/components/Card/Card";
import { ComboboxField } from "@/components/HookForm/fields/ComboBoxField";
import { useUserClassOptions } from "@/classes/use-classes";

interface StudentsFilterPanelProps {
  initialValues?: StudentFilterFormData | null;
  onSearch: (data: StudentFilterFormData) => void;
  onClear: () => void;
  isSearching: boolean;
}

const defaultValues: StudentFilterFormInput = {
  schoolClassId: 0
};

export function StudentsFilterPanel({
  initialValues,
  onSearch, 
  onClear, 
  isSearching 
}: StudentsFilterPanelProps) {
  const [initialFormValues] = useState(() =>
    initialValues ? { ...defaultValues, ...initialValues } : undefined
  );
  const submitLabel = getSubmitLabel(isSearching, 'filter');

  const form = useForm<StudentFilterFormInput, unknown, StudentFilterFormData>({
    resolver: zodResolver(studentFilterSchema),
    mode: "onChange",
    defaultValues,
    values: initialFormValues,
    resetOptions: { keepDefaultValues: true }
  });

  const { classOptions } = useUserClassOptions();

  const onSubmit = (data: StudentFilterFormData) => onSearch(data);

  const handleReset = () => {
    form.reset(defaultValues);
    onClear();
  }

  const isSubmitDisabled = !form.formState.isValid || isSearching;
  return (
    <FormProvider {...form}>
      <Card 
        title="Alunos"
        submitLabel={submitLabel}
        isSubmitDisabled={isSubmitDisabled}
        isFilter
        onSubmit={form.handleSubmit(onSubmit)}
        onReset={handleReset}
        collapsible
      >

        <ComboboxField
          name="schoolClassId"
          label="Turma"
          placeholder="Selecione a turma"
          options={classOptions}
          emptyMessage="Nenhuma turma encontrada."
        />
      </Card>
    </FormProvider>
  );
}