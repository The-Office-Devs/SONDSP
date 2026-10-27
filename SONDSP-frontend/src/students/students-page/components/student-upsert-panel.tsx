import { useEffect, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { 
  Check, 
  ChevronDown, 
  ChevronUp, 
  FileSpreadsheet, 
  X 
} from "lucide-react";

import { studentSchema, type StudentFormData, type StudentFormInput } from "../student.schema";
import { useCreateStudent, useImportStudents, useStudent, useUpdateStudent } from "../use-students";
import { useClasses } from "@/classes/use-classes";
import { getSubmitLabel } from "@/lib/form-utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { TextField } from "@/components/HookForm/fields/TextField";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/HookForm/fields/SelectField";
import { ComboboxField } from "@/components/HookForm/fields/ComboBoxField";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { cn, maskDate } from "@/lib/utils";

const defaultValues: StudentFormInput = {
  name: "",
  schoolId: 0,
  schoolClassId: 0,
  rowNumber: "",
  registration: "",
  birthDate: "",
  status: true
};

type StudentUpsertPanelProps = {
  studentIdToEdit: number | null;
  onCancelEdit: () => void;
};

const EXCEL_ACCEPT = ".xlsx,.xls,.xlsm,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"

export function StudentUpsertPanel({
  studentIdToEdit,
  onCancelEdit
}: Readonly<StudentUpsertPanelProps>) {
  const { mutate: createStudent, isPending: isCreating } = useCreateStudent();
  const { mutate: updateStudent, isPending: isUpdating } = useUpdateStudent();
  const { mutate: importStudents, isPending: isImporting } = useImportStudents();
  const { data: student, isLoading: isLoadingClass } = useStudent(studentIdToEdit);
  const { data: classesPage } = useClasses({ size: 100, status: true });

  const isEditMode = studentIdToEdit !== null;
  const isPending = isCreating || isUpdating;
  
  const submitType = isEditMode ? "edit" : "insert";
  const submitLabel = getSubmitLabel(isPending, submitType);
  
  const form = useForm<StudentFormInput, unknown, StudentFormData>({
    resolver: zodResolver(studentSchema),
    mode: "onChange",
    defaultValues
  });

  const schoolId = useWatch({ control: form.control, name: "schoolId" });
  const [registrationMode, setRegistrationMode] = useState<"individual" | "batch">("individual");
  const [batchFile, setBatchFile] = useState<File | null>(null);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (isEditMode) {
      setRegistrationMode("individual");
      setBatchFile(null);
    }
  }, [isEditMode]);

  useEffect(() => {
    if (!isEditMode) {
      form.reset(defaultValues);
      return;
    }
    
    if (student) {
      form.reset({ 
        name: student.name,
        schoolId: student.schoolClass?.school?.id ?? 0,
        schoolClassId: student.schoolClass?.id ?? 0,
        rowNumber: student.rowNumber ?? "",
        registration: student.registration,
        birthDate: student.birthDate ?? "",
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

  const handleImport = () => {
    if (!batchFile) return;

    importStudents(batchFile, {
      onSuccess: () => setBatchFile(null)
    });
  };

  const schoolOptions = Array.from(
    new Map(
      classesPage?.content
        .map((c) => [
          c.school.id, 
          { value: String(c.school.id), label: c.school.name }
        ]) ?? []
    ).values()
  );

  const classOptions =
    classesPage?.content
      ?.filter((c) => !schoolId || c.school.id == schoolId)
      .map((c) => ({
        value: String(c.id),
        label: `${c.name} - ${c.schoolYear}`
      })) ?? [];
  return (
    <Card className="border-0 bg-[#efefef] px-5 py-5 shadow-sm">
      <div className="space-y-5">
        <div className="flex flex-row items-center gap-4">
          <h2 className="text-lg font-semibold text-slate-950 whitespace-nowrap">
            {isEditMode ? "Edição de Aluno" : "Cadastro de Aluno"}
          </h2>

          {!isEditMode && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                Modo do Cadastro
              </span>
              <Select
                value={registrationMode}
                onValueChange={(v) => setRegistrationMode(v as "individual" | "batch")}
              >
                <SelectTrigger className="h-8 w-32 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="batch">Em Lote</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="ml-auto cursor-pointer text-slate-950"
          >
            {open ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
          </button>
        </div>
  
        <div className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}>
          <div className="overflow-hidden p-1">
            {registrationMode === "individual" ? (
              <FormProvider {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
                >   
                  <TextField
                    name="rowNumber"
                    label="N° Chamada"
                    placeholder="Número de chamada do aluno"
                    onlyNumbers
                    maxLength={3}
                  />

                  <TextField
                    name="registration"
                    label="Matrícula"
                    placeholder="Matrícula do aluno"
                    onlyNumbers
                  />

                  <TextField name="name" label="Nome Completo" placeholder="Nome completo do aluno" />

                  <TextField
                    name="birthDate"
                    label="Data de Nascimento"
                    placeholder="Data de nascimento do aluno"
                    onlyNumbers
                    mask={maskDate}
                  />

                  <SelectField
                    name="schoolId"
                    label="Escola"
                    placeholder="Selecione a escola"
                    options={schoolOptions}
                    onValueChange={() => form.setValue("schoolClassId", 0, { shouldValidate: true })}
                  />

                  <ComboboxField
                    name="schoolClassId"
                    label="Turma"
                    placeholder="Selecione a turma"
                    options={classOptions}
                    emptyMessage="Nenhuma turma encontrada."
                    disabled={!schoolId}
                  />
        
                  <div className="flex gap-2 items-end justify-end xl:col-start-3 self-start mt-[2rem]">
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
            ) : (
              <div className="space-y-4">
                {batchFile ? (
                  <div className="flex justify-between rounded-lg border border-input bg-white px-4 py-3">
                    <div className="flex items-center gap-2 text-sm">
                      <FileSpreadsheet className="size-4 text-muted-foreground" />
                      <p className="font-medium"> {batchFile.name} </p>
                      <p className="text-muted-foreground">
                        {(batchFile.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                    <Button
                      type="button"
                      isRounded
                      disabled={!batchFile || isImporting}
                      onClick={handleImport}
                    >
                      <Check className="size-4" />
                      {isImporting ? "Importando..." : "Importar"}
                    </Button>
                  </div>
                ) : (
                  <FileDropzone
                    accept={EXCEL_ACCEPT}
                    onFileSelected={setBatchFile}
                    onReject={() => toast.error("Apenas arquivos Excel (.xlsx, .xls) são permitidos.")}
                  />
                )}

                <div className="flex justify-end">
                  <Button
                    type="button"
                    isRounded
                    disabled={!batchFile || isPending}
                    onClick={() => {}}
                  >
                    <Check className="size-4" />
                    Importar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}