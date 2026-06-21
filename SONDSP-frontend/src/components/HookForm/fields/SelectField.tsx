import type { FieldValues } from "react-hook-form";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "../FormField";
import type { SelectFieldProps } from "../types";

export function SelectField<T extends FieldValues>({ 
  name, 
  label, 
  placeholder,
  options
}: SelectFieldProps<T>) {
  return (
    <FormField name={name} label={label} labelClassName="text-base">
      {({ field, invalid, fieldId }) => (
        <Select
          value={field.value ? String(field.value) : undefined}
          onValueChange={field.onChange}
          disabled={field.disabled}
        >
          <SelectTrigger
            id={fieldId}
            ref={field.ref}
            aria-invalid={invalid}
            onBlur={field.onBlur}
          >
            <SelectValue placeholder={placeholder} />
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