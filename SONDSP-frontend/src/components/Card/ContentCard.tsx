import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentCardProps {
  title: string;
  headerRight?: React.ReactNode;
  toolbar?: React.ReactNode;
  total?: number;
  emptyMessage?: string;
  isFetching?: boolean;
  legend?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  children: React.ReactNode;
}

export function ContentCard({
  title,
  headerRight,
  toolbar,
  total,
  emptyMessage,
  isFetching = false,
  legend,
  className,
  headerClassName,
  contentClassName,
  children
}: Readonly<ContentCardProps>) {
  const isEmpty = total === 0;
  
  return (
    <section 
      aria-label={title}
      aria-busy={isFetching}
      className={cn("relative w-full overflow-hidden rounded-xl border border-neutral-300 bg-neutral-100", className)}
    >
      {isFetching && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-md">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>Carregando dados...</span>
          </div>
        </div>
      )}

      <header className={cn("flex items-center justify-between bg-primary px-4 py-4 text-white", headerClassName)}>
        <h2 className="text-base font-semibold"> {title} </h2>
        {headerRight && <span className="text-sm font-medium"> {headerRight} </span>}
      </header>

      {toolbar}

      <div className={cn("p-4", contentClassName)}>
        {isEmpty ? (
          <p className="py-6 text-center text-sm text-slate-500"> {emptyMessage} </p>
        ) : (
          children
        )}

        {legend && !isEmpty && (
          <div className="mt-4 border-t border-neutral-300 pt-2"> {legend} </div>
        )}
      </div>
    </section>
  )
}