import { BookOpen, ChevronDown } from 'lucide-react';
import type { HelpModule } from '../help-center.types';
import { HelpAccordionItem } from './help-accordion-item';
import { cn } from '@/lib/utils';

interface HelpModuleSectionProps {
  module: HelpModule;
  isCollapsible: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

export function HelpModuleSection({
  module,
  isCollapsible,
  isExpanded,
  onToggle,
}: HelpModuleSectionProps) {
  const topicsCount = module.topics.length;
  const countLabel = topicsCount === 1 ? '1 tutorial' : `${topicsCount} tutoriais`;

  if (!isCollapsible) {
    // Quando um módulo específico está selecionado pelo filtro de pílulas, exibe diretamente seus tópicos
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-200/90 pb-3">
          <BookOpen className="size-6 text-[#0a4b93]" />
          <h2 className="text-xl font-bold tracking-tight text-slate-900 lg:text-2xl">
            {module.title}
          </h2>
          <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-0.5 text-xs font-semibold text-[#0a4b93]">
            {countLabel}
          </span>
        </div>

        <div className="space-y-3.5">
          {module.topics.map((topic) => (
            <HelpAccordionItem key={topic.id} topic={topic} />
          ))}
        </div>
      </section>
    );
  }

  // Quando está em "Todos os Módulos", o cabeçalho do módulo é expansível
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className={cn(
          'flex w-full items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer transition-colors select-none lg:px-8',
          isExpanded ? 'bg-slate-50/80 border-b border-slate-200' : 'hover:bg-slate-50/60',
        )}
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0a4b93]">
            <BookOpen className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900 lg:text-xl">
              {module.title}
            </h2>
            {module.description && (
              <p className="text-xs text-slate-500 lg:text-sm">
                {module.description}
              </p>
            )}
          </div>
          <span className="ml-2 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#0a4b93]">
            {countLabel}
          </span>
        </div>

        <ChevronDown
          className={cn(
            'size-6 shrink-0 text-slate-400 transition-transform duration-200 ease-in-out',
            isExpanded && 'rotate-180 text-[#0a4b93]',
          )}
        />
      </button>

      {isExpanded && (
        <div className="space-y-3.5 p-5 bg-[#f8fafc] lg:p-7">
          {module.topics.map((topic) => (
            <HelpAccordionItem key={topic.id} topic={topic} />
          ))}
        </div>
      )}
    </section>
  );
}
