import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { getSubmitLabel } from "@/lib/form-utils";
import { surveySchema, type SurveyFormData, type SurveyFormInput } from "../survey-schema";

import { Card } from "@/components/Card/Card";
import { ComboboxField } from "@/components/HookForm/fields/ComboBoxField";
import { useUserClassOptions } from "@/classes/use-classes";

interface SurveyFilterPanelProps {
  initialValues?: SurveyFormData | null;
  onSearch: (data: SurveyFormData) => void;
  onClear: () => void;
  isSearching: boolean;
}

const defaultValues: SurveyFormInput = {
  schoolClassId: 0
};

export function SurveysFilterPanel({ 
  initialValues,
  onSearch, 
  onClear, 
  isSearching 
}: SurveyFilterPanelProps) {
  const [initialFormValues] = useState(() =>
    initialValues ? { ...defaultValues, ...initialValues } : undefined
  );

  const submitLabel = getSubmitLabel(isSearching, 'filter');

  const form = useForm<SurveyFormInput, unknown, SurveyFormData>({
    resolver: zodResolver(surveySchema),
    mode: "onChange",
    defaultValues,
    values: initialFormValues,
    resetOptions: { keepDefaultValues: true }
  });

  const { classOptions } = useUserClassOptions(); 

  const onSubmit = (data: SurveyFormData) => onSearch(data);

  const handleReset = () => {
    form.reset(defaultValues);
    onClear();
  }

  const isSubmitDisabled = !form.formState.isValid || isSearching;
  return (
    <FormProvider {...form}>
      <Card 
        title="Sondagens"
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