import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

interface ReadOnlyFieldProps {
  label: string;
  value?: string | number;
}

export function ReadOnlyField({ label, value }: Readonly<ReadOnlyFieldProps>) {
  return (
    <Field>
      <FieldLabel className="text-base">{label}</FieldLabel>
      <Input value={value ?? ""} disabled readOnly />
    </Field>
  );
}