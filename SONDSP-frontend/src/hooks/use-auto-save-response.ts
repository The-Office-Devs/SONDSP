import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { digitalSurveyQueryKey, useUpdateSurveyResponse } from "@/surveys/use-surveys";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

/**
 * Salva a resposta a cada alteração, mas com uma requisição por vez:
 * enquanto uma está em andamento, só a última resposta digitada fica guardada para ir em seguida.
 * Assim uma resposta antiga nunca chega no back depois de uma mais nova.
 */
export function useAutoSaveResponse(surveyId: number, enabled: boolean) {
  const queryClient = useQueryClient();
  const { mutateAsync: updateResponse } = useUpdateSurveyResponse();
  const [status, setStatus] = useState<SaveStatus>("idle");

  const pendingRef = useRef<string | null>(null);
  const isSavingRef = useRef(false);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const enabledRef = useRef(enabled);

  useEffect(() => {
    enabledRef.current = enabled;
    
    if (!enabled) {
      pendingRef.current = null;
      clearTimeout(retryTimerRef.current);
    }
  }, [enabled]);

  useEffect(() => () => clearTimeout(retryTimerRef.current), []);

  const flush = async () => {
    if (isSavingRef.current) return

    isSavingRef.current = true;
    
    while (pendingRef.current !== null && enabledRef.current) {
      const value = pendingRef.current;
      pendingRef.current = null;

      setStatus("saving");
      try {
        await updateResponse({ surveyId, response: value });
      } catch {
        // Guarda para tentar de novo, a não ser que já tenha uma resposta mais nova esperando
        if (pendingRef.current === null) pendingRef.current = value;
        isSavingRef.current = false;
        setStatus("error");
        // Confere se a falha foi porque o professor finalizou a sondagem
        queryClient.invalidateQueries({ queryKey: digitalSurveyQueryKey(surveyId) });
        retryTimerRef.current = setTimeout(flush, 3000);
        return;
      }
    }

    isSavingRef.current = false;
    if (enabledRef.current) setStatus("saved");
  };

  const save = (value: string) => {
    if (!enabledRef.current) return;
    
    pendingRef.current = value;
    clearTimeout(retryTimerRef.current);

    void flush();
  };

  return { save, status };
}