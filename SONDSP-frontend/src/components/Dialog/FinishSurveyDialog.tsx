import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";

import { ACCEPTED_FILE_TYPES, FILE_ACCEPT } from "@/lib/file-utils";
import { resultOptions } from "@/lib/options-utils";
import type { SurveyListItem } from "@/surveys/surveys.types";
import { useFinishSurvey } from "@/surveys/use-surveys";

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

  const form = useForm<FinishSurveyFormData>({
    resolver: zodResolver(finishSurveySchema),
    mode: "onChange",
    defaultValues
  });

  useEffect(() => {
    if (open) form.reset(defaultValues);
  }, [open, form])

  const onSubmit = (formData: FinishSurveyFormData) => {
    if (!data) return;

    finishSurvey(
      { surveyId: data.id, data: formData },
      { onSuccess: () => onOpenChange(false) }
    )
  };

  const isSubmitDisabled = isPending || !form.formState.isValid;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{data?.activity.name}</DialogTitle>
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
              options={resultOptions}
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