import {
  useMutation, 
  useQueryClient } 
from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";

import { handleApiError } from "@/lib/utils";
import { createActivityService } from "./activities.service";
import type { ActivityFormData } from "./activity-schema";

const ACTIVITIES_QUERY_KEY = ['activities'] as const;

export function useCreateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ActivityFormData) => 
      createActivityService({
        name: data.name,
        strandId: data.strandId,
        schoolYear: data.schoolYear,
        bimester: data.bimester,
        activityModelFile:  data.activityModelFile
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY });
      toast.success('Modelo de Atividade cadastrado com sucesso!');
    },

    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error)
  });
}