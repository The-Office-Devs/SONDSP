import type { ReactNode } from "react";
import type { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";

import { Field, FieldError, FieldLabel } from "../ui/field";
import { useFormField } from "@/hooks/use-form-field";

interface FormFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  id?: string;
  labelClassName?: string;
  children: (
    ctx: {
      field: ControllerRenderProps<T, FieldPath<T>>;
      invalid: boolean;
      fieldId: string ;
    }
  ) => ReactNode;
}

export function FormField<T extends FieldValues>({ name, label, id, labelClassName, children }: FormFieldProps<T>) {
  const { field, invalid, error, fieldId } = useFormField<T>({ name, id });

  return (
    <Field data-invalid={invalid}>
      <FieldLabel className={labelClassName} htmlFor={fieldId}>
        {label}
      </FieldLabel>
      {children({ field, invalid, fieldId })}

      {invalid && <FieldError errors={[error]} />}
    </Field>
  );
}