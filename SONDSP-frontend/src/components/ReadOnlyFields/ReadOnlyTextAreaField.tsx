import { Field, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";

interface ReadOnlyTextAreaFieldProps {
  label: string;
  value?: string;
  rows?: number;
}

export function ReadOnlyTextAreaField({ label, value, rows = 6 }: Readonly<ReadOnlyTextAreaFieldProps>) {
  return (
    <Field>
      <FieldLabel className="text-base">{label}</FieldLabel>
      <Textarea 
        value={value ?? ""} 
        readOnly 
        rows={rows} 
        className="bg-neutral-50" 
      />
    </Field>
  );
}