import { useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Play } from "lucide-react";

import { getSubmitLabel } from "@/lib/form-utils";
import { bimesterOptions, statusOptions, subjectOptions } from "@/lib/options-utils";
import { useStrandOptions } from "@/strands/strands-page/use-strands";
import { 
    type SurveyHistoryFormInput, 
    type SurveyHistoryFormData,
    surveyHistorySchema
} from "../survey-history-schema";

import { Card } from "@/components/Card/Card";
import { SelectField } from "@/components/HookForm/fields/SelectField";
import { Button } from "@/components/ui/button";
import { StartSurveyDialog } from "@/components/Dialog/StartSurveyDialog";
import { useStudent } from "@/students/students-page/use-students";

interface SurveyHistoryFilterPanelProps {
  onSearch: (data: SurveyHistoryFormData) => void;
  onClear: () => void;
  isSearching: boolean;
  studentId: number;
}

const defaultValues: SurveyHistoryFormInput = {
  status: "all",
  bimester: "",
  subjectId: 0,
  strandId: 0
};

export function SurveysHistoryFilterPanel({
  onSearch,
  onClear,
  isSearching,
  studentId
}: Readonly<SurveyHistoryFilterPanelProps>) {
  const { data: student } = useStudent(studentId);

  const studentName = student?.name;
  const title = studentName?.trim()
    ? `Histórico de Sondagens de ${studentName}`
    : "Histórico de Sondagens";

  const submitLabel = getSubmitLabel(isSearching, 'filter');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<SurveyHistoryFormInput, unknown, SurveyHistoryFormData>({
    resolver: zodResolver(surveyHistorySchema),
    mode: "onChange",
    defaultValues
  });

  const subject = useWatch({ control: form.control, name: "subjectId" });

  const subjectLabel = subjectOptions.find(
    (opt) => opt.value === String(subject)
  )?.label;
  const { options: strandOptions, isLoading: isLoadingStrands } = useStrandOptions(subjectLabel);

  const onSubmit = (data: SurveyHistoryFormData) => onSearch(data);

  const handleReset = () => {
    form.reset(defaultValues);
    onClear();
  };

  const isSubmitDisabled = !form.formState.isValid || isSearching;
  return (
    <>
      <FormProvider {...form}>
        <Card 
          title={title}
          submitLabel={submitLabel}
          isSubmitDisabled={isSubmitDisabled}
          isFilter
          onSubmit={form.handleSubmit(onSubmit)}
          onReset={handleReset}
          collapsible
        >
          <SelectField
            name="status"
            label="Status"
            placeholder="Selecione o status"
            options={statusOptions}
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
            name="bimester"
            label="Bimestre"
            placeholder="Selecione o bimestre"
            options={bimesterOptions}
          />

          <Button type="button" onClick={() => setIsDialogOpen(true)} className="self-end">
            <Play className="size-4" />
            Iniciar Sondagem
          </Button>
        </Card>
      </FormProvider>

      <StartSurveyDialog
        studentId={studentId}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}