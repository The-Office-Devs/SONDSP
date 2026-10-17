import { useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextAreaField } from "@/components/HookForm/fields/TextAreaField";
import { ReadOnlyTextAreaField } from "@/components/ReadOnlyFields/ReadOnlyTextAreaField";
import type { NoteFilter } from "../Card/NotesCard";

export interface NoteDialogNote<T extends string> {
  text: string;
  tags?: T[];
}

interface NoteDialogProps<T extends string> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: NoteDialogNote<T> | null;
  subtitle?: React.ReactNode;
  canEdit?: boolean;
  tagOptions?: NoteFilter<T>[];
  onSave: (text: string, tags: T[]) => void;
  isSaving?: boolean;
}

interface NoteFormData { text: string }

const MAX_LENGTH = 256;

function buildNoteSchema() {
  const text = z.string().trim().min(1, "Digite sua anotação");
  return z.object({
    text: text.max(MAX_LENGTH, `Máximo de ${MAX_LENGTH} caracteres`)
  });
}

function hasSameTags<T>(a: T[], b: T[]) {
  return a.length === b.length && a.every((tag) => b.includes(tag));
}

function getTitle(isEditMode: boolean, canEdit: boolean) {
  if (!isEditMode) return "Nova Anotação";
  return canEdit ? "Editar Anotação" : "Anotação";
}

export function NoteDialog<T extends string>({
  open,
  onOpenChange,
  note,
  subtitle,
  canEdit = true,
  tagOptions = [],
  onSave,
  isSaving = false
}: Readonly<NoteDialogProps<T>>) {
  const form = useForm<NoteFormData>({
    resolver: zodResolver(buildNoteSchema()),
    mode: "onChange",
    defaultValues: { text: note?.text ?? "" }
  });

  const [selectedTags, setSelectedTags] = useState<T[]>(note?.tags ?? []);

  const text = useWatch({ control: form.control, name: "text" }) ?? "";

  const isEditMode = note !== null;

  const hasChanges =
    !note ||
    text.trim() !== note.text ||
    !hasSameTags(selectedTags, note.tags ?? []);

  const canSave = form.formState.isValid && hasChanges && !isSaving;

  const handleToggleTag = (tag: T) =>
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  const handleClose = () => onOpenChange(false);

  const onSubmit = (data: NoteFormData) => onSave(data.text, selectedTags);

  const readOnlyTags = tagOptions.filter((tag) => note?.tags?.includes(tag.id));
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md sm:max-w-lg rounded-2xl bg-white p-6 shadow-xl"
        onOpenAutoFocus={(event) => event.preventDefault()}
        {...(subtitle ? {} : { "aria-describedby": undefined })}
      >
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <DialogHeader className="border-b border-neutral-100 pb-3">
              <DialogTitle className="text-base font-bold text-slate-900">
                {getTitle(isEditMode, canEdit)}
              </DialogTitle>
              {subtitle && (
                <DialogDescription className="text-sm font-medium text-slate-500">{subtitle}</DialogDescription>
              )}
            </DialogHeader>

            <div className="w-full min-w-0 space-y-4">
              {canEdit ? (
                <div className="w-full min-w-0">
                  <TextAreaField name="text" label="" placeholder="Digite sua anotação..." />
                  <div className="mt-1 flex justify-end px-1">
                      <span
                        className={cn(
                          "text-xs font-medium transition-colors",
                          text.length >= MAX_LENGTH ? "font-semibold text-amber-600" : "text-slate-400"
                        )}
                      >
                        {text.length}/{MAX_LENGTH} caracteres
                      </span>
                    </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <ReadOnlyTextAreaField label="Anotação" value={note?.text} />
                  <p className="text-sm text-slate-500"> Somente o autor pode editar ou excluir esta anotação. </p>
                </div>
              )}

              {/* Categorias: selecionáveis na edição, só as marcadas na leitura */}
              {canEdit && tagOptions.length > 0 && (
                <div>
                  <span className="mb-2 block text-sm font-semibold text-slate-700"> Categorias (opcional): </span>
                  <div className="flex flex-wrap gap-2">
                    {tagOptions.map((tag) => {
                      const isSelected = selectedTags.includes(tag.id);

                      return (
                        <button
                          key={tag.id}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => handleToggleTag(tag.id)}
                          disabled={isSaving}
                          className={cn(
                            "cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition",
                            isSelected ? cn(tag.activeClassName, "shadow-xs") : tag.inactiveClassName
                          )}
                        >
                          {isSelected ? `✓ ${tag.label}` : `+ ${tag.label}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {!canEdit && readOnlyTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {readOnlyTags.map((tag) => (
                    <span key={tag.id} className={cn("rounded-full px-3 py-1 text-xs font-semibold", tag.activeClassName)}>
                      {tag.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter className="mt-2 flex flex-row items-center justify-end gap-3 pt-2">
              {canEdit ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={handleClose}
                    disabled={isSaving}
                    className="w-auto min-w-32 border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-700"
                  >
                    Cancelar
                  </Button>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={!canSave}
                    className="w-auto min-w-32 border-transparent bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    {isSaving ? "Salvando..." : "Salvar"}
                  </Button>
                </>
              ) : (
                <Button type="button" variant="ghost" onClick={handleClose} className="w-auto">
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