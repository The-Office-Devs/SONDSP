import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SchoolFilterBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SchoolFilterBar({ value, onChange }: Readonly<SchoolFilterBarProps>) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
      <div className="relative">
        <Input
          placeholder="Filtro Geral"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 border-slate-200 bg-white pr-10 text-sm"
        />
        <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
      </div>
    </div>
  );
}
