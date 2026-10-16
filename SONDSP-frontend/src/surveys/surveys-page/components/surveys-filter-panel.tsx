import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useUserSchoolOptions } from "@/schools/schools-page/use-schools";
import { getSubmitLabel } from "@/lib/form-utils";
import { surveySchema, type SurveyFormData, type SurveyFormInput } from "../survey-schema";

import { Card } from "@/components/Card/Card";
import { SelectField } from "@/components/HookForm/fields/SelectField";
import { ComboboxField } from "@/components/HookForm/fields/ComboBoxField";

interface SurveyFilterPanelProps {
  onSearch: (data: SurveyFormData) => void;
  onClear: () => void;
  isSearching: boolean;
}

const defaultValues: SurveyFormInput = {
  schoolId: 0,
  schoolClassId: 0
};

export function SurveysFilterPanel({ 
  onSearch, 
  onClear, 
  isSearching 
}: SurveyFilterPanelProps) {
  const submitLabel = getSubmitLabel(isSearching, 'filter');

  const form = useForm<SurveyFormInput, unknown, SurveyFormData>({
    resolver: zodResolver(surveySchema),
    mode: "onChange",
    defaultValues
  });

  const schoolId = useWatch({ control: form.control, name: "schoolId" });
  const { schoolOptions, classOptions, isLoading: isLoadingSchools } = useUserSchoolOptions(Number(schoolId));

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