export type AuthorRole = "Coordenador" | "Professor" | "POA";

export interface NoteAuthor {
  id: number;
  name: string;
  role: AuthorRole;
}

export interface ClassNote {
  id: number;
  text: string;
  creationDate: string;
  author: NoteAuthor;
}

export interface ClassNotesFilter {
  authorRole?: AuthorRole;
  authorId?: number;
}

export interface CreateClassNoteRequest {
  classId: number;
  text: string;
}

export interface UpdateClassNoteRequest extends CreateClassNoteRequest {
  id: number;
}

export interface DeleteClassNoteRequest {
  classId: number;
  id: number;
}