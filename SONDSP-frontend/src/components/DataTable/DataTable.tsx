import { cn } from "@/lib/utils";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../ui/table";
import { Button } from "../ui/button";
import { AlarmSmoke, Link2, PencilLine, Trash2 } from "lucide-react";

export type ColumnDef<T> = {
  id: keyof T;
  header: React.ReactNode;
  width: string;
  className?: string;
}

export type RowAction<T> = {
  type: 'edit' | 'delete' | 'link' | 'normal';
  onClick: (row: T) => void;
  label?: string;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  rowKey: (row: T) => React.Key;
  actions: RowAction<T>[];
  emptyMessage: string;
}

export function DataTable<T>({
  data, 
  columns,
  rowKey, 
  emptyMessage,
  actions
}: Readonly<DataTableProps<T>>) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500 shadow-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <Table className="table-fixed">
        <colgroup>
          {columns.map((column) => (
            <col  
              key={String(column.id)}
              style={{ width: column.width }}
            />
          ))}
          <col style={{ width: actions.length > 2 ? "160px" : "120px" }} />
        </colgroup>

        <TableHeader className="bg-primary text-white">
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => (
              <TableHead
                key={String(column.id)}
                className="px-6 py-3 text-left font-semibold text-white"
              >
                {column.header} ↓
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
                  className={cn("px-6 py-4 text-slate-900 font-semibold", column.className)}
                >
                  {String(row[column.id] ?? "-")}
                </TableCell>
              ))}

              <TableCell className="px-4 py-3">
                <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                  {actions.map((action) => (
                    <ActionButton
                      key={`${action.type}-${action.label}`}
                      type={action.type}
                      onClick={() => action.onClick(row)}
                      label={action.label}
                      className={action.className}
                    />
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

type ActionButtonProps = Readonly<{
  type: "edit" | "delete" | "link" | "normal";
  onClick: () => void;
  className?: string;
  label?: string;
}>;

function ActionButton({ type, onClick, className, label }: ActionButtonProps) {
  const shared = cn("w-14", className);

  if (type === "edit") {
    return (
      <Button
        title="Editar"
        aria-label="Editar"
        className={cn(shared)}
        onClick={onClick}
      >
        <PencilLine className="size-4" />
        {label}
      </Button>
    );
  }

  if (type === "link") {
    return (
      <Button
        title="Vincular usuários"
        aria-label="Vincular usuários"
        variant="outline"
        className={cn(shared, "border-slate-400 text-slate-900 hover:bg-slate-100")}
        onClick={onClick}
      >
        <Link2 className="size-4" />
        {label}
      </Button>
    );
  }

  if (type === "delete") {
    return (
      <Button
        title="Excluir"
        aria-label="Excluir"
        variant="destructive"
        className={shared}
        onClick={onClick}
      >
        <Trash2 className="size-4" />
        {label}
      </Button>
    );
  }

  return (
    <Button
      className={cn(shared)}
      onClick={onClick}
    >
      <AlarmSmoke className="size-4" />
      {label}
    </Button>
  );
}