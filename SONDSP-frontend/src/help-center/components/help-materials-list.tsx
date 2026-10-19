import { Link2, Download, Video, FileText, Table } from 'lucide-react';
import type { HelpMaterial, HelpMaterialType } from '../help-center.types';

interface HelpMaterialsListProps {
  materials: HelpMaterial[];
}

function getMaterialIcon(type: HelpMaterialType) {
  switch (type) {
    case 'video':
      return Video;
    case 'spreadsheet':
      return Table;
    case 'pdf':
      return FileText;
    default:
      return Download;
  }
}

export function HelpMaterialsList({ materials }: HelpMaterialsListProps) {
  if (!materials || materials.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
        <Link2 className="size-4.5 text-[#0a4b93]" />
        <span>Materiais de apoio</span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {materials.map((mat, index) => {
          const Icon = getMaterialIcon(mat.type);
          const isLink = Boolean(mat.url);

          const content = (
            <>
              <Icon className="size-4 text-slate-600 group-hover:text-[#0a4b93] transition-colors" />
              <span className="text-sm font-medium text-slate-800 group-hover:text-slate-900">
                {mat.title}
              </span>
            </>
          );

          if (isLink) {
            return (
              <a
                key={index}
                href={mat.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 shadow-xs transition-all hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-sm"
              >
                {content}
              </a>
            );
          }

          return (
            <button
              key={index}
              type="button"
              className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 shadow-xs transition-all hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-sm cursor-pointer"
            >
              {content}
            </button>
          );
        })}
      </div>
    </div>
  );
}
