import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  type AnnotationTag, 
  TAG_METADATA 
} from "../student-portfolio.types";

interface NewAnnotationDialogProps {
  open: boolean;
  studentName: string;
  onOpenChange: (open: boolean) => void;
  onSave: (text: string, tags: AnnotationTag[]) => void;
}

export function NewAnnotationDialog({
  open,
  studentName,
  onOpenChange,
  onSave
}: Readonly<NewAnnotationDialogProps>) {
  const [text, setText] = useState("");
  const [selectedTags, setSelectedTags] = useState<AnnotationTag[]>([]);

  const handleToggleTag = (tag: AnnotationTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleClose = () => {
    setText("");
    setSelectedTags([]);
    onOpenChange(false);
  };

  const handleSave = () => {
    if (!text.trim()) return;
    onSave(text.trim(), selectedTags);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg bg-white rounded-2xl p-6 shadow-xl">
        <DialogHeader className="border-b border-neutral-100 pb-3">
          <DialogTitle className="text-base font-bold text-slate-900">
            Nova Anotação
          </DialogTitle>
          <p className="text-xs text-slate-500 font-medium">
            Estudante: <span className="font-semibold text-slate-800">{studentName}</span>
          </p>
        </DialogHeader>

        <div className="space-y-4 py-2 w-full min-w-0">
          <div className="w-full min-w-0">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 256))}
              placeholder="Digite sua anotação..."
              maxLength={256}
              className="h-32 w-full max-w-full text-sm resize-none rounded-xl border border-neutral-300 p-3.5 focus:border-primary focus:ring-1 focus:ring-primary overflow-y-auto break-words [overflow-wrap:anywhere]"
            />
            <div className="flex justify-end mt-1 px-1">
              <span
                className={`text-[11px] font-medium transition-colors ${
                  text.length >= 256 ? "text-amber-600 font-semibold" : "text-slate-400"
                }`}
              >
                {text.length}/256 caracteres
              </span>
            </div>
          </div>

          {/* Seleção Opcional de Categorias */}
          <div>
            <span className="block text-xs font-semibold text-slate-700 mb-2">
              Categorias (opcional):
            </span>
            <div className="flex flex-wrap gap-2">
              {(["CONSELHO", "PEDAGOGICA", "RESPONSAVEIS"] as AnnotationTag[]).map((tagKey) => {
                const meta = TAG_METADATA[tagKey];
                const isSelected = selectedTags.includes(tagKey);

                return (
                  <button
                    key={tagKey}
                    type="button"
                    onClick={() => handleToggleTag(tagKey)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                      isSelected
                        ? meta.toggleActiveClass + " shadow-xs"
                        : meta.filterClass
                    }`}
                  >
                    {isSelected ? `✓ ${meta.label}` : `+ ${meta.label}`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-2 flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg bg-rose-100 px-5 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-200 cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!text.trim()}
            className="rounded-lg bg-emerald-100 px-5 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Salvar
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
