import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { getSubmitLabel } from "@/lib/form-utils";
import { useUserSchoolOptions } from "@/schools/schools-page/use-schools";
import { subjectOptions } from "@/lib/options-utils";
import { useStrandOptions } from "@/strands/strands-page/use-strands";
import { 
    learningTrajectoriesSchema,
  type LearningTrajectoriesFormData, 
  type LearningTrajectoriesFormInput 
} from "../learning-trajectories.schema";

import { Card } from "@/components/Card/Card";
import { SelectField } from "@/components/HookForm/fields/SelectField";
import { ComboboxField } from "@/components/HookForm/fields/ComboBoxField";

interface LearningTractoriesFilterPanelProps {
  onSearch: (data: LearningTrajectoriesFormData) => void;
  onClear: () => void;
  isSearching: boolean;
}

const defaultValues: LearningTrajectoriesFormInput = {
  schoolId: 0,
  schoolClassId: 0,
  subjectId: 0,
  strandId: 0,
  schoolYear: ""
};

export function LearningTractoriesFilterPanel({
  onSearch,
  onClear,
  isSearching
}: Readonly<LearningTractoriesFilterPanelProps>) {
  const submitLabel = getSubmitLabel(isSearching, 'filter');

  const form = useForm<LearningTrajectoriesFormInput, unknown, LearningTrajectoriesFormData>({
    resolver: zodResolver(learningTrajectoriesSchema),
    mode: "onChange",
    defaultValues
  });

  const schoolId = useWatch({ control: form.control, name: "schoolId" });
  const subject = useWatch({ control: form.control, name: "subjectId" });

  const { 
    schoolOptions, 
    classOptions, 
    schoolYearOptions,
    isLoading: isLoadingSchools 
  } = useUserSchoolOptions(Number(schoolId));

  const subjectLabel = subjectOptions.find(
    (opt) => opt.value === String(subject)
  )?.label;
  const { options: strandOptions, isLoading: isLoadingStrands } = useStrandOptions(subjectLabel);
  
  const onSubmit = (data: LearningTrajectoriesFormData) => onSearch(data);

  const handleReset = () => {
    form.reset(defaultValues);
    onClear();
  };

  const isSubmitDisabled = !form.formState.isValid || isSearching;
  return (
    <FormProvider {...form}>
      <Card 
        title="Trajetórias de Aprendizagem"
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

        <SelectField
          name="subjectId"
          label="Matéria"
          placeholder="Selecione a matéria"
          options={subjectOptions}
          onValueChange={() => form.setValue("strandId", 0, { shouldValidate: true })}
        />

        <SelectField 
          name="strandId"
          label="Eixo"
          placeholder={isLoadingStrands ? "Carregando eixos..." : "Selecione o eixo"}
          options={strandOptions}
          disabled={!subject || isLoadingStrands}
        />

        <SelectField
          name="schoolYear"
          label="Ano Letivo"
          placeholder="Selecione o ano letivo"
          options={schoolYearOptions}
        />
      </Card>
    </FormProvider>
  );
}