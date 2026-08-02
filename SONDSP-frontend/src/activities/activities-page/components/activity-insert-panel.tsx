import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, X } from "lucide-react";
import { toast } from "sonner";

import { type ActivityFormData, activitySchema, type ActivityFormInput } from "../activity-schema";
import { getSubmitLabel } from "@/lib/form-utils";

import { Card } from "@/components/Card/Card";
import { TextField } from "@/components/HookForm/fields/TextField";
import { SelectField } from "@/components/HookForm/fields/SelectField";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { Button } from "@/components/ui/button";

const subjectOptions = [
  { value: "1", label: "Matemática" },
  { value: "2", label: "Língua Portuguesa" }
];

const strandOptions = [
  { value: "1", label: "Números" },
  { value: "2", label: "Mais Números" }
];

const bimesterOptions = [1, 2, 3, 4].map((n) => {
  const label = `${n}° Bimestre`;
  return { value: label, label };
});

const defaultValues: ActivityFormInput = {
  name: "",
  subjectId: 0,
  strandId: 0,
  schoolYear: "",
  bimester: "",
  activityModelFile: undefined as unknown as File
}

const FILE_ACCEPT = ".png,.jpg,.jpeg,.webp,.pdf,image/*,application/pdf";

export function ActivityInsertPanel() {
  // const { mutate: createStrand, isPending } = useCreateActivity();
  const submitLabel = getSubmitLabel(/*isPending*/false, false);

  const form = useForm<ActivityFormInput, unknown, ActivityFormData>({
    resolver: zodResolver(activitySchema),
    mode: "onChange",
    defaultValues
  });

  const activityModelFile = useWatch({ control: form.control, name: "activityModelFile"}) as File | undefined;

  const onSubmit = (data: ActivityFormData) => {
    console.log(data);
    form.reset(defaultValues);
    toast.success("Modelo de Atividade cadastrado com sucesso");
    /*createStrand(data, {
      onSuccess: () => {
        form.reset(defaultValues);
      },
    });*/
  }
  
  const isSubmitDisabled = /*isPending || isLoadingActivity||*/ !form.formState.isValid
  // Trocar select do eixo para combobox e ter um comportamento a tela de alunos -> quando back ficar pronto
  // ta aparecendo o icone de search pq a alteração que corrige isso foi feita na outra branch
  return (
    <FormProvider {...form}>
      <Card
        title="Cadastro de Modelo de Atividade"
        submitLabel={submitLabel}
        isSubmitDisabled={isSubmitDisabled}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <TextField name="name" label="Nome" placeholder="Nome do Modelo de Atividade" />

        <SelectField
          name="subjectId"
          label="Matéria"
          placeholder="Selecione a matéria"
          options={subjectOptions}
        />

        <SelectField 
          name="strandId"
          label="Eixo"
          placeholder="Selecione o eixo"
          options={strandOptions}
        />

        <TextField
          name="schoolYear"
          label="Ano Letivo"
          placeholder="Ano Letivo"
          maxLength={4}
        />

        <SelectField
          name="bimester"
          label="Bimestre"
          placeholder="Selecione o bimestre"
          options={bimesterOptions}
        />

        <div className="flex flex-col gap-2">
          <label className="text-base font-medium">
            Modelo de Atividade
          </label>

          {activityModelFile ? (
            <div className="flex items-center justify-between gap-2 rounded-lg border border-input bg-white px-3 py-2.25">
              <div className="flex min-w-0 items-center gap-2 text-sm">
                <ImageIcon className="size-4 shrink-0 text-muted-foreground" />
                <p className="truncate font-medium">{activityModelFile.name}</p>
                <p className="shrink-0 whitespace-nowrap text-muted-foreground">
                  {(activityModelFile.size / 1024).toFixed(0)} KB
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="w-auto shrink-0"
                onClick={() =>
                  form.setValue("activityModelFile", undefined as unknown as File, {
                    shouldValidate: true,
                  })
                }
              >
                <X className="size-4 opacity-50" />
              </Button>
            </div>
          ) : (
            <FileDropzone
              accept={FILE_ACCEPT}
              onFileSelected={(file) =>
                form.setValue("activityModelFile", file, { shouldValidate: true })
              }
              onReject={() => toast.error("Apenas imagens ou PDF são permitidos!")}
              className="min-h-12"
            />
          )}
        </div>
      </Card>
    </FormProvider>
  );
}