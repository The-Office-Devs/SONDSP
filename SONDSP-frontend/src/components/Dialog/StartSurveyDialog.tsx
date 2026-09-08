import { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Download } from "lucide-react";

import { Dialog, DialogContent, DialogFooter } from "../ui/dialog";
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

// DADOS MOCKADOS
const activityModels = [
  { id: 1, name: "Sondagem Teste1 (Atualizado)", schoolYear: "2026", bimester: "1 bimestre", strand: "Geometria", imageUrl: "/teste.png" },
  { id: 3, name: "Sondagem Teste2", schoolYear: "2026", bimester: "2 bimestre", strand: "Álgebra", imageUrl: "/teste.png" }
];

export function StartSurveyDialog({
  studentId,
  open,
  onOpenChange
}: Readonly<StartSurveyDialogProps>) {
  // const { mutate: startSurvey, isPending } = useStartSurvey();
  // Criar essa chamada na pasta de survey
  // VER SE ISSO JA EXISTE E CASO JA EXISTA USAR
  const isPending = false;

  const form = useForm<StartSurveyFormInput, unknown, StartSurveyFormData>({
    resolver: zodResolver(startSurveySchema),
    mode: "onChange",
    defaultValues: { activityModelId: 0 }
  });

  const activityModelId = useWatch({ control: form.control, name: "activityModelId" });
  const selectedModel = activityModels.find((model) => String(model.id) === activityModelId);

  useEffect(() => {
    if (!open) form.reset({ activityModelId: 0 });
  }, [open, form]);

  const handleDownload = () => {
    if (!selectedModel) return;

    const link = document.createElement("a");
    link.href = selectedModel.imageUrl;
    link.download = selectedModel.name || "modelo_atividade";
    link.click();
    link.remove();
  };

  const onSubmit = (data: StartSurveyFormData) => {
    console.log(studentId, data); 
    // envia id do aluno e da atividade pro back
    onOpenChange(false);
  };

  const activityOptions = activityModels.map((model) => ({
    value: String(model.id),
    label: model.name
  }));
  
  const hasSelectedActivity = form.formState.isValid;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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

            <ReadOnlyField label="Ano Escolar" value={selectedModel?.schoolYear} />
            <ReadOnlyField label="Bimestre" value={selectedModel?.bimester} />
            <ReadOnlyField label="Eixo" value={selectedModel?.strand} />

            <Button 
              type="button"
              variant="ghost" 
              className="text-slate-600 hover:text-slate-900" 
              disabled={!hasSelectedActivity}
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