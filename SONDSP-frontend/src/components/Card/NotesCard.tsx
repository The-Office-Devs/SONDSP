import { useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  EllipsisVertical, 
  Eye, 
  Pencil, 
  Plus, 
  Trash2 
} from "lucide-react";
import { cn } from "@/lib/utils";

import { ContentCard } from "@/components/Card/ContentCard";
import { Button } from "@/components/ui/button";
import { DeleteDialog } from "../Dialog/DeleteDialog";
import { type AppPaginationProps } from "../ui/pagination";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "../ui/dropdown-menu";

export interface NoteFilter<T extends string> {
  id: T;
  label: string;
  activeClassName?: string;
  inactiveClassName?: string;
}

export interface NoteView {
  id: number;
  authorName: string;
  authorClassName: string;
  date: string;
  dateTime?: string;
  badges?: React.ReactNode;
  text: string;
  onClick: () => void;
  canEdit?: boolean;
  onDelete?: (options: { onSuccess: () => void }) => void;
  footer?: React.ReactNode;
}

interface NotesCardProps<T extends string> {
  notes: NoteView[];
  filters: NoteFilter<T>[];
  activeFilter: T;
  onFilterChange: (filter: T) => void;
  onNewNote: () => void;
  emptyMessage: string;
  isLoading?: boolean;
  isFetching?: boolean;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  scrollable?: boolean;
  isDeleting?: boolean;
  pagination?: AppPaginationProps;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

interface DeleteState {
  open: boolean;
  note: NoteView | null;
}

const DEFAULT_ACTIVE_CLASS = "bg-primary text-white";
const DEFAULT_INACTIVE_CLASS = "bg-white text-primary ring-1 ring-inset ring-primary/20";

export function NotesCard<T extends string>({
  notes,
  filters,
  activeFilter,
  onFilterChange,
  onNewNote,
  emptyMessage,
  isLoading = false,
  isFetching = false,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
  scrollable = true,
  isDeleting = false,
  pagination,
  className,
  headerClassName,
  contentClassName,
}: Readonly<NotesCardProps<T>>) {
  const [deleteState, setDeleteState] = useState<DeleteState>({ open: false, note: null });

  const handleFilterClick = (filter: T) =>
    onFilterChange(filter === activeFilter ? (filters[0]?.id ?? filter) : filter);

  const openDelete = (note: NoteView) => setDeleteState({ open: true, note });

  const closeDelete = () => setDeleteState((prev) => ({ ...prev, open: false }));

  const handleDeleteOpenChange = (open: boolean) => {
    if (!open && !isDeleting) closeDelete();
  };

  return (
    <>
      <ContentCard
        title="Anotações"
        className={className}
        headerClassName={cn(pagination ? "py-2.5 px-4" : "py-4 px-4", headerClassName)}
        contentClassName={cn(pagination ? "p-3" : "p-4", contentClassName)}
        headerRight={
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onNewNote}
            className="w-auto font-semibold text-primary"
          >
            <Plus className="size-4" />
            Nova Anotação
          </Button>
        }
        toolbar={
          <div
            role="group"
            aria-label="Filtrar anotações"
            className={cn(
              "flex flex-wrap items-center justify-between gap-2 border-b border-neutral-300",
              pagination ? "px-3 py-2 shrink-0" : "px-2 py-3"
            )}
          >
            <div className="flex flex-wrap items-center gap-2">
              {filters.map((filter) => {
                const isActive = filter.id === activeFilter;

                return (
                  <button
                    key={filter.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => handleFilterClick(filter.id)}
                    className={cn(
                      "cursor-pointer rounded-full px-3 py-1 text-sm font-medium transition",
                      isActive
                        ? (filter.activeClassName ?? DEFAULT_ACTIVE_CLASS)
                        : cn(filter.inactiveClassName ?? DEFAULT_INACTIVE_CLASS, "hover:brightness-95")
                    )}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>

            {pagination && (pagination.totalElements ?? 0) > 0 && (
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600 sm:ml-auto">
                <span>
                  <strong>
                    {pagination.page * (pagination.size ?? 3) + 1}–
                    {Math.min(
                      (pagination.page + 1) * (pagination.size ?? 3),
                      pagination.totalElements ?? 0
                    )}
                  </strong>{" "}
                  de <strong>{pagination.totalElements}</strong>
                </span>
                {pagination.totalPages > 1 && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label="Página anterior de anotações"
                      title="Página anterior"
                      disabled={!pagination.hasPrevious}
                      onClick={() => pagination.onPageChange(pagination.page - 1)}
                      className="flex size-7 items-center justify-center rounded-md border border-neutral-300 bg-white text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Próxima página de anotações"
                      title="Próxima página"
                      disabled={!pagination.hasNext}
                      onClick={() => pagination.onPageChange(pagination.page + 1)}
                      className="flex size-7 items-center justify-center rounded-md border border-neutral-300 bg-white text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronRight className="size-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        }
        isFetching={isFetching}
      >
        <div className={cn(scrollable && !pagination && "max-h-[32rem] overflow-y-auto pr-1")}>
          <NotesList 
            notes={notes} 
            isLoading={isLoading} 
            emptyMessage={emptyMessage} 
            onDeleteClick={openDelete} 
            isCompact={Boolean(pagination)}
          />

          {hasMore && onLoadMore && (
            <Button
              type="button"
              variant="outline"
              onClick={() => onLoadMore()}
              disabled={isLoadingMore}
              className="mt-3 w-full"
            >
              {isLoadingMore ? "Carregando..." : "Ver mais"}
            </Button>
          )}
        </div>
      </ContentCard>

      <DeleteDialog
        data={deleteState.note}
        title="Excluir anotação"
        itemName={
          deleteState.note
            ? `a anotação de ${deleteState.note.authorName} em ${deleteState.note.date}`
            : "esta anotação"
        }
        open={deleteState.open}
        isPending={isDeleting}
        onOpenChange={handleDeleteOpenChange}
        onConfirm={(note) => note.onDelete?.({ onSuccess: closeDelete })}
      />
    </>
  );
}

interface NotesListProps {
  notes: NoteView[];
  isLoading: boolean;
  emptyMessage: string;
  onDeleteClick: (note: NoteView) => void;
  isCompact?: boolean;
}

function NotesList({ notes, isLoading, emptyMessage, onDeleteClick, isCompact = false }: Readonly<NotesListProps>) {
  if (isLoading) {
    return <p className="py-6 text-center text-sm text-slate-500">Carregando anotações...</p>;
  }

  if (notes.length === 0) {
    return <p className="py-6 text-center text-sm text-slate-500"> {emptyMessage} </p>;
  }

  return (
    <ul className={cn(isCompact ? "space-y-2.5" : "space-y-3")}>
      {notes.map((note) => (
        <li key={note.id}>
          <NoteItem note={note} onDeleteClick={onDeleteClick} isCompact={isCompact} />
        </li>
      ))}
    </ul>
  );
}

interface NoteItemProps {
  note: NoteView;
  onDeleteClick: (note: NoteView) => void;
  isCompact?: boolean;
}

function NoteItem({ note, onDeleteClick, isCompact = false }: Readonly<NoteItemProps>) {
  return (
    <article className={cn("rounded-lg border border-neutral-300 bg-white", isCompact ? "p-3" : "p-4")}>
      <div className={cn("flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200", isCompact ? "pb-2" : "pb-3")}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className={cn("rounded-full px-2 text-xs sm:text-sm font-semibold", note.authorClassName)}>
            {note.authorName}
          </span>
          <time dateTime={note.dateTime} className="text-xs sm:text-sm text-slate-500">
            {note.date}
          </time>
          {note.badges && <div className="flex flex-wrap gap-1.5"> {note.badges} </div>}
        </div>

        <NoteActionsMenu note={note} onDeleteClick={onDeleteClick} />
      </div>

      <p className={cn("mt-1.5 whitespace-pre-line text-xs sm:text-sm text-slate-700", isCompact ? "line-clamp-2" : "line-clamp-3")}>
        {note.text}
      </p>

      {note.footer && <div className={cn("border-t border-neutral-200", isCompact ? "mt-2 pt-1.5" : "mt-3 pt-2")}> {note.footer} </div>}
    </article>
  );
}

function NoteActionsMenu({ note, onDeleteClick }: Readonly<NoteItemProps>) {
  const canEdit = note.canEdit ?? true;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Ações da anotação de ${note.authorName} em ${note.date}`}
          title="Ações"
          className="-my-1 flex size-4 cursor-pointer items-center justify-center rounded-md text-slate-500 outline-none transition hover:bg-slate-100 hover:text-[#002856] data-[state=open]:bg-slate-100 data-[state=open]:text-[#002856]"
        >
          <EllipsisVertical className="size-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuItem onSelect={note.onClick} className="cursor-pointer">
          {canEdit ? <Pencil /> : <Eye />}
          {canEdit ? "Editar" : "Visualizar"}
        </DropdownMenuItem>

        {note.onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => onDeleteClick(note)}
              className="cursor-pointer"
            >
              <Trash2 />
              Excluir
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}