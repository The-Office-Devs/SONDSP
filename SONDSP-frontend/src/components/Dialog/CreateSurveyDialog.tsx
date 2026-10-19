import { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"; // Ajustado para z normal (conforme o padrão da lib)
import { Download } from "lucide-react";

import { useActivities, useActivityImage } from "@/activities/activities-page/use-activities";
import { useCreateSurvey } from "@/surveys/use-surveys";
import { downloadUrl } from "@/lib/file-utils";
import { bimesterOptions } from "@/lib/options-utils";

import { Dialog, DialogContent, DialogFooter, DialogTitle } from "../ui/dialog";
import { ComboboxField } from "../HookForm/fields/ComboBoxField";
import { ReadOnlyField } from "../ReadOnlyFields/ReadOnlyField";
import { Button } from "../ui/button";
import { SelectField } from "../HookForm/fields/SelectField";

const createSurveySchema = z.object({
  activityModelId: z.coerce
    .number()
    .int()
    .positive("Selecione um modelo de atividade"),
  applicationPeriod: z
    .string()
    .min(1, "Selecione um bimestre"),
});

type CreateSurveyFormInput = z.input<typeof createSurveySchema>;
type CreateSurveyFormData = z.output<typeof createSurveySchema>;

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
    defaultValues: { activityModelId: 0 }
  });

  const activityModels = activityModelsPage?.content ?? [];
  const activityModelId = useWatch({ control: form.control, name: "activityModelId" });
  const selectedModel = activityModels.find((model) => String(model.id) === activityModelId);

  // Agora recebemos a Signed URL (string) em vez de um Blob
  const { data: imageUrl, isFetching: isFetchingImage } = useActivityImage(selectedModel?.id);

  useEffect(() => {
    if (!open) form.reset({ activityModelId: 0 });
  }, [open, form]);

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
              listClassName="max-h-56 overflow-y-auto"
            />

            <SelectField
              name="applicationPeriod"
              label="Bimestre"
              placeholder="Selecione o bimestre"
              options={bimesterOptions}
            />

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