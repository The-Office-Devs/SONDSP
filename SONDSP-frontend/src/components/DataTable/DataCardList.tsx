import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { 
  EmptyState, 
  formatCellValue, 
  getCellValue, 
  getColumnKey, 
  getRowActions, 
  LoadingOverlay, 
  RowActionButton, 
  type ColumnDef, 
  type DataTableProps, 
  type RowAction,
  type TablePagination
} from "./DataTableShared";

export function DataCardList<T>({
  data,
  columns,
  rowKey,
  emptyMessage,
  actions,
  isFetching = false,
  pagination
}: Readonly<DataTableProps<T>>) {
  const listRef = useRef<HTMLUListElement>(null);

  if (data.length === 0) {
    return <EmptyState message={emptyMessage} isFetching={isFetching} />;
  }

  const titleColumn =
    columns.find((column) => column.mobile === "title") ??
    columns.find((column) => column.mobile === undefined);

  const handlePageChange = (nextPage: number) => {
    pagination?.onPageChange(nextPage);

    const list = listRef.current;
    if (list && list.getBoundingClientRect().top < 0) {
      list.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        {isFetching && <LoadingOverlay className="items-start rounded-xl pt-8" />}
        <ul
          ref={listRef}
          aria-busy={isFetching}
          className={cn(
            "grid scroll-mt-24 gap-3 transition-opacity duration-200 sm:grid-cols-2",
            isFetching && "pointer-events-none opacity-50"
          )}
        >
          {data.map((row) => (
            <DataCard
              key={rowKey(row)}
              row={row}
              columns={columns}
              titleColumn={titleColumn}
              actions={getRowActions(actions, row)}
            />
          ))}
        </ul>
      </div>

      {pagination && <CompactPagination pagination={pagination} onPageChange={handlePageChange} />}
    </div>
  );
}

interface DataCardProps<T> {
  row: T;
  columns: ColumnDef<T>[];
  titleColumn?: ColumnDef<T>;
  actions: RowAction<T>[];
}

function DataCard<T>({ row, columns, titleColumn, actions }: Readonly<DataCardProps<T>>) {
  const cells = columns
    .filter((column) => column !== titleColumn && column.mobile !== "hidden")
    .map((column) => ({ column, value: getCellValue(row, column) }));

  const isBadge = ({ column, value }: (typeof cells)[number]) =>
    column.mobile === "badge" || (column.mobile === undefined && typeof value === "boolean");

  const badges = cells.filter(isBadge);
  const fields = cells.filter((cell) => !isBadge(cell));
  const hasLabeledAction = actions.some((action) => action.label);

  return (
    <li className="flex min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        {titleColumn && (
          <p className="min-w-0 break-words text-base font-semibold text-slate-900">
            {formatCellValue(getCellValue(row, titleColumn))}
          </p>
        )}

        {badges.length > 0 && (
          <div className="ml-auto flex shrink-0 flex-wrap justify-end gap-1.5">
            {badges.map(({ column, value }) => (
              <StatusBadge key={getColumnKey(column)} value={value} />
            ))}
          </div>
        )}
      </div>

      {fields.length > 0 && (
        <dl className="mt-3 space-y-2 text-sm">
          {fields.map(({ column, value }) => (
            <div key={getColumnKey(column)} className="flex items-baseline justify-between gap-4">
              <dt className="shrink-0 text-slate-500">{column.header}</dt>
              <dd className="min-w-0 break-words text-right font-medium text-slate-900">
                {formatCellValue(value)}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {actions.length > 0 && (
        <div className="mt-auto pt-4">
          <div className={cn("flex flex-wrap gap-2 border-t border-neutral-200 pt-4", !hasLabeledAction && "justify-end")}>
            {actions.map((action) => (
              <RowActionButton
                key={`${action.type}-${action.label}`}
                action={action}
                row={row}
                className={action.label ? "w-auto flex-auto" : "w-14 shrink-0"}
              />
            ))}
          </div>
        </div>
      )}
    </li>
  );
}

function StatusBadge({ value }: Readonly<{ value: unknown }>) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-semibold",
        value === true && "bg-emerald-50 text-emerald-700",
        value !== true && "bg-slate-100 text-slate-600"
      )}
    >
      {formatCellValue(value)}
    </span>
  );
}

interface CompactPaginationProps {
  pagination: TablePagination;
  onPageChange: (page: number) => void;
}

function CompactPagination({ pagination, onPageChange }: Readonly<CompactPaginationProps>) {
  const { page, totalPages } = pagination;
  if (totalPages <= 1) return null;

  const canGoBack = pagination.hasPrevious ?? page > 0;
  const canGoForward = pagination.hasNext ?? page < totalPages - 1;

  return (
    <nav aria-label="Paginação" className="flex items-center gap-3 sm:justify-center">
      <Button
        variant="outline"
        className="w-auto min-w-0 flex-1 sm:w-40 sm:flex-none"
        disabled={!canGoBack}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="size-4" />
        Anterior
      </Button>

      <span className="shrink-0 text-sm text-slate-600" aria-live="polite">
        Página {page + 1} de {totalPages}
      </span>

      <Button
        variant="outline"
        className="w-auto min-w-0 flex-1 sm:w-40 sm:flex-none"
        disabled={!canGoForward}
        onClick={() => onPageChange(page + 1)}
      >
        Próxima
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  );
}