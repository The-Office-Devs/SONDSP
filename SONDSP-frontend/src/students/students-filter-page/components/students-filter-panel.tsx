import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useUserSchoolOptions } from "@/schools/schools-page/use-schools";
import { getSubmitLabel } from "@/lib/form-utils";
import { studentFilterSchema, type StudentFilterFormData, type StudentFilterFormInput } from "../student-filter.schema";

import { Card } from "@/components/Card/Card";
import { SelectField } from "@/components/HookForm/fields/SelectField";
import { ComboboxField } from "@/components/HookForm/fields/ComboBoxField";

interface StudentsFilterPanelProps {
  onSearch: (data: StudentFilterFormData) => void;
  onClear: () => void;
  isSearching: boolean;
}

const defaultValues: StudentFilterFormInput = {
  schoolId: 0,
  schoolClassId: 0
};

export function StudentsFilterPanel({ 
  onSearch, 
  onClear, 
  isSearching 
}: StudentsFilterPanelProps) {
  const submitLabel = getSubmitLabel(isSearching, 'filter');

  const form = useForm<StudentFilterFormInput, unknown, StudentFilterFormData>({
    resolver: zodResolver(studentFilterSchema),
    mode: "onChange",
    defaultValues
  });

  const schoolId = useWatch({ control: form.control, name: "schoolId" });
  const { schoolOptions, classOptions, isLoading: isLoadingSchools } = useUserSchoolOptions(Number(schoolId));

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
        <SelectField
          name="schoolId"
          label="Escola"
          placeholder={isLoadingSchools ? "Carregando escolas..." : "Selecione a escola"}
          options={schoolOptions}
          onValueChange={() => form.setValue("schoolClassId", 0, { shouldValidate: true })}
        />

        <ComboboxField
          name="schoolClassId"
          label="Turma"
          placeholder="Selecione a turma"
          options={classOptions}
          emptyMessage="Nenhuma turma encontrada."
          disabled={!schoolId}
        />
      </Card>
    </FormProvider>
  );
}