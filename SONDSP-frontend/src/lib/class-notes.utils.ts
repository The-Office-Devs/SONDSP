import type { AuthorRole } from "@/classes/class-details-page/components/class-notes/class-notes.types";

export const AUTHOR_ROLE_LABEL: Record<AuthorRole, string> = {
  Coordenador: "Coordenador",
  Professor: "Professor",
  POA: "Professor Orientador de Área"
};

export const AUTHOR_ROLES = Object.keys(AUTHOR_ROLE_LABEL) as AuthorRole[];

export const AUTHOR_ROLE_STYLE: Record<AuthorRole, { soft: string; solid: string }> = {
  Coordenador: { soft: "bg-purple-100 text-purple-700", solid: "bg-purple-600 text-white" },
  Professor: { soft: "bg-blue-100 text-blue-700", solid: "bg-blue-600 text-white" },
  POA: { soft: "bg-green-100 text-green-700", solid: "bg-green-600 text-white" }
};

export function formatNoteDate(value: string) {
  const [year, month, day] = value.slice(0, 10).split("-");
  return year && month && day ? `${day}/${month}/${year}` : value;
}