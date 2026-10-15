import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { createClassNoteService, deleteClassNoteService, listClassNotesService, updateClassNoteService } from "./class-notes.service";

import type { ClassNotesFilter } from "./class-notes.types";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { handleApiError } from "@/lib/utils";

export const CLASS_NOTES_QUERY_KEY = ["class-notes"];
const NOTES_PAGE_SIZE = 5;

export function useClassNotes(
  classId: number, 
  filter?: ClassNotesFilter
) {
  return useInfiniteQuery({
    queryKey: [...CLASS_NOTES_QUERY_KEY, classId, filter],
    queryFn: ({ pageParam }) =>
      listClassNotesService(classId, { ...filter, page: pageParam, size: NOTES_PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      allPages.length < lastPage.totalPages ? allPages.length : undefined
  });
}

export function useCreateClassNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClassNoteService,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASS_NOTES_QUERY_KEY });
      toast.success("Anotação cadastrada com sucesso.");
    },

    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error || 'Erro ao cadastrar anotação.')
  });
}

export function useUpdateClassNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateClassNoteService,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASS_NOTES_QUERY_KEY });
      toast.success("Anotação atualizada com sucesso.");
    },

    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error || 'Erro ao atualizar anotação.')
  });
}

export function useDeleteClassNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClassNoteService,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASS_NOTES_QUERY_KEY });
      toast.success("Anotação excluída com sucesso.");
    },

    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error || 'Erro ao excluir anotação.')
  });
}