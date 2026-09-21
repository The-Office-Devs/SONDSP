import { 
  keepPreviousData, 
  useMutation, 
  useQuery, 
  useQueryClient 
} from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";

import { handleApiError } from "@/lib/utils";
import { 
  createStrandService, 
  changeStrandStatusService, 
  getStrandService, 
  listStrandsService
} from "../strands.service";
import type { StrandFilter } from "../strands.types";
import type { StrandFormData } from "./strand.schema";
import type { PaginationParams } from "@/api/types";

const STRANDS_QUERY_KEY = ['strand'] as const;

export function useStrands(filter?: StrandFilter & PaginationParams) {
  return useQuery({
    queryKey: [...STRANDS_QUERY_KEY, filter],
    queryFn: () => listStrandsService(filter),
    placeholderData: keepPreviousData,
  });
}

export function useStrand(id: number | null) {
  return useQuery({
    queryKey: ["strand", id],
    queryFn: () => getStrandService(id as number),
    enabled: !!id,
  });
}

export function useCreateStrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StrandFormData) => 
      createStrandService({
        name: data.name,
        subject: data.subject
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STRANDS_QUERY_KEY });
      toast.success('Eixo cadastrado com sucesso.');
    },

    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error || 'Erro ao cadastrar eixo.')
  });
}

export function useChangeStrandStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => 
      changeStrandStatusService(id),

    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: STRANDS_QUERY_KEY });
      toast.success(message || 'Status do eixo alterado com sucesso.');
    },

    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error || 'Erro ao alterar status do eixo.')
  });
}