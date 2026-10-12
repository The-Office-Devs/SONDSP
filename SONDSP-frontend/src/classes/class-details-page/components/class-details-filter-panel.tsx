import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { getSubmitLabel } from "@/lib/form-utils";
import { bimesterOptions, subjectOptions } from "@/lib/options-utils";
import { useStrandOptions } from "@/strands/strands-page/use-strands";
import { 
  type ClassDetailsFormData, 
  type ClassDetailsFormInput, 
  classDetailsSchema } 
from "../class-details.schema";

import { Card } from "@/components/Card/Card";
import { SelectField } from "@/components/HookForm/fields/SelectField";

interface ClassDetailsFilterPanelProps {
  onSearch: (data: ClassDetailsFormData) => void;
  onClear: () => void;
  isSearching: boolean;
  schoolClassName: string;
};

const defaultValues: ClassDetailsFormInput = {
  subjectId: 0,
  strandId: 0,
  bimester: ""
};

export function ClassDetailsFilterPanel({
  onSearch,
  onClear,
  isSearching,
  schoolClassName
}: Readonly<ClassDetailsFilterPanelProps>) {
  const title = schoolClassName?.trim()
    ? schoolClassName
    : "Turma";
  const submitLabel = getSubmitLabel(isSearching, 'filter');

  const form = useForm<ClassDetailsFormInput, unknown, ClassDetailsFormData>({
    resolver: zodResolver(classDetailsSchema),
    mode: "onChange",
    defaultValues
  });

  const subject = useWatch({ control: form.control, name: "subjectId" });
  
  const subjectLabel = subjectOptions.find(
    (opt) => opt.value === String(subject)
  )?.label;
  const { options: strandOptions, isLoading: isLoadingStrands } = useStrandOptions(subjectLabel);

  const onSubmit = (data: ClassDetailsFormData) => onSearch(data);

  const handleReset = () => {
    form.reset(defaultValues);
    onClear();
  };

  const isSubmitDisabled = !form.formState.isValid || isSearching;
  return (
    <FormProvider {...form}>
      <Card 
        title={title}
        submitLabel={submitLabel}
        isSubmitDisabled={isSubmitDisabled}
        isFilter
        onSubmit={form.handleSubmit(onSubmit)}
        onReset={handleReset}
      >
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
          name="bimester"
          label="Bimestre"
          placeholder="Selecione o bimestre"
          options={bimesterOptions}
        />
      </Card>
    </FormProvider>
  );
}