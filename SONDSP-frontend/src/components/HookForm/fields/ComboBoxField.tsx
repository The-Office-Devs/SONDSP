import type { FieldValues } from "react-hook-form";

import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { FormField } from "../FormField";
import type { ComboboxFieldProps } from "../types";

type Option = { value: string; label: string };

export function ComboboxField<T extends FieldValues>({
  name,
  label,
  placeholder,
  options,
  emptyMessage = "Nenhum resultado encontrado.",
  onValueChange
}: ComboboxFieldProps<T>) {
  return (
    <FormField name={name} label={label} labelClassName="text-base">
      {({ field, invalid, fieldId }) => {
        const selected = options.find((o) => o.value === String(field.value ?? "")) ?? null;

        return (
          <Combobox
            items={options}
            value={selected}
            onValueChange={(option: Option | null) => {
              const value = option?.value ?? "";
              field.onChange(value);
              onValueChange?.(value);
            }}
            itemToStringLabel={(item: Option) => item.label}
            isItemEqualToValue={(a: Option, b: Option) => a.value === b.value}
            disabled={field.disabled}
          >
            <ComboboxInput
              id={fieldId}
              ref={field.ref}
              onBlur={field.onBlur}
              aria-invalid={invalid}
              placeholder={placeholder}
              disabled={field.disabled}
            >
              <ComboboxContent>
                <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
                <ComboboxList>
                  {(item: Option) => (
                    <ComboboxItem
                      key={item.value}
                      value={item}
                    >
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </ComboboxInput>
          </Combobox>
        );
      }}
    </FormField>
  );
}