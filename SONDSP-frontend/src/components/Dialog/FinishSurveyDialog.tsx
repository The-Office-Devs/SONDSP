import { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";

import { ACCEPTED_FILE_TYPES, FILE_ACCEPT } from "@/lib/file-utils";
import { getPedagogicalResultOptions } from "@/lib/options-utils";
import type { SurveyListItem } from "@/surveys/surveys.types";
import { useFinishSurvey } from "@/surveys/use-surveys";
import { getSurveyResultOptionsService } from "@/surveys/surveys.service";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { FileField } from "../HookForm/fields/FileField";
import { TextAreaField } from "../HookForm/fields/TextAreaField";
import { SelectField } from "../HookForm/fields/SelectField";
import { Button } from "../ui/button";

const finishSurveySchema = z.object({
  image: z
    .instanceof(File, { message: "Selecione um modelo de atividade" })
    .refine(
      (f) => ACCEPTED_FILE_TYPES.includes(f.type),
      "Apenas imagens ou PDF são permitidos"
    ),
  result: z.string().min(1, "Selecione o resultado"),
  notes: z.string().optional()
});

export type FinishSurveyFormData = z.infer<typeof finishSurveySchema>;

const defaultValues: FinishSurveyFormData = {
  image: undefined as unknown as File,
  result: "",
  notes: ""
};

interface FinishSurveyDialogProps {
  data: SurveyListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FinishSurveyDialog({
  data,
  open,
  onOpenChange
}: Readonly<FinishSurveyDialogProps>) {
  const { mutate: finishSurvey, isPending } = useFinishSurvey();

  const [options, setOptions] = useState<{ value: string; label: string }[]>(() =>
    getPedagogicalResultOptions(
      data?.activity?.strand?.name,
      data?.activity?.gradeLevel,
      data?.activity?.name
    )
  );

  const form = useForm<FinishSurveyFormData>({
    resolver: zodResolver(finishSurveySchema),
    mode: "onChange",
    defaultValues
  });

  useEffect(() => {
    if (open) {
      form.reset(defaultValues);

      if (data?.activity) {
        // Inicializa com matriz pedagógica local
        const initialOptions = getPedagogicalResultOptions(
          data.activity.strand?.name,
          data.activity.gradeLevel,
          data.activity.name
        );
        setOptions(initialOptions);

        // Consulta a API como fonte da verdade oficial
        if (data.activity.id) {
          getSurveyResultOptionsService(data.activity.id)
            .then((apiOptions) => {
              if (apiOptions && apiOptions.length > 0) {
                setOptions(apiOptions);
              }
            })
            .catch(() => {
              // Mantém fallback pedagógico local em caso de erro
            });
        }
      }
    }
  }, [open, data?.activity, form]);

  const onSubmit = (formData: FinishSurveyFormData) => {
    if (!data) return;

    finishSurvey(
      { surveyId: data.id, data: formData },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  const isSubmitDisabled = isPending || !form.formState.isValid;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{data?.activity.name}</DialogTitle>
          {data?.activity && (
            <p className="text-xs text-slate-500">
              Eixo: {data.activity.strand?.name} • Ano: {data.activity.gradeLevel}
            </p>
          )}
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="min-w-0 space-y-4">
            <FileField
              name="image"
              label="Sondagem"
              accept={FILE_ACCEPT}
              rejectMessage="Apenas imagens ou PDF são permitidos!"
            />
            
            <SelectField
              name="result" 
              label="Resultado"
              placeholder="Selecione o nível"
              options={options}
            />

            <TextAreaField 
              name="notes"
              label="Observações"
              placeholder="Observações"
            />

            <DialogFooter>
              <Button
                type="submit"
                disabled={isSubmitDisabled}
              >
                {isPending ? "Finalizando..." : "Salvar e Finalizar Sondagem"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}