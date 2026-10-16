import { Hash, CreditCard, BookOpen } from "lucide-react";
import type { StudentPortfolioDTO } from "../student-portfolio.types";
import { getEnrollmentStatusBadge } from "@/lib/survey-utils";

interface StudentProfileCardProps {
  student: StudentPortfolioDTO;
}

export function StudentProfileCard({ student }: Readonly<StudentProfileCardProps>) {
  return (
    <section 
      aria-label="Perfil do Estudante"
      className="overflow-hidden rounded-xl border border-neutral-300 bg-white shadow-xs"
    >
      <header className="bg-primary px-6 py-4 text-white">
        <h2 className="text-base font-bold tracking-wide">Perfil do Estudante</h2>
      </header>

      <div className="p-6">
        {/* Cabeçalho do Aluno */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-4">
            <div 
              aria-label={`Iniciais de ${student.name}`}
              className="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-slate-800 bg-slate-100 text-xl font-bold text-slate-800"
            >
              {student.initials}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold text-slate-900">
                {student.name}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="rounded bg-[#e0ecf8] px-2 py-0.5 text-xs font-semibold text-[#1e40af]">
                  {student.currentClass}
                </span>
                <span className="text-xs text-slate-500">
                  Matrícula: {student.registration}
                </span>
              </div>
            </div>
          </div>

          <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
            <span className="size-2 rounded-full bg-emerald-500" aria-hidden="true" />
            {student.status === "ATIVO" ? "Ativo" : "Inativo"}
          </span>
        </div>

        {/* Divisor */}
        <hr className="my-4.5 border-neutral-200" />

        {/* Dados Cadastrais */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[#0284c7]">
              <Hash className="size-4" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Nº Chamada
              </span>
            </div>
            <p className="mt-1 text-sm font-bold text-slate-800">
              {student.rowNumber ? `Nº ${student.rowNumber}` : "Não informado"}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-[#0284c7]">
              <CreditCard className="size-4" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Matrícula
              </span>
            </div>
            <p className="mt-1 font-mono text-sm font-bold text-slate-800">
              {student.registration}
            </p>
          </div>
        </div>

        {/* Divisor */}
        <hr className="my-4.5 border-neutral-200" />

        {/* Histórico Escolar */}
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
            <BookOpen className="size-4 text-slate-500" />
            <span>HISTÓRICO</span>
          </div>

          <ul className="mt-3.5 space-y-2.5">
            {student.enrollmentHistory.map((item, index) => {
              const badge = getEnrollmentStatusBadge(item.status);
              return (
                <li 
                  key={`${item.year}-${item.schoolClass}-${index}`}
                  className="flex items-center justify-between text-xs sm:text-sm"
                >
                  <span className="text-slate-700">
                    <strong className="font-bold text-slate-900">{item.year}</strong> • {item.schoolClass}
                  </span>

                  <span className={`rounded px-2.5 py-0.5 text-xs ${badge.className}`}>
                    {item.statusLabel || badge.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
