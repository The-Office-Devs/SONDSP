import {
  useController,
  useFormContext,
  type ControllerRenderProps,
  type FieldError,
  type FieldPath,
  type FieldValues
} from "react-hook-form";

interface UseFormFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  id?: string;
}

interface UseFormFieldReturn<T extends FieldValues> {
  field: ControllerRenderProps<T, FieldPath<T>>;
  invalid: boolean;
  error: FieldError | undefined;
  fieldId: string;
}

export function useFormField<T extends FieldValues>({ name, id }: UseFormFieldProps<T>): UseFormFieldReturn<T> {
  const { control } = useFormContext<T>();
  const { field, fieldState: { invalid, error } } = useController({ name, control })

  return {
    field,
    invalid,
    error,
    fieldId: id ?? `field-${name}`
  };
}