import { Search } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "../ui/input-group";

interface FilterBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function FilterBar({ value, onChange }: Readonly<FilterBarProps>) {
  return (
    <InputGroup className="bg-white">
      <InputGroupInput
        name="filter"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Filtro Geral"
      />

      <InputGroupAddon align="inline-end" className="px-4">
        <InputGroupText>
          <Search className="size-4" />
        </InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  );
}