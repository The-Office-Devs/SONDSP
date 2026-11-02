import { useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { getSubmitLabel } from "@/lib/form-utils";
import { subjectOptions } from "@/lib/options-utils";
import { useStrandOptions } from "@/strands/use-strands";
import { 
    learningTrajectoriesSchema,
  type LearningTrajectoriesFormData, 
  type LearningTrajectoriesFormInput 
} from "../learning-trajectories.schema";

import { Card } from "@/components/Card/Card";
import { SelectField } from "@/components/HookForm/fields/SelectField";
import { ComboboxField } from "@/components/HookForm/fields/ComboBoxField";
import { useUserClassOptions } from "@/classes/use-classes";

interface LearningTractoriesFilterPanelProps {
  initialValues?: LearningTrajectoriesFormData | null;
  onSearch: (data: LearningTrajectoriesFormData) => void;
  onClear: () => void;
  isSearching: boolean;
}

const defaultValues: LearningTrajectoriesFormInput = {
  schoolClassId: 0,
  subjectId: 0,
  strandId: 0
};

export function LearningTractoriesFilterPanel({
  initialValues,
  onSearch,
  onClear,
  isSearching
}: Readonly<LearningTractoriesFilterPanelProps>) {
  const [initialFormValues] = useState(() =>
    initialValues ? { ...defaultValues, ...initialValues } : undefined
  );

  const submitLabel = getSubmitLabel(isSearching, 'filter');

  const form = useForm<LearningTrajectoriesFormInput, unknown, LearningTrajectoriesFormData>({
    resolver: zodResolver(learningTrajectoriesSchema),
    mode: "onChange",
    defaultValues,
    values: initialFormValues,
    resetOptions: { keepDefaultValues: true }
  });

  const subject = useWatch({ control: form.control, name: "subjectId" });

  const { classOptions } = useUserClassOptions();

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
        <ComboboxField
          name="schoolClassId"
          label="Turma"
          placeholder="Selecione a turma"
          options={classOptions}
          emptyMessage="Nenhuma turma encontrada."
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
      </Card>
    </FormProvider>
  );
}