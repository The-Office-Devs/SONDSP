import { Mail } from 'lucide-react';
import { HELP_SUPPORT_CONTACT } from '../help-center.data';

export function HelpSupportFooter() {
  return (
    <footer className="mt-12 flex flex-col items-center justify-center gap-2 py-6 text-center">
      <p className="text-sm font-medium text-slate-600">
        {HELP_SUPPORT_CONTACT.label}
      </p>
      <a
        href={`mailto:${HELP_SUPPORT_CONTACT.email}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#0a4b93] transition-colors hover:underline"
      >
        <Mail className="size-4" />
        <span>{HELP_SUPPORT_CONTACT.email}</span>
      </a>
    </footer>
  );
}
