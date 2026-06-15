import type { FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { FormField } from "../FormField";
import type { TextFieldProps } from "../types";

export function TextField<T extends FieldValues>({
  name,
  label,
  placeholder,
  type = 'text',
  onlyNumbers = false,
  ui = 'desktop'
}: TextFieldProps<T>) {
  return (
    <FormField
      name={name}
      label={label}
      labelClassName={cn("text-base", ui == 'mobile' && "text-sm font-semibold uppercase tracking-wider")}
    >
      {({ field, invalid, fieldId }) => (
        <Input
          {...field}
          id={fieldId}
          aria-invalid={invalid}
          type={type}
          placeholder={placeholder}
          inputMode={onlyNumbers ? "numeric" : undefined}
          onChange={(e) => {
            const value = onlyNumbers
              ? e.target.value.replace(/\D/g, "")
              : e.target.value;
            field.onChange(value);
          }}
        />
      )}
    </FormField>
  );
}