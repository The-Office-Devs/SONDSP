import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "lucide-react";

import { classSchema, type ClassFormData, type ClassFormInput } from "../class.schema";
import { useClass, useCreateClass, useUpdateClass } from "../use-classes";
import { useSchools } from "@/schools/schools-page/use-schools";
import { getSubmitLabel } from "@/lib/form-utils";

import { Card } from "@/components/ui/card";
import { TextField } from "@/components/HookForm/fields/TextField";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/HookForm/fields/SelectField";

const defaultValues: ClassFormInput = {
  schoolId: 0,
  name: "",
  schoolYear: ""
};

type ClassUpsertPanelProps = {
  classIdToEdit: number | null;
  onCancelEdit: () => void;
};

export function ClassUpsertPanel({
  classIdToEdit,
  onCancelEdit
}: Readonly<ClassUpsertPanelProps>) {
  const { mutate: createClass, isPending: isCreating } = useCreateClass();
  const { mutate: updateClass, isPending: isUpdating } = useUpdateClass();
  const { data: schoolClass, isLoading: isLoadingClass } = useClass(classIdToEdit);
  const { data: schoolsPage } = useSchools({ size: 100, status: true });

  const isEditMode = classIdToEdit !== null;
  const isPending = isCreating || isUpdating;
  const submitLabel = getSubmitLabel(isPending, isEditMode);
  
  const form = useForm<ClassFormInput, unknown, ClassFormData>({
    resolver: zodResolver(classSchema),
    mode: "onChange",
    defaultValues
  });

  useEffect(() => {
    if (!isEditMode) {
      form.reset(defaultValues);
      return;
    }
    
    if (schoolClass) {
      form.reset({ 
        schoolId: schoolClass.school.id,
        name: schoolClass.name,
        schoolYear: schoolClass.schoolYear,
      });
    }
  }, [isEditMode, schoolClass, form]);

  const onSubmit = (data: ClassFormData) => {
    if (isEditMode && classIdToEdit) {
      updateClass(
        { id: classIdToEdit, data },
        {
          onSuccess: () => {
            form.reset(defaultValues);
            onCancelEdit();
          },
        }
      );
      return;
    }
    
    createClass(data, {
      onSuccess: () => {
        form.reset(defaultValues);
      },
    });
  };

  const handleCancelEdit = () => {
    form.reset(defaultValues);
    onCancelEdit();
  };

  const schoolOptions = 
    schoolsPage?.content?.map((school) => ({
      value: String(school.id),
      label: school.name
    })) ?? [];

  return (
    <Card className="border-0 bg-[#efefef] px-5 py-5 shadow-sm">
      <div className="space-y-5">
        <h2 className="text-lg font-semibold text-slate-950">
          {isEditMode ? "Edição de Turma" : "Cadastro de Turma"}
        </h2>
  
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            <SelectField
              name="schoolId"
              label="Escola"
              placeholder="Selecione a escola"
              options={schoolOptions}
            />
            
            <TextField
              name="name"
              label="Nome"
              placeholder="Nome da Turma"
            />
  
            <TextField
              name="schoolYear"
              label="Ano Letivo"
              placeholder="Ano Letivo"
              onlyNumbers
              maxLength={4}
            />
  
            <div className="flex gap-2 items-end justify-end xl:col-start-3">
              {isEditMode && (
                <Button
                  type="button"
                  variant="outline"
                  isRounded={true}
                  onClick={handleCancelEdit}
                >
                  <X className="size-4" />
                  Cancelar
                </Button>
              )}
  
              <Button
                type="submit"
                isRounded={true}
                disabled={isPending || isLoadingClass|| !form.formState.isValid}
              >
                <Check className="size-4" />
                {submitLabel}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </Card>
  );
}