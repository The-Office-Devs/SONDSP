import type { AuthorRole, ClassNotesFilter } from "@/classes/class-details-page/components/class-notes/class-notes.types";
import type { NoteFilter } from "@/components/Card/NotesCard";

export const AUTHOR_ROLE_LABEL: Record<AuthorRole, string> = {
  Coordenador: "Coordenador",
  Professor: "Professor",
  POA: "Professor Orientador de Área"
};

export const AUTHOR_ROLES = Object.keys(AUTHOR_ROLE_LABEL) as AuthorRole[];

export type NotesFilter = "all" | "mine" | AuthorRole;

export const AUTHOR_ROLE_STYLE: Record<AuthorRole, { soft: string; solid: string }> = {
  Coordenador: { soft: "bg-purple-100 text-purple-700", solid: "bg-purple-600 text-white" },
  Professor: { soft: "bg-blue-100 text-blue-700", solid: "bg-blue-600 text-white" },
  POA: { soft: "bg-green-100 text-green-700", solid: "bg-green-600 text-white" }
};

export const FILTERS: NoteFilter<NotesFilter>[] = [
  { id: "all", label: "Todas" },
  {
    id: "mine",
    label: "Minhas anotações",
    activeClassName: "bg-secondary text-white",
    inactiveClassName: "bg-slate-200 text-secondary"
  },
  ...AUTHOR_ROLES.map((role): NoteFilter<NotesFilter> => ({
    id: role,
    label: AUTHOR_ROLE_LABEL[role],
    activeClassName: AUTHOR_ROLE_STYLE[role].solid,
    inactiveClassName: AUTHOR_ROLE_STYLE[role].soft
  }))
];

export function formatNoteDate(value: string) {
  const [year, month, day] = value.slice(0, 10).split("-");
  return year && month && day ? `${day}/${month}/${year}` : value;
}

export function toNotesQuery(filter: NotesFilter, currentUserId: number): ClassNotesFilter {
  if (filter === "all") return {};
  if (filter === "mine") return { authorId: currentUserId };
  return { authorRole: filter };
}

export function getEmptyMessage(filter: NotesFilter) {
  if (filter === "all") return "Nenhuma anotação registrada.";
  if (filter === "mine") return "Você ainda não registrou anotações.";
  return `Nenhuma anotação do ${AUTHOR_ROLE_LABEL[filter]}.`;
}