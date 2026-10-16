import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { 
  type ClassFilterFormData, 
  type ClassFilterFormInput, 
  classFilterSchema 
} from "../class-filter.schema";
import { gradeLevelOptionsWithAll, shiftOptionsWithAll } from "@/lib/options-utils";
import { getSubmitLabel } from "@/lib/form-utils";

import { Card } from "@/components/Card/Card";
import { SelectField } from "@/components/HookForm/fields/SelectField";
import { useUserSchoolOptions } from "@/schools/schools-page/use-schools";

interface ClassesFilterPanelProps {
  onSearch: (data: ClassFilterFormData) => void;
  onClear: () => void;
  isSearching: boolean;
}

const defaultValues: ClassFilterFormInput = {
  schoolId: 0,
  shift: "",
  gradeLevel: "",
  schoolYear: ""
};

export function ClassesFilterPanel({
  onSearch,
  onClear,
  isSearching
}: Readonly<ClassesFilterPanelProps>) {
  const { schoolOptions, schoolYearOptions, isLoading: isLoadingSchools } = useUserSchoolOptions();

  const submitLabel = getSubmitLabel(isSearching, 'filter');
  
  const form = useForm<ClassFilterFormInput, unknown, ClassFilterFormData>({
    resolver: zodResolver(classFilterSchema),
    mode: "onChange",
    defaultValues
  });

  const onSubmit = (data: ClassFilterFormData) => onSearch(data);

  const handleReset = () => {
    form.reset(defaultValues);
    onClear();
  };

  const isSubmitDisabled = !form.formState.isValid || isSearching;
  return (
    <FormProvider {...form}>
      <Card
        title="Turmas"
        submitLabel={submitLabel}
        isSubmitDisabled={isSubmitDisabled}
        isFilter
        onSubmit={form.handleSubmit(onSubmit)}
        onReset={handleReset}
      >
        <SelectField
          name="schoolId"
          label="Escola"
          placeholder={isLoadingSchools ? "Carregando escolas..." : "Selecione a escola"}
          options={schoolOptions}
        />

        <SelectField
          name="shift"
          label="Turno"
          placeholder="Selecione o turno"
          options={shiftOptionsWithAll}
        />

        <SelectField
          name="gradeLevel"
          label="Ano Escolar"
          placeholder="Selecione o ano escolar"
          options={gradeLevelOptionsWithAll}
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