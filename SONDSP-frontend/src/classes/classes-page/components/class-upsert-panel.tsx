import { useHasPermission } from "@/auth/use-permission";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { classSchema, type ClassFormData, type ClassFormInput } from "../class.schema";
import { useClass, useCreateClass, useUpdateClass } from "../../use-classes";
import { getSubmitLabel } from "@/lib/form-utils";
import { getTitle } from "@/lib/card-utils";
import { gradeLevelOptions, shiftOptions } from "@/lib/options-utils";

import { Card } from "@/components/Card/Card";
import { TextField } from "@/components/HookForm/fields/TextField";
import { SelectField } from "@/components/HookForm/fields/SelectField";

const defaultValues: ClassFormInput = {
  name: "",
  gradeLevel: "",
  schoolYear: "",
  shift: ""
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

  const isEditMode = classIdToEdit !== null;
  const isPending = isCreating || isUpdating;
  const canManageClasses = useHasPermission("TURMA_MANAGE");


  const title = getTitle("Turma", isEditMode, false);
  const submitType = isEditMode ? "edit" : "insert";
  const submitLabel = getSubmitLabel(isPending, submitType);
  
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
        name: schoolClass.name,
        gradeLevel: schoolClass.gradeLevel,
        schoolYear: schoolClass.schoolYear,
        shift: schoolClass.shift
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

  const isSubmitDisabled = isPending || isLoadingClass || !form.formState.isValid || !canManageClasses;
  return (
    <FormProvider {...form}>
      <Card
        title={title} 
        submitLabel={submitLabel}
        isFilter={false}
        isEditMode={isEditMode} 
        isSubmitDisabled={isSubmitDisabled}
        onSubmit={form.handleSubmit(onSubmit)}
        onReset={handleCancelEdit}
      >
        <TextField name="name" label="Nome" placeholder="Nome da turma" />

        <SelectField
          name="gradeLevel"
          label="Ano Escolar"
          placeholder="Selecione o ano escolar"
          options={gradeLevelOptions}
        />
  
        <TextField
          name="schoolYear"
          label="Ano Letivo"
          placeholder="Ano letivo da turma"
          onlyNumbers
          maxLength={4}
        />

        <SelectField
          name="shift"
          label="Turno"
          placeholder="Selecione o turno"
          options={shiftOptions}
        />
      </Card>
    </FormProvider>
  );
}