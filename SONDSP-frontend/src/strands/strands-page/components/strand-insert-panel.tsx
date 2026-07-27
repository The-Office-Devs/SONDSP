import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { strandSchema, type StrandFormData } from "../strand.schema";
import { getSubmitLabel } from "@/lib/form-utils";

import { Card } from "@/components/Card/Card";
import { TextField } from "@/components/HookForm/fields/TextField";
import { SelectField } from "@/components/HookForm/fields/SelectField";

const subjectOptions = [
  { value: "Língua Portuguesa", label: "Língua Portuguesa" },
  { value: "Matemática", label: "Matemática" }
];

const defaultValues: StrandFormData = {
  name: "",
  subject: ""
};

export function StrandInsertPanel() {
  // const { mutate: createStrand, isPending } = useCreateStrand();
  const submitLabel = getSubmitLabel(/*isPending*/false, false);
  
  const form = useForm<StrandFormData>({
    resolver: zodResolver(strandSchema),
    mode: "onChange",
    defaultValues
  });

  const onSubmit = (data: StrandFormData) => {
    console.log(data);
    form.reset(defaultValues);
    toast.success("Eixo cadastrado com sucesso");
    /*createStrand(data, {
      onSuccess: () => {
        form.reset(defaultValues);
      },
    });*/
  }

  const isSubmitDisabled = /*isPending ||*/ !form.formState.isValid;
  return (
    <FormProvider {...form}>
      <Card 
        title="Cadastro de Eixo"
        submitLabel={submitLabel}
        isSubmitDisabled={isSubmitDisabled}
        isFilter={false}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <TextField name="name" label="Nome" placeholder="Nome do eixo" />

        <SelectField
          name="subject"
          label="Matéria"
          placeholder="Selecione a matéria"
          options={subjectOptions}
        />
      </Card>
    </FormProvider>
  );
}