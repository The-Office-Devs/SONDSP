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
  ui = 'desktop'
}: TextFieldProps<T>) {
  return (
    <FormField
      name={name}
      label={label}
      labelClassName={cn(ui == 'mobile' && "text-xs font-semibold uppercase tracking-wider")}
    >
      {({ field, invalid, fieldId }) => (
        <Input
          {...field}
          className={cn(ui == 'mobile' && "h-12 text-base", "bg-white")}
          id={fieldId}
          aria-invalid={invalid}
          type={type}
          placeholder={placeholder}
        />
      )}
    </FormField>
  );
}