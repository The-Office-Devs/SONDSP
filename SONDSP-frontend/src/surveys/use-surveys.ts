import { 
  useMutation, 
  useQueryClient 
} from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";

import { handleApiError } from "@/lib/utils";
import { startSurveyService } from "./surveys.service";
import type { StartSurveyRequest } from "./surveys.types";

const SURVEYS_QUERY_KEY = ['surveys'] as const;

export function useStartSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StartSurveyRequest) => startSurveyService(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SURVEYS_QUERY_KEY });
      toast.success('Sondagem iniciada com sucesso.');
    },

    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error || 'Erro ao iniciar sondagem.')
  });
}