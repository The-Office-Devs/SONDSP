import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuthStore } from "@/auth/auth.store";
import { useUser } from "@/users/users-page/use-users";
import { surveySchema, type SurveyFormData, type SurveyFormInput } from "../survey-schema";

import { Card } from "@/components/Card/Card";
import { SelectField } from "@/components/HookForm/fields/SelectField";
import { ComboboxField } from "@/components/HookForm/fields/ComboBoxField";
import { getSubmitLabel } from "@/lib/form-utils";

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
  const userId = useAuthStore((state) => state.user)?.id;
  const { data: userData } = useUser(userId!);
  const schools = userData?.schools ?? [];

  const submitLabel = getSubmitLabel(isSearching, 'filter');

  const form = useForm<SurveyFormInput, unknown, SurveyFormData>({
    resolver: zodResolver(surveySchema),
    mode: "onChange",
    defaultValues
  });

  const schoolId = useWatch({ control: form.control, name: "schoolId" });

  const onSubmit = (data: SurveyFormData) => onSearch(data);

  const handleReset = () => {
    form.reset(defaultValues);
    onClear();
  }

  const schoolOptions = schools.map((school) => ({
    value: String(school.id),
    label: school.name
  }));

  const classOptions =
  schools
    .find((school) => school.id === Number(schoolId))
    ?.schoolClass
    .filter((schoolClass) => schoolClass.status)
    .map((schoolClass) => ({
      value: String(schoolClass.id),
      label: `${schoolClass.name} - ${schoolClass.schoolYear}`
    })) ?? [];

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
          placeholder="Selecione a escola"
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