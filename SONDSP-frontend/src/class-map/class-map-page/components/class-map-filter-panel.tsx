import { useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { getSubmitLabel } from "@/lib/form-utils";
import { bimesterOptions, subjectOptions } from "@/lib/options-utils";
import { useStrandOptions } from "@/strands/use-strands";
import { 
  classMapSchema, 
  type ClassMapAppliedFilters, 
  type ClassMapFormData, 
  type ClassMapFormInput 
} from "../class-map.schema";

import { Card } from "@/components/Card/Card";
import { SelectField } from "@/components/HookForm/fields/SelectField";
import { ComboboxField } from "@/components/HookForm/fields/ComboBoxField";
import { useUserClassOptions } from "@/classes/use-classes";

interface ClassMapFilterPanelProps {
  initialValues?: ClassMapAppliedFilters | null;
  onSearch: (data: ClassMapAppliedFilters) => void;
  onClear: () => void;
  isSearching: boolean;
};

const defaultValues: ClassMapFormInput = {
  schoolClassId: 0,
  subjectId: 0,
  strandId: 0,
  period: ""
};

export function ClassMapFilterPanel({
  initialValues,
  onSearch,
  onClear,
  isSearching
}: Readonly<ClassMapFilterPanelProps>) {
  const [initialFormValues] = useState(() =>
    initialValues ? { ...defaultValues, ...initialValues } : undefined
  );
  const submitLabel = getSubmitLabel(isSearching, 'filter');

  const form = useForm<ClassMapFormInput, unknown, ClassMapFormData>({
    resolver: zodResolver(classMapSchema),
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

  const onSubmit = (data: ClassMapFormData) => {
    const strandName = strandOptions.find(
      (opt) => opt.value === String(data.strandId)
    )?.label;
    onSearch({ ...data, strandName });
  };

  const handleReset = () => {
    form.reset(defaultValues);
    onClear();
  };

  const isSubmitDisabled = !form.formState.isValid || isSearching;
  return (
    <FormProvider {...form}>
      <Card 
        title="Mapa de Classe"
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

        <SelectField
          name="period"
          label="Bimestre"
          placeholder="Selecione o bimestre"
          options={bimesterOptions}
          clearable
        />
      </Card>
    </FormProvider>
  );
}