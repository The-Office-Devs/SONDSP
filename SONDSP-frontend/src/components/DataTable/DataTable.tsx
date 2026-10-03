import { cn } from "@/lib/utils";
import { 
  AlarmSmoke, 
  BookOpenCheck, 
  Check,
  ClipboardList,
  Download,
  Eye,
  Link2, 
  Link2Off, 
  List,
  Loader2, 
  NotebookPen, 
  PencilLine, 
  Play, 
  X, 
  type LucideIcon
} from "lucide-react";

import {
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../ui/table";
import { Button } from "../ui/button";
import { AppPagination } from "../ui/pagination";

type RowActionType =
  | 'apply'
  | 'delete'
  | 'download'
  | 'edit'
  | 'finish'
  | 'inactivate'
  | 'link'
  | 'list'
  | 'normal'
  | 'openClass'
  | 'start'
  | 'view'

export type RowAction<T> = {
  type: RowActionType;
  onClick: (row: T) => void;
  disabled?: boolean | ((row: T) => boolean);
  label?: string;
  className?: string;
  isActive?: (row: T) => boolean;
}

export type ColumnDef<T> = {
  id: keyof T;
  key?: string;
  header: React.ReactNode;
  width: string;
  className?: string;
  accessor?: (row: T) => unknown;
}

type TablePagination = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  totalElements?: number;
  size?: number;
};

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  rowKey: (row: T) => React.Key;
  actions: RowAction<T>[] | ((row: T) => RowAction<T>[]);
  emptyMessage: string;
  isFetching?: boolean;
  pagination?: TablePagination;
}

export function DataTable<T>({
  data, 
  columns,
  rowKey, 
  emptyMessage,
  actions,
  isFetching = false,
  pagination
}: Readonly<DataTableProps<T>>) {
  const formatCellValue = (value: unknown) => {
    if (value === true) return "Ativo";
    if (value === false) return "Inativo";
    if (value === null || value === undefined || value === "") return "-";
    return String(value);
  };

  const maxActions = typeof actions === "function" ? 1 : actions.length;

  const labeledActions = typeof actions === "function"
    ? 0
    : actions.filter((action) => action.label).length;

  if (data.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500 shadow-sm">
        {isFetching && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-md">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>Carregando dados...</span>
            </div>
          </div>
        )}
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        {isFetching && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-md">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>Carregando dados...</span>
            </div>
          </div>
        )}
        <Table className={cn("w-full min-w-[820px] table-fixed transition-opacity duration-200", isFetching && "opacity-50 pointer-events-none")}>
          <colgroup>
            {columns.map((column) => (
              <col  
                key={column.key ?? String(column.id)}
                style={{ width: column.width }}
              />
            ))}
            <col style={{ 
              width: labeledActions > 0 
                ? `${maxActions * (labeledActions > 1 ? 10 : 8)}%` 
                : (maxActions > 2 ? "18%" : "14%") 
            }} />
          </colgroup>

          <TableHeader className="bg-primary text-white">
            <TableRow className="hover:bg-transparent">
              {columns.map((column) => (
                <TableHead
                  key={column.key ?? String(column.id)}
                  className="px-6 py-3 text-left font-semibold text-white"
                >
                  {column.header}
                </TableHead>
              ))}

              {maxActions > 0 && (
                <TableHead className="px-6 py-3 text-center font-semibold text-white">
                  Ações
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((row) => (
              <TableRow key={rowKey(row)} className="border-slate-200">
                {columns.map((column) => (
                  <TableCell 
                    key={column.key ?? String(column.id)}
                    className={cn("px-6 py-4 text-slate-900 font-semibold truncate", column.className)}
                  >
                    {formatCellValue(
                      column.accessor ? column.accessor(row) : row[column.id as keyof T]
                    )}
                  </TableCell>
                ))}

                <TableCell className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                    {(typeof actions === "function" ? actions(row) : actions).map((action) => {
                      const isDisabled = typeof action.disabled === "function"
                          ? action.disabled(row)
                          : action.disabled ?? false;

                      const isActive = action.isActive ? action.isActive(row) : undefined;
                      return (
                        <ActionButton
                          key={`${action.type}-${action.label}`}
                          type={action.type}
                          onClick={() => action.onClick(row)}
                          disabled={isDisabled}
                          label={action.label}
                          className={action.className}
                          isActive={isActive}
                        />
                      );
                    })}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <AppPagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
          hasNext={pagination.hasNext}
          hasPrevious={pagination.hasPrevious}
          totalElements={pagination.totalElements}
          size={pagination.size}
        />
      )}
    </div>
  );
}

type ActionAppearance = {
  title: string;
  icon: LucideIcon;
  variant?: React.ComponentProps<typeof Button>["variant"];
  className?: string;
};

const ACTION_APPEARANCE: Record<RowActionType, (isActive: boolean) => ActionAppearance> = {
  apply: () => ({ title: "Aplicar", icon: NotebookPen }),
  download: () => ({ title: "Gerar Relatório", icon: Download }),
  delete: () => ({ title: "Excluir", icon: X, variant: "destructive" }),
  edit: () => ({ title: "Editar", icon: PencilLine }),
  finish: () => ({ title: "Finalizar", icon: BookOpenCheck }),

  link: (isLinked) =>
    isLinked
      ? { title: "Desvincular", icon: Link2Off, variant: "destructive" }
      : { title: "Vincular", icon: Link2, variant: "outline" },

  list: () => ({ title: "Listar", icon: List }),

  inactivate: (isActive) =>
    isActive
      ? { title: "Inativar", icon: X, variant: "destructive" }
      : { title: "Ativar", icon: Check, className: "bg-emerald-600 hover:bg-emerald-500 text-white border-transparent" },

  normal: () => ({ title: "", icon: AlarmSmoke }),
  openClass: () => ({ title: "Abrir Turma", icon: ClipboardList }),
  start: () => ({ title: "Iniciar", icon: Play }),
  view: () => ({ title: "Visualizar", icon: Eye, variant: "outline" })
}

type ActionButtonProps = Readonly<{
  type: RowActionType;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  isActive?: boolean;
}>;

function ActionButton({ 
  type, 
  onClick, 
  className, 
  label, 
  disabled = false,
  isActive
}: ActionButtonProps) {
  const { title, icon: Icon, variant, className: stateClass } = ACTION_APPEARANCE[type](isActive!);

  return (
    <Button
      title={title}
      aria-label={title}
      variant={variant}
      className={cn(label ? "w-30" : "w-14", stateClass, className)}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon className="size-4" />
      {label}
    </Button>
  );
}