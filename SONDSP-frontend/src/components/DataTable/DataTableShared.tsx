import { cn } from "@/lib/utils";

import { 
    AlarmSmoke,
  BookOpenCheck, 
  Check, 
  CirclePlus, 
  ClipboardList, 
  Download, 
  Eye, 
  FilePen, 
  IdCardLanyard, 
  Link2, 
  Link2Off, 
  List, 
  Loader2, 
  NotebookPen,
  PencilLine, 
  SquareCheckBig, 
  X, 
  type LucideIcon 
} from "lucide-react";
import { Button } from "../ui/button";

export type RowActionType =
  | 'apply'
  | 'create'
  | 'delete'
  | 'download'
  | 'edit'
  | 'finish'
  | 'finishDigitalSurvey'
  | 'inactivate'
  | 'link'
  | 'list'
  | 'normal'
  | 'openClass'
  | 'startDigitalSurvey'
  | 'view'
  | 'viewPortfolio'

export type RowAction<T> = {
  type: RowActionType;
  onClick: (row: T) => void;
  disabled?: boolean | ((row: T) => boolean);
  label?: string;
  className?: string;
  isActive?: (row: T) => boolean;
}

export type ColumnDef<T> = {
  id: keyof T | (string & {});
  key?: string;
  header: React.ReactNode;
  width: string;
  className?: string;
  accessor?: (row: T) => unknown;
  mobile?: "title" | "badge" | "hidden";
}

export type TablePagination = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  totalElements?: number;
  size?: number;
};

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  rowKey: (row: T) => React.Key;
  actions: RowAction<T>[] | ((row: T) => RowAction<T>[]);
  emptyMessage: string;
  isFetching?: boolean;
  pagination?: TablePagination;
}

export const getColumnKey = <T,>(column: ColumnDef<T>) => column.key ?? String(column.id);

export const getCellValue = <T,>(row: T, column: ColumnDef<T>) =>
  column.accessor ? column.accessor(row) : row[column.id as keyof T];

export const formatCellValue = (value: unknown) => {
  if (value === true) return "Ativo";
  if (value === false) return "Inativo";
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
};

export const getRowActions = <T,>(actions: DataTableProps<T>["actions"], row: T) =>
  typeof actions === "function" ? actions(row) : actions;

export function LoadingOverlay({ className }: Readonly<{ className?: string }>) {
  return (
    <div className={cn("absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[1px]", className)}>
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-md">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span>Carregando dados...</span>
      </div>
    </div>
  );
}

export function EmptyState({ message, isFetching }: Readonly<{ message: string; isFetching: boolean }>) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500 shadow-sm">
      {isFetching && <LoadingOverlay />}
      {message}
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
  create: () => ({ title: "Criar", icon: CirclePlus }),
  download: () => ({ title: "Gerar Relatório", icon: Download }),
  delete: () => ({ title: "Excluir", icon: X, variant: "destructive" }),
  edit: () => ({ title: "Editar", icon: PencilLine }),
  finish: () => ({ title: "Finalizar", icon: BookOpenCheck }),
  finishDigitalSurvey: () => ({ title: "Finalizar Sondagem Digital", icon: SquareCheckBig }),

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
  startDigitalSurvey: () => ({ title: "Iniciar Sondagem Digital", icon: FilePen }),
  view: () => ({ title: "Visualizar", icon: Eye, variant: "outline" }),
  viewPortfolio: () => ({ title: "Ver Portfólio", icon: IdCardLanyard })
}

type RowActionButtonProps<T> = Readonly<{
  action: RowAction<T>;
  row: T;
  className?: string;
}>;

export function RowActionButton<T>({ action, row, className }: RowActionButtonProps<T>) {
  const isDisabled = typeof action.disabled === "function"
    ? action.disabled(row)
    : action.disabled ?? false;

  const isActive = action.isActive ? action.isActive(row) : false;
  const { title, icon: Icon, variant, className: stateClass } = ACTION_APPEARANCE[action.type](isActive);

  return (
    <Button
      title={title}
      aria-label={title}
      variant={variant}
      className={cn(action.label ? "w-30" : "w-14", stateClass, className, action.className)}
      disabled={isDisabled}
      onClick={() => action.onClick(row)}
    >
      <Icon className="size-4" />
      {action.label}
    </Button>
  );
}