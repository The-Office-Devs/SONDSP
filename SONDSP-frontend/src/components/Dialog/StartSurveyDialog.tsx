import { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Download } from "lucide-react";

import { useActivities, useActivityImage } from "@/activities/activities-page/use-activities";
import { useStartSurvey } from "@/surveys/use-surveys";
import { blobToFile, downloadUrl } from "@/lib/file-utils";

import { Dialog, DialogContent, DialogFooter, DialogTitle } from "../ui/dialog";
import { ComboboxField } from "../HookForm/fields/ComboBoxField";
import { ReadOnlyField } from "../ReadOnlyField/ReadOnlyField";
import { Button } from "../ui/button";

const startSurveySchema = z.object({
  activityModelId: z.coerce
    .number()
    .int()
    .positive("Selecione um modelo de atividade")
});

type StartSurveyFormInput = z.input<typeof startSurveySchema>;
type StartSurveyFormData = z.output<typeof startSurveySchema>;

interface StartSurveyDialogProps {
  studentId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function StartSurveyDialog({
  studentId,
  open,
  onOpenChange
}: Readonly<StartSurveyDialogProps>) {
  const { mutate: startSurvey, isPending } = useStartSurvey();
  const { data: activityModelsPage } = useActivities(
    { size: 100, status: true }, 
    { enabled: open }
  );

  const form = useForm<StartSurveyFormInput, unknown, StartSurveyFormData>({
    resolver: zodResolver(startSurveySchema),
    mode: "onChange",
    defaultValues: { activityModelId: 0 }
  });

  const activityModels = activityModelsPage?.content ?? [];
  const activityModelId = useWatch({ control: form.control, name: "activityModelId" });
  const selectedModel = activityModels.find((model) => String(model.id) === activityModelId);

  const { data: imageBlob, isFetching: isFetchingImage } = useActivityImage(selectedModel?.id);

  useEffect(() => {
    if (!open) form.reset({ activityModelId: 0 });
  }, [open, form]);

  const handleDownload = () => {
    if (!selectedModel || !imageBlob) return;

    const file = blobToFile(imageBlob, selectedModel.name);
    const url = URL.createObjectURL(file);
    downloadUrl(url, file.name);
    URL.revokeObjectURL(url);
  };

  const onSubmit = (data: StartSurveyFormData) => {
    startSurvey(
      { studentId: studentId!, activityModelId: data.activityModelId },
      { onSuccess: () => onOpenChange(false) }
    )
  };

  const activityOptions = activityModels.map((model) => ({
    value: String(model.id),
    label: model.name
  }));
  
  const hasSelectedActivity = form.formState.isValid;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle></DialogTitle>
      <DialogContent className="max-w-md">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ComboboxField
              name="activityModelId"
              label="Modelo de Atividade"
              placeholder="Selecione o modelo de atividade"
              options={activityOptions}
              emptyMessage="Nenhum modelo de atividade encontrado"
            />

            <ReadOnlyField label="Ano Escolar" value={selectedModel?.gradeLevel} />
            <ReadOnlyField label="Bimestre" value={selectedModel?.bimester} />
            <ReadOnlyField label="Eixo" value={selectedModel?.strand.name} />

            <Button 
              type="button"
              variant="ghost" 
              className="text-slate-600 hover:text-slate-900" 
              disabled={!hasSelectedActivity || !imageBlob || isFetchingImage}
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
                {isPending ? "Iniciando..." : "Iniciar Sondagem"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}