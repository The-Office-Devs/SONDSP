import { get, useFormContext, type FieldValues } from "react-hook-form";
import { useRef } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "../FormField";
import type { SelectFieldProps } from "../types";

export function SelectField<T extends FieldValues>({ 
  name, 
  label, 
  placeholder,
  options,
  onValueChange,
  disabled,
  clearable = false
}: SelectFieldProps<T>) {
  const { formState } = useFormContext<T>();
  const pointerTypeRef = useRef("touch");

  return (
    <FormField name={name} label={label} labelClassName="text-base">
      {({ field, invalid, fieldId }) => {
        const selectedValue = field.value ? String(field.value) : "";

        const clearSelection = () => {
          field.onChange(get(formState.defaultValues, name) ?? "");
          onValueChange?.("");
        }

        const getClearHandlers = (optionValue: string) => {
          if (!clearable || optionValue !== selectedValue) return {};
 
          return {
            onPointerDown: (event: React.PointerEvent) => {
              pointerTypeRef.current = event.pointerType;
            },
            onPointerMove: (event: React.PointerEvent) => {
              pointerTypeRef.current = event.pointerType;
            },
            onPointerUp: () => {
              if (pointerTypeRef.current === "mouse") clearSelection();
            },
            onClick: () => {
              if (pointerTypeRef.current !== "mouse") clearSelection();
            },
            onKeyDown: (event: React.KeyboardEvent) => {
              if (event.key === "Enter" && event.target === event.currentTarget) clearSelection();
            }
          };
        };

        return (
          <Select
            value={selectedValue}
            onValueChange={(value) => {
              field.onChange(value);
              onValueChange?.(value);
            }}
            disabled={disabled || field.disabled}
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
                <SelectItem key={o.value} value={o.value} {...getClearHandlers(o.value)}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }}
    </FormField>
  );
}