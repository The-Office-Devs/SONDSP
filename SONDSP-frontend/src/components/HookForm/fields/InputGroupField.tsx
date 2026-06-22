import type { FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { FormField } from "../FormField";
import type { InputGroupFieldProps } from "../types";

export function InputGroupField<T extends FieldValues>({
  id,
  name,
  label,
  placeholder,
  prefix,
  suffix,
  type = 'text',
  ui = 'desktop'
}: InputGroupFieldProps<T>) {
  return (
    <FormField
      name={name}
      label={label}
      id={id}
      labelClassName={cn("text-base", ui == 'mobile' && "text-sm font-semibold uppercase tracking-wider")}
    >
      {({ field, invalid, fieldId }) => (
        <InputGroup>
          {prefix && (
            <InputGroupAddon align="inline-start">
              <InputGroupText>{prefix}</InputGroupText>
            </InputGroupAddon>
          )}

          <InputGroupInput
            {...field}
            id={fieldId}
            type={type}
            aria-invalid={invalid}
            placeholder={placeholder}
          />

          {suffix && (
            <InputGroupAddon align="inline-end">
              {suffix.type === 'text' ? (
                <InputGroupText>{suffix.content}</InputGroupText>
              ) : (
                <InputGroupButton onClick={suffix.onClick}>
                  {suffix.label}
                </InputGroupButton>
              )}
            </InputGroupAddon>
          )}
        </InputGroup>
      )}
    </FormField>
  );
}