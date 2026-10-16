import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";

import { AUTHOR_ROLE_LABEL } from "@/lib/class-notes.utils";
import type { ClassNote } from "./class-notes.types";
import { 
  useCreateClassNote, 
  useDeleteClassNote, 
  useUpdateClassNote 
} from "./use-class-notes";

import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { TextAreaField } from "@/components/HookForm/fields/TextAreaField";
import { Button } from "@/components/ui/button";
import { ReadOnlyTextAreaField } from "@/components/ReadOnlyFields/ReadOnlyTextAreaField";

const classNoteSchema = z.object({
  text: z.string().trim().min(1, "Digite sua anotação")
});

type ClassNoteFormInput = z.input<typeof classNoteSchema>;
type ClassNoteFormData = z.infer<typeof classNoteSchema>;

interface ClassNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: number;
  note: ClassNote | null;
  currentUserId: number;
}

function getTitle(note: ClassNote | null, canEdit: boolean) {
  if (!note) return "Nova Anotação";
  return canEdit ? "Editar Anotação" : "Anotação";
}

export function ClassNoteDialog({
  open,
  onOpenChange,
  classId,
  note,
  currentUserId
}: Readonly<ClassNoteDialogProps>) {
  const canEdit = note === null || note.author.id === currentUserId;

  const form = useForm<ClassNoteFormInput, unknown, ClassNoteFormData>({
    resolver: zodResolver(classNoteSchema),
    mode: "onChange",
    defaultValues: { text: note?.text ?? "" }
  });

  const createNote = useCreateClassNote();
  const updateNote = useUpdateClassNote();
  const deleteNote = useDeleteClassNote();

  const isSaving = createNote.isPending || updateNote.isPending;
  const isDeleting = deleteNote.isPending;
  const isPending = isSaving || isDeleting;

  const { isValid, isDirty } = form.formState;
  const canSave = isValid && isDirty && !isPending;

  const closeDialog = () => onOpenChange(false);

  const onSubmit = ({ text }: ClassNoteFormData) => {
    if (note) {
      updateNote.mutate({ classId, id: note.id, text }, { onSuccess: closeDialog });
    } else {
      createNote.mutate({ classId, text }, { onSuccess: closeDialog });
    }
  };

  const handleDelete = () => {
    if (note) {
      deleteNote.mutate({ classId, id: note.id }, { onSuccess: closeDialog });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-md" 
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>{getTitle(note, canEdit)}</DialogTitle>
              <DialogDescription className="font-medium">
                {note && `${note.author.name} · ${AUTHOR_ROLE_LABEL[note.author.role]}`}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              {canEdit ? (
                <TextAreaField name="text" label="" placeholder="Digite sua anotação..." />
              ) : (
                <>
                  <ReadOnlyTextAreaField label="Anotação" value={note?.text} />
                  <p className="text-sm text-slate-500">
                    Somente o autor pode editar ou excluir esta anotação.
                  </p>
                </>
              )}
            </div>

            <DialogFooter className="flex w-full flex-col gap-2 sm:flex-row">
              {canEdit ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={closeDialog}
                    disabled={isPending}
                    className="flex-1 border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-700"
                  >
                    Cancelar
                  </Button>

                  {note && (
                    <Button
                      type="button"
                      size="lg"
                      onClick={handleDelete}
                      disabled={isPending}
                      className="flex-1 border-transparent bg-destructive text-white hover:bg-destructive/90"
                    >
                      {isDeleting ? "Excluindo..." : "Excluir"}
                    </Button>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={!canSave}
                    className="flex-1 border-transparent bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    {isSaving ? "Salvando..." : "Salvar"}
                  </Button>
                </>
              ) : (
                <Button type="button" variant="ghost" onClick={closeDialog}>
                  Fechar
                </Button>
              )}
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}