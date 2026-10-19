import { AlertTriangle, Info } from 'lucide-react';
import type { HelpAlert } from '../help-center.types';
import { cn } from '@/lib/utils';

interface HelpAlertBoxProps {
  alert: HelpAlert;
}

export function HelpAlertBox({ alert }: HelpAlertBoxProps) {
  const isWarning = alert.type === 'warning';
  const Icon = isWarning ? AlertTriangle : Info;

  return (
    <div
      role="note"
      className={cn(
        'flex items-start gap-3 rounded-xl border p-3.5 text-sm transition-colors',
        isWarning
          ? 'border-amber-200 bg-amber-50 text-amber-950'
          : 'border-blue-200 bg-blue-50 text-blue-950',
      )}
    >
      <Icon
        className={cn(
          'mt-0.5 size-4.5 shrink-0',
          isWarning ? 'text-amber-600' : 'text-[#0a4b93]',
        )}
      />
      <div className="leading-relaxed">
        <strong className="font-semibold">
          {isWarning ? 'Atenção: ' : 'Importante: '}
        </strong>
        <span>{alert.message}</span>
      </div>
    </div>
  );
}
