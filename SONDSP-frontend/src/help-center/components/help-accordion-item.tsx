import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { HelpTopic } from '../help-center.types';
import { HelpStepList } from './help-step-list';
import { HelpAlertBox } from './help-alert-box';
import { HelpMaterialsList } from './help-materials-list';
import { cn } from '@/lib/utils';

interface HelpAccordionItemProps {
  topic: HelpTopic;
  isOpen?: boolean;
  onToggle?: () => void;
  defaultOpen?: boolean;
}

export function HelpAccordionItem({
  topic,
  isOpen: controlledIsOpen,
  onToggle,
  defaultOpen = false,
}: HelpAccordionItemProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    if (isControlled && onToggle) {
      onToggle();
    } else {
      setInternalIsOpen((prev) => !prev);
    }
  };

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-slate-200/90 bg-[#f0f2f5] transition-all duration-200',
        isOpen
          ? 'shadow-sm ring-1 ring-slate-300/80'
          : 'hover:bg-slate-200/60 shadow-2xs',
      )}
    >
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls={`help-content-${topic.id}`}
        id={`help-header-${topic.id}`}
        className="flex w-full items-center justify-between gap-4 px-7 py-5.5 text-left cursor-pointer select-none transition-colors lg:px-8 lg:py-6"
      >
        <span className="text-lg font-medium text-slate-900 tracking-tight lg:text-xl">
          {topic.title}
        </span>
        <ChevronDown
          className={cn(
            'size-6 shrink-0 text-slate-500 transition-transform duration-200 ease-in-out',
            isOpen && 'rotate-180 text-[#0a4b93]',
          )}
        />
      </button>

      {isOpen && (
        <div
          id={`help-content-${topic.id}`}
          role="region"
          aria-labelledby={`help-header-${topic.id}`}
          className="border-t border-slate-200/80 bg-[#f0f2f5] px-7 py-6 space-y-6 lg:px-8 lg:py-7"
        >
          {/* Passo a passo */}
          <HelpStepList steps={topic.steps} />

          {/* Alertas de Atenção/Importante */}
          {topic.alert && <HelpAlertBox alert={topic.alert} />}

          {/* Materiais de Apoio (se houver) */}
          {topic.materials && topic.materials.length > 0 && (
            <div className="border-t border-slate-200/80 pt-5">
              <HelpMaterialsList materials={topic.materials} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
