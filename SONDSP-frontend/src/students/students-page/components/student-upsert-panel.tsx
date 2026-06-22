import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "lucide-react";

import { studentSchema, type StudentFormData, type StudentFormInput } from "../student.schema";
import { useCreateStudent, useStudent, useUpdateStudent } from "../use-students";
import { useClasses } from "@/classes/classes-page/use-classes";
import { getSubmitLabel } from "@/lib/form-utils";

import { Card } from "@/components/ui/card";
import { TextField } from "@/components/HookForm/fields/TextField";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/HookForm/fields/SelectField";

const defaultValues: StudentFormInput = {
  name: "",
  schoolClassId: 0,
  rowNumber: "",
  registration: "",
  status: true
};

type StudentUpsertPanelProps = {
  studentIdToEdit: number | null;
  onCancelEdit: () => void;
};

export function StudentUpsertPanel({
  studentIdToEdit,
  onCancelEdit
}: Readonly<StudentUpsertPanelProps>) {
  const { mutate: createStudent, isPending: isCreating } = useCreateStudent();
  const { mutate: updateStudent, isPending: isUpdating } = useUpdateStudent();
  const { data: student, isLoading: isLoadingClass } = useStudent(studentIdToEdit);
  const { data: classesPage } = useClasses({ size: 100, status: true });

  const isEditMode = studentIdToEdit !== null;
  const isPending = isCreating || isUpdating;
  const submitLabel = getSubmitLabel(isPending, isEditMode);
  
  const form = useForm<StudentFormInput, unknown, StudentFormData>({
    resolver: zodResolver(studentSchema),
    mode: "onChange",
    defaultValues
  });

  useEffect(() => {
    if (!isEditMode) {
      form.reset(defaultValues);
      return;
    }
    
    if (student) {
      form.reset({ 
        name: student.name,
        schoolClassId: student.schoolClass?.id ?? 0,
        rowNumber: student.rowNumber ?? "",
        registration: student.registration,
        status: student.status
      });
    }
  }, [isEditMode, student, form]);

  const onSubmit = (data: StudentFormData) => {
    if (isEditMode && studentIdToEdit) {
      updateStudent(
        { id: studentIdToEdit, data },
        {
          onSuccess: () => {
            form.reset(defaultValues);
            onCancelEdit();
          },
        }
      );
      return;
    }
    
    createStudent(data, {
      onSuccess: () => {
        form.reset(defaultValues);
      },
    });
  };

  const handleCancelEdit = () => {
    form.reset(defaultValues);
    onCancelEdit();
  };

  const classOptions = 
    classesPage?.content?.map((c) => ({
      value: String(c.id),
      label: `${c.name} - ${c.school.name}`
    })) ?? [];

  return (
    <Card className="border-0 bg-[#efefef] px-5 py-5 shadow-sm">
      <div className="space-y-5">
        <h2 className="text-lg font-semibold text-slate-950">
          {isEditMode ? "Edição de Aluno" : "Cadastro de Aluno"}
        </h2>
  
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          >   
            <TextField
              name="rowNumber"
              label="N° Chamada"
              placeholder="N° Chamada do Aluno"
              onlyNumbers
              maxLength={3}
            />

            <TextField
              name="name"
              label="Nome"
              placeholder="Nome do Aluno"
            />

            <SelectField
              name="schoolClassId"
              label="Turma"
              placeholder="Selecione a turma"
              options={classOptions}
            />

            <TextField
              name="registration"
              label="Matrícula"
              placeholder="Matrícula do Aluno"
              onlyNumbers
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