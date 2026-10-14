import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

import { AUTHOR_ROLE_LABEL, AUTHOR_ROLE_STYLE, AUTHOR_ROLES, formatNoteDate } from "@/lib/class-notes.utils";
import type { AuthorRole, ClassNote, ClassNotesFilter } from "./class-notes.types";
import { useClassNotes } from "./use-class-notes";
import { useAuthStore } from "@/auth/auth.store";

import { Button } from "@/components/ui/button";
import { ClassNoteDialog } from "./class-note-dialog";

interface ClassNotesCardProps {
  classId: number;
}

interface DialogState {
  open: boolean;
  note: ClassNote | null;
  key: number;
}

type NotesFilter = "all" | "mine" | AuthorRole;

function toNotesQuery(filter: NotesFilter, currentUserId: number): ClassNotesFilter {
  if (filter === "all") return {};
  if (filter === "mine") return { authorId: currentUserId };
  return { authorRole: filter };
}

function getEmptyMessage(filter: NotesFilter) {
  if (filter === "all") return "Nenhuma anotação registrada.";
  if (filter === "mine") return "Você ainda não registrou anotações.";
  return `Nenhuma anotação do ${AUTHOR_ROLE_LABEL[filter]}.`;
}

export function ClassNotesCard({ classId }: Readonly<ClassNotesCardProps>) {
  const currentUser = useAuthStore((state) => state.user);
  const currentUserId = Number(currentUser?.id);

  const [filter, setFilter] = useState<NotesFilter>("all");
  const [dialog, setDialog] = useState<DialogState>({ open: false, note: null, key: 0 });

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useClassNotes(
    classId,
    toNotesQuery(filter, currentUserId)
  );

  const notes = data?.pages.flatMap((page) => page.content) ?? [];

  const openDialog = (note: ClassNote | null) =>
    setDialog((prev) => ({ open: true, note, key: prev.key + 1 }));

  const handleOpenChange = (open: boolean) => 
    setDialog((prev) => ({ ...prev, open }));

  const changeFilter = (value: NotesFilter) =>
    setFilter((prev) => (prev === value ? "all" : value));

  return (
    <section
      aria-label="Anotações"
      className="w-full overflow-hidden rounded-xl border border-neutral-300 bg-neutral-100"
    >
      <header className="flex items-center justify-between bg-primary px-4 py-3 text-white">
        <h2 className="text-sm font-semibold">Anotações</h2>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => openDialog(null)}
          className="w-auto font-semibold text-primary"
        >
          <Plus className="size-4" />
          Nova Anotação
        </Button>
      </header>

      <div 
        role="group"
        aria-label="Filtrar anotações"
        className="flex flex-wrap gap-2 border-b border-neutral-300 px-2 py-3"
      >
        <FilterChip
          label="Todas"
          active={filter === "all"}
          activeClassName="bg-primary text-white"
          inactiveClassName="bg-white text-primary ring-1 ring-inset ring-primary/20"
          onClick={() => changeFilter("all")}
        />

        <FilterChip
          label="Minhas anotações"
          active={filter === "mine"}
          activeClassName="bg-secondary text-white"
          inactiveClassName="bg-slate-200 text-secondary"
          onClick={() => changeFilter("mine")}
        />

        {AUTHOR_ROLES.map((role) => (
          <FilterChip
            key={role}
            label={AUTHOR_ROLE_LABEL[role]}
            active={filter === role}
            activeClassName={AUTHOR_ROLE_STYLE[role].solid}
            inactiveClassName={AUTHOR_ROLE_STYLE[role].soft}
            onClick={() => changeFilter(role)}
          />
        ))}
      </div>

      <div className="max-h-[32rem] overflow-y-auto p-4">
        <NotesList
          notes={notes}
          isLoading={isLoading}
          emptyMessage={getEmptyMessage(filter)}
          onSelect={openDialog}
        />

        {hasNextPage && (
          <Button
            type="button"
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="mt-3 w-full"
          >
            {isFetchingNextPage ? "Carregando..." : "Ver mais"}
          </Button>
        )}
      </div>

      <ClassNoteDialog
        key={dialog.key}
        open={dialog.open}
        onOpenChange={handleOpenChange}
        classId={classId}
        note={dialog.note}
        currentUserId={currentUserId}
      />
    </section>
  );
}

interface FilterChipProps {
  label: string;
  active: boolean;
  activeClassName: string;
  inactiveClassName: string;
  onClick: () => void;
}

function FilterChip({
  label,
  active,
  activeClassName,
  inactiveClassName,
  onClick
}: Readonly<FilterChipProps>) {
  return (
    <button 
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1 text-sm font-medium transition",
        active ? activeClassName : cn(inactiveClassName, "hover:brightness-95")
      )}
    >
      {label}
    </button>
  );
}

interface NotesListProps {
  notes: ClassNote[];
  isLoading: boolean;
  emptyMessage: string;
  onSelect: (note: ClassNote) => void;
}

function NotesList({ notes, isLoading, emptyMessage, onSelect }: Readonly<NotesListProps>) {
  if (isLoading) {
    return <p className="py-6 text-center text-sm text-slate-500">Carregando anotações...</p>;
  }

  if (notes.length === 0) {
    return <p className="py-6 text-center text-sm text-slate-500">{emptyMessage}</p>;
  }

  return (
    <ul className="space-y-3">
      {notes.map((note) => (
        <li key={note.id}>
          <NoteItem note={note} onClick={() => onSelect(note)} />
        </li>
      ))}
    </ul>
  );
}

function NoteItem({ note, onClick }: Readonly<{ note: ClassNote; onClick: () => void }>) {
  const style = AUTHOR_ROLE_STYLE[note.author.role];

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-lg border border-neutral-300 bg-white p-3 text-left hover:border-slate-300 hover:bg-slate-50 cursor-pointer"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className={cn("rounded-full px-2 text-sm font-semibold", style.soft)}>
          {note.author.name}
        </span>
        <time dateTime={note.creationDate} className="text-sm text-slate-500">
          {formatNoteDate(note.creationDate)}
        </time>
        <span className={cn("ml-auto rounded-full px-2 py-0.5 text-xs", style.soft)}>
          {AUTHOR_ROLE_LABEL[note.author.role]}
        </span>
      </div>

      <p className="mt-2 line-clamp-3 whitespace-pre-line text-sm text-slate-700">
        {note.text}
      </p>
    </button>
  );
}