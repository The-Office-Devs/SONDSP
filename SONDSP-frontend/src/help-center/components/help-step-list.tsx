import { ClipboardList } from 'lucide-react';

interface HelpStepListProps {
  steps: string[];
}

function renderFormattedStep(text: string) {
  // Destaca termos entre aspas duplas (nomes de botões/menus) e parênteses informativos
  const parts = text.split(/(".*?"|\(.*?\))/g);

  return parts.map((part, index) => {
    if (part.startsWith('"') && part.endsWith('"')) {
      return (
        <span key={index} className="font-semibold text-slate-900">
          {part}
        </span>
      );
    }
    if (part.startsWith('(') && part.endsWith(')')) {
      return (
        <span key={index} className="text-slate-500 italic">
          {part}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export function HelpStepList({ steps }: HelpStepListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5 text-base font-semibold text-slate-900">
        <ClipboardList className="size-5 text-[#0a4b93]" />
        <span>Passo a passo</span>
      </div>

      <ol className="space-y-3.5">
        {steps.map((step, index) => (
          <li key={index} className="flex items-start gap-3.5">
            <span
              className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-900 shadow-2xs"
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <p className="pt-0.5 text-[0.975rem] leading-relaxed text-slate-700 lg:text-base">
              {renderFormattedStep(step)}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
