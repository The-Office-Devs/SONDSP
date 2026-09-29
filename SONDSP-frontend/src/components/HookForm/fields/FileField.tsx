import { useController, useFormContext } from "react-hook-form";
import { toast } from "sonner";

import { SelectedFile } from "@/components/ui/selected-file";
import { FileDropzone } from "@/components/ui/file-dropzone";

interface FileFieldProps {
  name: string;
  label: string;
  accept?: string;
  rejectMessage?: string;
  icon?: React.ElementType;
  dropzoneClassName?: string;
}

export function FileField({
  name,
  label,
  accept,
  rejectMessage = "Tipo de arquivo não permitido.",
  icon,
  dropzoneClassName = "min-h-12 items-start px-4"
}: Readonly<FileFieldProps>) {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ name, control });
  const file = field.value as File | undefined;

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label className="text-base font-medium">{label}</label>

      {file ? (
        <SelectedFile
          file={file}
          icon={icon}
          onRemove={() => field.onChange(undefined)}
        />
      ) : (
        <FileDropzone
          accept={accept}
          onFileSelected={field.onChange}
          onReject={() => toast.error(rejectMessage)}
          className={dropzoneClassName}
        />
      )}

      {fieldState.error && (
        <p className="text-sm text-destructive">{fieldState.error.message}</p>
      )}
    </div>
  );
}