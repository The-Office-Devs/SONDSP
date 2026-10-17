import { useState } from "react";
import { cn } from "@/lib/utils";

import { 
  AUTHOR_ROLE_LABEL, 
  AUTHOR_ROLE_STYLE, 
  FILTERS, 
  formatNoteDate, 
  getEmptyMessage, 
  toNotesQuery, 
  type NotesFilter 
} from "@/lib/class-notes.utils";
import { 
  useClassNotes, 
  useCreateClassNote, 
  useDeleteClassNote, 
  useUpdateClassNote 
} from "./use-class-notes";
import type { ClassNote } from "./class-notes.types";
import { useAuthStore } from "@/auth/auth.store";

import { NotesCard, type NoteView } from "@/components/Card/NotesCard";
import { NoteDialog } from "@/components/Dialog/NoteDialog";

interface ClassNotesCardProps {
  classId: number;
  isFetching?: boolean;
}

interface DialogState {
  open: boolean;
  note: ClassNote | null;
  key: number;
}

export function ClassNotesCard({ classId, isFetching }: Readonly<ClassNotesCardProps>) {
  const currentUser = useAuthStore((state) => state.user);
  const currentUserId = Number(currentUser?.id);

  const [filter, setFilter] = useState<NotesFilter>("all");
  const [dialog, setDialog] = useState<DialogState>({ open: false, note: null, key: 0 });

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useClassNotes(
    classId,
    toNotesQuery(filter, currentUserId)
  );

  const createNote = useCreateClassNote();
  const updateNote = useUpdateClassNote();
  const deleteNote = useDeleteClassNote();

  const openDialog = (note: ClassNote | null) =>
    setDialog((prev) => ({ open: true, note, key: prev.key + 1 }));

  const handleOpenChange = (open: boolean) => 
    setDialog((prev) => ({ ...prev, open }));

  const closeDialog = () => handleOpenChange(false);

  const canEdit = !dialog.note || dialog.note.author.id === currentUserId;

  const handleSave = (text: string) => {
    if (dialog.note) {
      updateNote.mutate({ classId, id: dialog.note.id, text }, { onSuccess: closeDialog });
      return;
    }
    createNote.mutate({ classId, text }, { onSuccess: closeDialog });
  };

  const handleDelete = () => {
    if (dialog.note) {
      deleteNote.mutate({ classId, id: dialog.note.id }, { onSuccess: closeDialog });
    } 
  };

  const notes: NoteView[] = (data?.pages.flatMap((page) => page.content) ?? []).map((note) => {
    const style = AUTHOR_ROLE_STYLE[note.author.role];

    return {
      id: note.id,
      authorName: note.author.name,
      authorClassName: style.soft,
      date: formatNoteDate(note.creationDate),
      dateTime: note.creationDate,
      badges: (
        <span className={cn("rounded-full px-2 py-0.5 text-xs", style.soft)}>
          {AUTHOR_ROLE_LABEL[note.author.role]}
        </span>
      ),
      text: note.text,
      onClick: () => openDialog(note)
    };
  });

  return (
    <>
      <NotesCard
        notes={notes}
        filters={FILTERS}
        activeFilter={filter}
        onFilterChange={setFilter}
        onNewNote={() => openDialog(null)}
        emptyMessage={getEmptyMessage(filter)}
        isLoading={isLoading}
        isFetching={isFetching}
        hasMore={hasNextPage}
        isLoadingMore={isFetchingNextPage}
        onLoadMore={fetchNextPage}
      />

      <NoteDialog
        key={dialog.key}
        open={dialog.open}
        onOpenChange={handleOpenChange}
        note={dialog.note}
        subtitle={dialog.note ? `${dialog.note.author.name} · ${AUTHOR_ROLE_LABEL[dialog.note.author.role]}` : undefined}
        canEdit={canEdit}
        onSave={handleSave}
        onDelete={handleDelete}
        isSaving={createNote.isPending || updateNote.isPending}
        isDeleting={deleteNote.isPending}
      />
    </>
  );
}