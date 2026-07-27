import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { toast } from "sonner";

import { strandSchema, type StrandFormData } from "../strand.schema";
import { getSubmitLabel } from "@/lib/form-utils";

import { Card } from "@/components/ui/card";
import { TextField } from "@/components/HookForm/fields/TextField";
import { SelectField } from "@/components/HookForm/fields/SelectField";
import { Button } from "@/components/ui/button";

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

  return (
    <Card className="border-0 bg-[#efefef] px-5 py-5 shadow-sm">
      <div className="space-y-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Cadastro de Eixo
        </h2>

        <FormProvider {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            <TextField
              name="name"
              label="Nome"
              placeholder="Nome do eixo"
            />

            <SelectField
              name="subject"
              label="Matéria"
              placeholder="Selecione a matéria"
              options={subjectOptions}
            />

            <div className="flex gap-2 items-end justify-end">
              <Button
                type="submit"
                isRounded={true}
                disabled={/*isPending ||*/ !form.formState.isValid}
              >
                <Check className="size-4" />
                {submitLabel}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </Card>
  )
}