import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  type AnnotationTag,
  type StudentAnnotation,
  TAG_METADATA
} from "../student-portfolio.types";
import { 
  useCreateStudentAnnotation, 
  useDeleteStudentAnnotation, 
  useStudentAnnotations, 
  useUpdateStudentAnnotation, 
  useUpdateStudentAnnotationTags 
} from "../use-student-portfolio";
import { 
  FILTERS, 
  getAuthorClass,
  TAG_OPTIONS, 
  TAGS, 
  type AnnotationsFilter 
} from "@/lib/student-annotations-utils";

import { buildPaginationProps } from "@/api/types";
import { NotesCard, type NoteView } from "@/components/Card/NotesCard";
import { NoteDialog } from "@/components/Dialog/NoteDialog";

const PAGE_SIZE = 3;

interface StudentAnnotationsCardProps {
  studentId: number;
  studentName: string;
}

interface DialogState {
  open: boolean;
  annotation: StudentAnnotation | null;
  key: number;
}

export function StudentAnnotationsCard({ studentId, studentName }: Readonly<StudentAnnotationsCardProps>) {
  const [filter, setFilter] = useState<AnnotationsFilter>("ALL");
  const [page, setPage] = useState(0);
  const [dialog, setDialog] = useState<DialogState>({ open: false, annotation: null, key: 0 });

  const tagParam = filter === "ALL" ? undefined : filter;
  const { data: annotationsPage, isLoading, isFetching } = useStudentAnnotations(
    studentId,
    tagParam,
    { page, size: PAGE_SIZE }
  );
  const { mutate: createAnnotation, isPending: isCreating } = useCreateStudentAnnotation(studentId);
  const { mutate: updateAnnotation, isPending: isUpdating } = useUpdateStudentAnnotation(studentId);
  const { mutate: deleteAnnotation, isPending: isDeleting } = useDeleteStudentAnnotation(studentId);
  const { mutate: updateTags } = useUpdateStudentAnnotationTags(studentId);

  const openDialog = (annotation: StudentAnnotation | null) =>
    setDialog((prev) => ({ open: true, annotation, key: prev.key + 1 }));

  const handleOpenChange = (open: boolean) =>
    setDialog((prev) => ({ ...prev, open }));

  const closeDialog = () => handleOpenChange(false);

  const handleSave = (text: string, tags: AnnotationTag[]) => {
    if (dialog.annotation) {
      updateAnnotation(
        { annotationId: dialog.annotation.id, data: { text, tags } },
        { onSuccess: closeDialog }
      );
      return;
    }
    createAnnotation({ text, tags }, { onSuccess: closeDialog });
  };

  const handleToggleTag = (annotation: StudentAnnotation, tag: AnnotationTag) => {
    const tags = annotation.tags.includes(tag)
      ? annotation.tags.filter((t) => t !== tag)
      : [...annotation.tags, tag];

    updateTags({ annotationId: annotation.id, tags });
  };

  const handleFilterChange = (newFilter: AnnotationsFilter) => {
    setFilter(newFilter);
    setPage(0);
  };

  {/* Anotações */}
  const notes: NoteView[] = (annotationsPage?.content ?? [])
    .map((annotation) => ({
      id: annotation.id,
      authorName: annotation.authorName,
      authorClassName: getAuthorClass(annotation.authorName),
      date: annotation.date,
      badges: annotation.tags.length > 0
        ? annotation.tags.map((tag) => (
            <span key={tag} className={cn("rounded-full px-2 py-0.5 text-xs", TAG_METADATA[tag].chipClass)}>
              {TAG_METADATA[tag].label}
            </span>
          ))
        : undefined,
      text: annotation.text,
      onClick: () => openDialog(annotation),
      canEdit: annotation.canEdit,
      onDelete: annotation.canEdit
        ? (options) => deleteAnnotation(annotation.id, options)
        : undefined,
      footer: <TagToggles annotation={annotation} onToggle={handleToggleTag} />
    }));

  return (
    <>
      <NotesCard
        notes={notes}
        filters={FILTERS}
        activeFilter={filter}
        onFilterChange={handleFilterChange}
        onNewNote={() => openDialog(null)}
        emptyMessage={
          filter === "ALL"
            ? "Nenhuma anotação registrada."
            : "Nenhuma anotação encontrada para a categoria selecionada."
        }
        isLoading={isLoading}
        isFetching={isFetching}
        isDeleting={isDeleting}
        pagination={annotationsPage ? buildPaginationProps(annotationsPage, setPage) : undefined}
      />

      <NoteDialog
        key={dialog.key}
        open={dialog.open}
        onOpenChange={handleOpenChange}
        note={dialog.annotation}
        subtitle={`Estudante: ${studentName}`}
        canEdit={!dialog.annotation || dialog.annotation.canEdit}
        tagOptions={TAG_OPTIONS}
        onSave={handleSave}
        isSaving={isCreating || isUpdating}
      />
    </>
  );
}

interface TagTogglesProps {
  annotation: StudentAnnotation;
  onToggle: (annotation: StudentAnnotation, tag: AnnotationTag) => void;
}

{/* Toggles Interativos Rápidos */}
function TagToggles({ annotation, onToggle }: Readonly<TagTogglesProps>) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {TAGS.map((tag) => {
        const meta = TAG_METADATA[tag];
        const isMarked = annotation.tags.includes(tag);

        return (
          <button
            key={tag}
            type="button"
            aria-pressed={isMarked}
            onClick={() => onToggle(annotation, tag)}
            title={isMarked ? `Remover categoria ${meta.label}` : `Marcar como ${meta.label}`}
            className={cn(
              "flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition",
              isMarked ? meta.toggleActiveClass : meta.toggleInactiveClass
            )}
          >
            {isMarked ? (
              <>
                <Check className="size-3 stroke-[2.5]" />
                <span>{meta.label}</span>
              </>
            ) : (
              <span>Marcar {meta.label}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}