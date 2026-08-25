import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuthStore } from "@/auth/auth.store";
import { useUser } from "@/users/users-page/use-users";
import { surveySchema, type SurveyFormData, type SurveyFormInput } from "../survey-schema";

import { Card } from "@/components/Card/Card";
import { SelectField } from "@/components/HookForm/fields/SelectField";
import { ComboboxField } from "@/components/HookForm/fields/ComboBoxField";

interface SurveyFilterPanelProps {
  onSearch: (data: SurveyFormData) => void;
  isSearching: boolean;
}

const defaultValues: SurveyFormInput = {
  schoolId: 0,
  schoolClassId: 0
};

export function SurveysFilterPanel({ onSearch, isSearching }: SurveyFilterPanelProps) {
  const userId = useAuthStore((state) => state.user)?.id;
  const { data: userData } = useUser(userId!);
  const schools = userData?.schools ?? [];

  const form = useForm<SurveyFormInput, unknown, SurveyFormData>({
    resolver: zodResolver(surveySchema),
    mode: "onChange",
    defaultValues
  });

  const schoolId = useWatch({ control: form.control, name: "schoolId" });

  const onSubmit = (data: SurveyFormData) => onSearch(data);

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

  // Ver o limpar filtros + Colocar submitLabel para buscar e buscando
  // ajustar responsividade quando clico em buscar e da erro  (ver se na outra branch isso ja esta pronto) +
  // ver melhor todas as props do card (na outra branch)
    // onValueChange={() => form.setValue("schoolClassId", 0, { shouldValidate: true })} --> ver se isso eh realmente necessario

  const isSubmitDisabled = !form.formState.isValid || isSearching;
  return (
    <FormProvider {...form}>
      <Card 
        title="Sondagens"
        submitLabel="Buscar"
        isSubmitDisabled={isSubmitDisabled}
        onSubmit={form.handleSubmit(onSubmit)}
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