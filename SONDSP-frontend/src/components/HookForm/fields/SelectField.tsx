import type { FieldValues } from "react-hook-form";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "../FormField";
import type { SelectFieldProps } from "../types";

export function SelectField<T extends FieldValues>({ name, label, options }: SelectFieldProps<T>) {
  return (
    <FormField name={name} label={label}>
      {({ field, invalid, fieldId }) => (
        <Select
          value={field.value}
          onValueChange={field.onChange}
          disabled={field.disabled}
        >
          <SelectTrigger
            id={fieldId}
            aria-invalid={invalid}
            onBlur={field.onBlur}
            className="w-full"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FormField>
  );
}