import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { type ActivityFormData, activitySchema, type ActivityFormInput } from "../activity-schema";
import { getSubmitLabel } from "@/lib/form-utils";
import { FILE_ACCEPT } from "@/lib/file-utils";
import { bimesterOptions, gradeLevelOptions, subjectOptions } from "@/lib/options-utils";
import { useCreateActivity } from "../use-activities";
import { useStrandOptions } from "@/strands/strands-page/use-strands";

import { Card } from "@/components/Card/Card";
import { TextField } from "@/components/HookForm/fields/TextField";
import { SelectField } from "@/components/HookForm/fields/SelectField";
import { FileField } from "@/components/HookForm/fields/FileField";

const defaultValues: ActivityFormInput = {
  name: "",
  subjectId: 0,
  strandId: 0,
  gradeLevel: "",
  bimester: "",
  activityModelFile: undefined as unknown as File
}

export function ActivityInsertPanel() {
  const { mutate: createActivity, isPending } = useCreateActivity();

  const submitLabel = getSubmitLabel(isPending, 'insert');

  const form = useForm<ActivityFormInput, unknown, ActivityFormData>({
    resolver: zodResolver(activitySchema),
    mode: "onChange",
    defaultValues
  });

  const subject = useWatch({ control: form.control, name: "subjectId" });

  const subjectLabel = subjectOptions.find(
    (opt) => opt.value === String(subject)
  )?.label;
  const { options: strandOptions, isLoading: isLoadingStrands } = useStrandOptions(subjectLabel);

  const onSubmit = (data: ActivityFormData) => {
    createActivity(data, {
      onSuccess: () => {
        form.reset(defaultValues);
      },
      onError: () => {
        toast.error("Erro ao cadastrar modelo de atividade.");
      }
    });
  }

  const isSubmitDisabled = isPending || !form.formState.isValid;
  return (
    <FormProvider {...form}>
      <Card
        title="Cadastro de Modelo de Atividade"
        submitLabel={submitLabel}
        isFilter={false}
        isSubmitDisabled={isSubmitDisabled}
        onSubmit={form.handleSubmit(onSubmit)} 
      >
        <TextField name="name" label="Nome" placeholder="Nome do modelo de atividade" />

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
          name="gradeLevel"
          label="Ano Escolar"
          placeholder="Selecione o ano escolar"
          options={gradeLevelOptions}
        />

        <SelectField
          name="bimester"
          label="Bimestre"
          placeholder="Selecione o bimestre"
          options={bimesterOptions}
        />

        <FileField
          name="activityModelFile"
          label="Modelo de Atividade"
          accept={FILE_ACCEPT}
          rejectMessage="Apenas imagens ou PDF são permitidos!"
        />
      </Card>
    </FormProvider>
  );
}