import { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"; // Ajustado para z normal (conforme o padrão da lib)
import { Download } from "lucide-react";

import { useActivities, useActivityImage } from "@/activities/activities-page/use-activities";
import { useCreateSurvey } from "@/surveys/use-surveys";
import { downloadUrl } from "@/lib/file-utils";
import { bimesterOptions, subjectOptions } from "@/lib/options-utils";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { ComboboxField } from "../HookForm/fields/ComboBoxField";
import { ReadOnlyField } from "../ReadOnlyFields/ReadOnlyField";
import { Button } from "../ui/button";
import { SelectField } from "../HookForm/fields/SelectField";

const createSurveySchema = z.object({
  subjectId: z.string().optional(),
  applicationPeriod: z
    .string()
    .min(1, "Selecione um bimestre"),
  activityModelId: z.coerce
    .number()
    .int()
    .positive("Selecione um modelo de atividade"),
});

type CreateSurveyFormInput = z.input<typeof createSurveySchema>;
type CreateSurveyFormData = z.output<typeof createSurveySchema>;

const defaultValues: CreateSurveyFormInput = {
  subjectId: "",
  applicationPeriod: "",
  activityModelId: 0
};

interface ModelFilters {
  subjectLabel?: string;
  bimester?: string;
}

function getSubjectLabel(subjectId?: string) {
  return subjectOptions.find((opt) => opt.value === subjectId)?.label;
}

interface CreateSurveyDialogProps {
  studentId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateSurveyDialog({
  studentId,
  open,
  onOpenChange
}: Readonly<CreateSurveyDialogProps>) {
  const { mutate: createSurvey, isPending } = useCreateSurvey();
  const { data: activityModelsPage } = useActivities(
    { size: 100, status: true }, 
    { enabled: open }
  );

  const form = useForm<CreateSurveyFormInput, unknown, CreateSurveyFormData>({
    resolver: zodResolver(createSurveySchema),
    mode: "onChange",
    defaultValues
  });

  const activityModels = activityModelsPage?.content ?? [];
  type ActivityModel = (typeof activityModels)[number];

  const subjectId = useWatch({ control: form.control, name: "subjectId" });
  const applicationPeriod = useWatch({ control: form.control, name: "applicationPeriod" });
  const activityModelId = useWatch({ control: form.control, name: "activityModelId" });

  const subjectLabel = getSubjectLabel(subjectId);

  const matchesFilters = (model: ActivityModel, filters: ModelFilters) => {
    const matchesSubject = !filters.subjectLabel || model.strand?.subject === filters.subjectLabel;
    const matchesBimester = !filters.bimester || model.bimester === filters.bimester;
    return matchesSubject && matchesBimester;
  };

  const filteredModels = activityModels.filter((model) =>
    matchesFilters(model, { subjectLabel, bimester: applicationPeriod })
  );
  const selectedModel = activityModels.find((model) => String(model.id) === String(activityModelId));

  // Agora recebemos a Signed URL (string) em vez de um Blob
  const { data: imageUrl, isFetching: isFetchingImage } = useActivityImage(selectedModel?.id);

  useEffect(() => {
    if (!open) form.reset(defaultValues);
  }, [open, form]);

  const handleFilterChange = (next: ModelFilters) => {
    if (!selectedModel) return;

    const filters = { subjectLabel, bimester: applicationPeriod, ...next };
    if (!matchesFilters(selectedModel, filters)) {
      form.setValue("activityModelId", 0, { shouldValidate: true });
    }
  };

  const handleDownload = () => {
    if (!selectedModel || !imageUrl) return;

    // Chama a função de download passando a Signed URL e o nome do modelo
    downloadUrl(imageUrl, selectedModel.name);
  };

  const onSubmit = (data: CreateSurveyFormData) => {
    createSurvey(
      { 
        studentId: studentId!, 
        activityModelId: data.activityModelId,
        applicationPeriod: data.applicationPeriod
      },
      { onSuccess: () => onOpenChange(false) }
    )
  };

  const activityOptions = filteredModels.map((model) => ({
    value: String(model.id),
    label: model.name
  }));
  
  const hasActiveFilter = !!subjectLabel || !!applicationPeriod;
  const hasSelectedActivity = form.formState.isValid;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-h-[90dvh] w-full max-w-[calc(100%-2rem)] overflow-y-auto sm:max-w-md"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <DialogHeader className="border-b border-neutral-100 pb-3">
          <DialogTitle className="text-base font-bold text-slate-900"> Nova Sondagem </DialogTitle>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                name="subjectId"
                label="Matéria"
                placeholder="Todas"
                options={subjectOptions}
                clearable
                onValueChange={(value) => handleFilterChange({ subjectLabel: getSubjectLabel(value) })}
              />

              <SelectField
                name="applicationPeriod"
                label="Bimestre"
                placeholder="Selecione"
                options={bimesterOptions}
                onValueChange={(value) => handleFilterChange({ bimester: value })}
              />
            </div>
            
            <div>
              <ComboboxField
                name="activityModelId"
                label="Modelo de Atividade"
                placeholder="Selecione o modelo de atividade"
                options={activityOptions}
                emptyMessage={
                  hasActiveFilter
                    ? "Nenhum modelo para essa matéria e bimestre"
                    : "Nenhum modelo de atividade encontrado"
                }
                listClassName="max-h-56 overflow-y-auto"
              />
              {hasActiveFilter && activityModels.length > 0 && (
                <p className="mt-1 px-1 text-xs text-slate-500">
                  {filteredModels.length} de {activityModels.length} modelos
                </p>
              )}
            </div>

            <ReadOnlyField label="Ano Escolar" value={selectedModel?.gradeLevel} />
            <ReadOnlyField label="Eixo" value={selectedModel?.strand.name} />

            <Button 
              type="button"
              variant="ghost" 
              className="text-slate-600 hover:text-slate-900" 
              disabled={!hasSelectedActivity || !imageUrl || isFetchingImage}
              onClick={handleDownload}
            >
              <Download className="size-4" />
              Baixar Modelo de Atividade
            </Button>

            <DialogFooter>
              <Button
                type="submit"
                disabled={!hasSelectedActivity || isPending}
              >
                {isPending ? "Criando..." : "Criar Sondagem"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}