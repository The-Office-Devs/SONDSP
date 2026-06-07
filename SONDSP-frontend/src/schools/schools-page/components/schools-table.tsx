import { type ComponentType } from 'react';
import { Link2, PencilLine, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { School } from '../../schools.types';

interface SchoolsTableProps {
  schools: School[];
  onEdit: (school: School) => void;
  onDelete: (school: School) => void;
  onLinkUsers: (school: School) => void;
}

export function SchoolsTable({ schools, onEdit, onDelete, onLinkUsers }: Readonly<SchoolsTableProps>) {
  if (schools.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500 shadow-sm">
        Nenhuma escola encontrada.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full border-collapse text-sm">
        <thead className="bg-[#0a356d] text-white">
          <tr>
            {/*TODO: Aplicar ordenação nas colunas  */}
            <th className="w-1/3 px-6 py-3 text-left font-semibold">Nome ↓</th> 
            <th className="w-1/3 px-6 py-3 text-left font-semibold">Diretor ↓</th>
            <th className="px-6 py-3 text-center font-semibold">Ações</th>
          </tr>
        </thead>

        <tbody>
          {schools.map((school) => (
            <tr key={school.id} className="border-t border-slate-200">
              <td className="px-6 py-4 font-semibold text-slate-900">{school.name}</td>
              <td className="px-6 py-4 font-semibold text-slate-900">—</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <ActionButton icon={PencilLine} variant="outline" onClick={() => onEdit(school)}>
                    Editar
                  </ActionButton>
                  <ActionButton icon={Link2} variant="secondary" onClick={() => onLinkUsers(school)}>
                    Vincular Usuários
                  </ActionButton>
                  <ActionButton icon={Trash2} variant="destructive" onClick={() => onDelete(school)}>
                    Excluir
                  </ActionButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type ActionButtonProps = Readonly<{
  icon: ComponentType<{ className?: string }>;
  variant: 'outline' | 'secondary' | 'destructive';
  children: string;
  onClick?: () => void;
}>;

function ActionButton({ icon: Icon, variant, children, onClick }: ActionButtonProps) {
  const shared = 'rounded-md px-4';

  if (variant === 'secondary') {
    return (
      <Button
        variant="secondary"
        size="sm"
        className={`${shared} bg-[#0a356d] text-white hover:bg-[#082d5d]`}
        onClick={onClick}
      >
        <Icon className="size-4" />
        {children}
      </Button>
    );
  }

  if (variant === 'destructive') {
    return (
      <Button variant="destructive" size="sm" className={shared} onClick={onClick}>
        <Icon className="size-4" />
        {children}
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className={`${shared} border-slate-400 text-slate-900 hover:bg-slate-50`}
      onClick={onClick}
    >
      <Icon className="size-4" />
      {children}
    </Button>
  );
}
