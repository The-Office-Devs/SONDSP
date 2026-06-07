import type { FieldValues } from "react-hook-form";

import { Textarea } from "@/components/ui/textarea";
import { FormField } from "../FormField";
import type { TextAreaFieldProps } from "../types";

export function TextAreaField<T extends FieldValues>({ name, label, placeholder, rows = 4 }: TextAreaFieldProps<T>) {
  return (
    <FormField name={name} label={label}>
      {({ field, invalid, fieldId }) => (
        <Textarea
          {...field}
          id={fieldId}
          aria-invalid={invalid}
          placeholder={placeholder}
          rows={rows}
        />
      )}
    </FormField>
  );
}