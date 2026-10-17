import { useState } from "react";
import { EllipsisVertical, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { ContentCard } from "@/components/Card/ContentCard";
import { Button } from "@/components/ui/button";
import { DeleteDialog } from "../Dialog/DeleteDialog";
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
  isDeleting = false
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
            className="flex flex-wrap gap-2 border-b border-neutral-300 px-2 py-3"
          >
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
        }
        isFetching={isFetching}
      >
        <div className={cn(scrollable && "max-h-[32rem] overflow-y-auto")}>
          <NotesList notes={notes} isLoading={isLoading} emptyMessage={emptyMessage} onDeleteClick={openDelete} />

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
}

function NotesList({ notes, isLoading, emptyMessage, onDeleteClick }: Readonly<NotesListProps>) {
  if (isLoading) {
    return <p className="py-6 text-center text-sm text-slate-500">Carregando anotações...</p>;
  }

  if (notes.length === 0) {
    return <p className="py-6 text-center text-sm text-slate-500"> {emptyMessage} </p>;
  }

  return (
    <ul className="space-y-3">
      {notes.map((note) => (
        <li key={note.id}>
          <NoteItem note={note} onDeleteClick={onDeleteClick} />
        </li>
      ))}
    </ul>
  );
}

interface NoteItemProps {
  note: NoteView;
  onDeleteClick: (note: NoteView) => void;
}

function NoteItem({ note, onDeleteClick }: Readonly<NoteItemProps>) {
  return (
    <article className="rounded-lg border border-neutral-300 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 pb-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className={cn("rounded-full px-2 text-sm font-semibold", note.authorClassName)}>
            {note.authorName}
          </span>
          <time dateTime={note.dateTime} className="text-sm text-slate-500">
            {note.date}
          </time>
          {note.badges && <div className="flex flex-wrap gap-1.5"> {note.badges} </div>}
        </div>

        <NoteActionsMenu note={note} onDeleteClick={onDeleteClick} />
      </div>

      <p className="mt-2 line-clamp-3 whitespace-pre-line text-sm text-slate-700"> {note.text} </p>

      {note.footer && <div className="mt-3 border-t border-neutral-200 pt-2"> {note.footer} </div>}
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