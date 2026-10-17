import type { NoteFilter } from "@/components/Card/NotesCard";
import { TAG_METADATA, type AnnotationTag } from "@/students/student-portfolio/student-portfolio.types";

export type AnnotationsFilter = "ALL" | AnnotationTag;

export const TAGS: AnnotationTag[] = ["CONSELHO", "PEDAGOGICA", "RESPONSAVEIS"];

export const TAG_OPTIONS: NoteFilter<AnnotationTag>[] = TAGS.map((tag) => ({
  id: tag,
  label: TAG_METADATA[tag].label,
  activeClassName: TAG_METADATA[tag].toggleActiveClass,
  inactiveClassName: TAG_METADATA[tag].filterClass
}));

export const FILTERS: NoteFilter<AnnotationsFilter>[] = [{ id: "ALL", label: "Todas" }, ...TAG_OPTIONS];

export function getAuthorClass(authorName: string) {
  return authorName.startsWith("CP") 
    ? "bg-[#f5e8fc] text-[#9333ea]" 
    : "bg-[#e0f2fe] text-[#0284c7]";
}