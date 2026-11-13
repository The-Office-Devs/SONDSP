import { useState } from "react";
import { useParams } from "react-router-dom";
import { CircleCheck, Delete, Loader2 } from "lucide-react";

import { useAutoSaveResponse, type SaveStatus } from "@/hooks/use-auto-save-response";
import { isSurveyLocked, useDigitalSurvey } from "../use-surveys";

import { AnswerKeyboard, type KeyboardType } from "./components/answer-keyboard";

const SAVE_STATUS_TEXT: Record<SaveStatus, string> = {
  idle: "",
  saving: "Salvando resposta...",
  saved: "Resposta salva",
  error: "Sem conexão. Tentando salvar de novo..."
};

export function DigitalSurveyPage() {
  const { id } = useParams();
  const surveyId = Number(id);
  const { data: survey, isLoading, isError } = useDigitalSurvey(surveyId);

  const [editedAnswer, setEditedAnswer] = useState<string | null>(null);

  const isLocked = isSurveyLocked(survey);
  const { save, status } = useAutoSaveResponse(surveyId, !!survey && !isLocked);

  if (isLoading) {
    return (
      <FullScreenMessage>
        <Loader2 className="size-8 animate-spin text-primary" />
      </FullScreenMessage>
    );
  }

  if (isError || !survey || !survey.isDigital) {
    return <FullScreenMessage>Esta sondagem não está disponível.</FullScreenMessage>;
  }

  // Resposta anterior ou Nova Resposta
  const answer = editedAnswer ?? survey.response ?? "";
  const displayedAnswer = isLocked ? (survey.response ?? "") : answer;
  const keyboardType: KeyboardType = survey.activity?.strand?.subject === "Matemática" ? "numbers" : "letters";

  const updateAnswer = (nextAnswer: string) => {
    if (isLocked) return;
    
    setEditedAnswer(nextAnswer);
    save(nextAnswer);
  };

  return (
    <main className="flex min-h-dvh flex-col bg-slate-50 p-4 sm:p-8">
      <header className="mx-auto mb-4 flex w-full max-w-4xl flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
        <span className="font-medium"> {survey.studentName} </span>
        <span className={status === "error" ? "text-amber-600" : undefined}>
          {isLocked ? "" : SAVE_STATUS_TEXT[status]}
        </span>
      </header>

      <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center gap-8 rounded-2xl border-2 border-slate-300 bg-white p-4 sm:p-10">
        {isLocked && (
          <p className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 p-3 text-center font-semibold text-emerald-700">
            <CircleCheck className="size-5 shrink-0" />
            Sondagem finalizada!
          </p>
        )}

        <div className="mx-auto flex w-full max-w-2xl items-end gap-3">
          <output
            className="min-h-14 flex-1 whitespace-pre-wrap break-words border-b-2 border-slate-400 pb-2 text-center text-3xl font-semibold tracking-wider text-slate-900 sm:text-4xl"
          >
            {displayedAnswer || <span className="text-slate-300"> RESPOSTA </span>}
          </output>

          <button
            type="button"
            onClick={() => updateAnswer(answer.slice(0, -1))}
            disabled={isLocked || !displayedAnswer}
            aria-label="Apagar"
            title="Apagar"
            className="flex size-14 shrink-0 touch-manipulation items-center justify-center rounded-xl border-2 border-slate-300 bg-white text-slate-700 transition active:scale-95 active:bg-slate-100 disabled:opacity-40 disabled:active:scale-100"
          >
            <Delete className="size-8" />
          </button>
        </div>

        <AnswerKeyboard
          type={keyboardType}
          disabled={isLocked}
          onKeyPress={(key) => updateAnswer(answer + key)}
        />
      </section>
    </main>
  );
}

function FullScreenMessage({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-50 p-6 text-center text-lg text-slate-600">
      {children}
    </main>
  );
}