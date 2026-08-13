import { cn } from "@/lib/utils";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../ui/table";
import { 
  AlarmSmoke, 
  Check, 
  Link2, 
  Link2Off, 
  Loader2, 
  PencilLine, 
  X 
} from "lucide-react";
import { Button } from "../ui/button";
import { AppPagination } from "../ui/pagination";

export type ColumnDef<T> = {
  id: keyof T;
  header: React.ReactNode;
  width: string;
  className?: string;
  accessor?: (row: T) => unknown;
}

export type RowAction<T> = {
  type: 'edit' | 'inactivate' | 'link' | 'normal';
  onClick: (row: T) => void;
  disabled?: boolean | ((row: T) => boolean);
  label?: string;
  className?: string;
  isActive?: (row: T) => boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  rowKey: (row: T) => React.Key;
  actions: RowAction<T>[];
  emptyMessage: string;
  isFetching?: boolean;
  pagination?: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    hasNext?: boolean;
    hasPrevious?: boolean;
    totalElements?: number;
    size?: number;
  };
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
                key={String(column.id)}
                style={{ width: column.width }}
              />
            ))}
            <col style={{ width: actions.length > 2 ? "18%" : "14%" }} />
          </colgroup>

          <TableHeader className="bg-primary text-white">
            <TableRow className="hover:bg-transparent">
              {columns.map((column) => (
                <TableHead
                  key={String(column.id)}
                  className="px-6 py-3 text-left font-semibold text-white"
                >
                  {column.header}
                </TableHead>
              ))}

              {actions.length > 0 && (
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
                    key={String(column.id)}
                    className={cn("px-6 py-4 text-slate-900 font-semibold truncate", column.className)}
                  >
                    {formatCellValue(
                      column.accessor ? column.accessor(row) : row[column.id as keyof T]
                    )}
                  </TableCell>
                ))}

                <TableCell className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                    {actions.map((action) => {
                      const isDisabled =
                        typeof action.disabled === "function"
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

type ActionButtonProps = Readonly<{
  type: "edit" | "inactivate" | "link" | "normal";
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
  const shared = cn("w-14", className);

  if (type === "edit") {
    return (
      <Button
        title="Editar"
        aria-label="Editar"
        className={cn(shared)}
        disabled={disabled}
        onClick={onClick}
      >
        <PencilLine className="size-4" />
        {label}
      </Button>
    );
  }

  if (type === "link") {
    const isLinked = isActive ?? false;
    return (
      <Button
        title={isLinked ? "Desvincular" : "Vincular"}
        aria-label={isLinked ? "Desvincular" : "Vincular"}
        variant={isLinked ? "destructive" : "outline"}
        className={cn(shared,)}
        disabled={disabled}
        onClick={onClick}
      >
        {isLinked ? <Link2Off className="size-4" /> : <Link2 className="size-4" />}
        {label}
      </Button>
    );
  }

  if (type === "inactivate") {
    const active = isActive ?? true;
    const isInactive = !active;
    return (
      <Button
        title={isInactive ? "Ativar" : "Inativar"}
        aria-label={isInactive ? "Ativar" : "Inativar"}
        variant={isInactive ? "default" : "destructive"}
        className={cn(
          shared,
          isInactive && "bg-emerald-600 hover:bg-emerald-500 text-white border-transparent"
        )}
        disabled={disabled}
        onClick={onClick}
      >
        {isInactive ? <Check className="size-4" /> : <X className="size-4" />}
        {label}
      </Button>
    );
  }

  return (
    <Button
      className={cn(shared)}
      disabled={disabled}
      onClick={onClick}
    >
      <AlarmSmoke className="size-4" />
      {label}
    </Button>
  );
}