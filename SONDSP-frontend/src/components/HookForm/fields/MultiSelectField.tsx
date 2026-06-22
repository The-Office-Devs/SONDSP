import type { FieldValues } from "react-hook-form"

import { FormField } from "../FormField"
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select"
import type { MultiSelectFieldProps } from "../types"

export function MultiSelectField<T extends FieldValues>({
  name,
  label,
  placeholder,
  options,
  search = false,
}: MultiSelectFieldProps<T>) {
  return (
    <FormField name={name} label={label} labelClassName="text-base">
      {({ field, invalid, fieldId }) => {
        const currentValues: string[] = Array.isArray(field.value) ? field.value : [];
        const hasAllSelected = currentValues.includes("ALL");

        const normalizedOptions = options.map((option) => ({
          ...option,
          disabled: hasAllSelected && option.value !== "ALL",
        }))

        const handleValuesChange = (values: string[]) => {
          if (values.includes("ALL")) {
            field.onChange(["ALL"])
            return
          }

          field.onChange(values.filter((value) => value !== "ALL"))
        }

        return (
          <div id={fieldId}>
            <MultiSelect
              values={currentValues}
              onValuesChange={handleValuesChange}
            >
              <MultiSelectTrigger
                aria-invalid={invalid}
                disabled={field.disabled}
                onBlur={field.onBlur}
                className="w-full"
              >
                <MultiSelectValue placeholder={placeholder} />
              </MultiSelectTrigger>

              <MultiSelectContent search={search}>
                {normalizedOptions.map((option) => (
                  <MultiSelectItem
                    key={option.value}
                    value={option.value}
                    badgeLabel={option.label}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </MultiSelectItem>
                ))}
              </MultiSelectContent>
            </MultiSelect>
          </div>
        )
      }}
    </FormField>
  )
}