import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../ui/table";
import { AppPagination } from "../ui/pagination";
import { DataCardList } from "./DataCardList";
import { 
  EmptyState,
  formatCellValue,
  getCellValue,
  getColumnKey,
  getRowActions, 
  LoadingOverlay, 
  RowActionButton, 
  type DataTableProps 
} from "./DataTableShared";


export type { ColumnDef, DataTableProps, RowAction, TablePagination } from "./DataTableShared";

export function DataTable<T>(props: Readonly<DataTableProps<T>>) {
  const isDesktop = useMediaQuery('(min-width: 768px)');;

  return isDesktop ? <TableView {...props} /> : <DataCardList {...props} />;
}

function TableView<T>({
  data,
  columns,
  rowKey,
  emptyMessage,
  actions,
  isFetching = false,
  pagination
}: Readonly<DataTableProps<T>>) {
  const rowActionsList = data.map((row) => getRowActions(actions, row));
  const maxActions = Math.max(0, ...rowActionsList.map((rowActions) => rowActions.length));

  const labeledActions = Math.max(
    0,
    ...rowActionsList.map((rowActions) => rowActions.filter((action) => action.label).length)
  );

  if (data.length === 0) {
    return <EmptyState message={emptyMessage} isFetching={isFetching} />;
  }

  return (
    <div className="space-y-4">
      <div className="relative overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        {isFetching && <LoadingOverlay />}
        <Table className={cn("w-full min-w-[820px] table-fixed transition-opacity duration-200", isFetching && "opacity-50 pointer-events-none")}>
          <colgroup>
            {columns.map((column) => (
              <col
                key={getColumnKey(column)}
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
                  key={getColumnKey(column)}
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
            {data.map((row, index) => (
              <TableRow key={rowKey(row)} className="border-slate-200">
                {columns.map((column) => (
                  <TableCell
                    key={getColumnKey(column)}
                    className={cn("px-6 py-4 text-slate-900 font-semibold truncate", column.className)}
                  >
                    {formatCellValue(getCellValue(row, column))}
                  </TableCell>
                ))}

                <TableCell className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                    {rowActionsList[index].map((action) => (
                      <RowActionButton
                        key={`${action.type}-${action.label}`}
                        action={action}
                        row={row}
                      />
                    ))}
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