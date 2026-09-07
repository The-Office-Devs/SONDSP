import { 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  X 
} from "lucide-react";

import { Card as PrimitiveCard } from "@/components/ui/card";
import { Button } from "../ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  title: string;
  submitLabel: string;
  isSubmitDisabled: boolean;
  onSubmit: React.SubmitEventHandler<HTMLFormElement>;
  isFilter?: boolean;
  isEditMode?: boolean;
  onClearFields?: () => void;
  collapsible?: boolean;
  children: React.ReactNode;
}

export function Card({
  title,
  submitLabel,
  isSubmitDisabled = false,
  onSubmit,
  isFilter = true,
  isEditMode = false,
  onClearFields,
  collapsible = false,
  children 
}: Readonly<CardProps>) {
  const [open, setOpen] = useState(true);
  const isOpen = !collapsible || open;

  const form = (
    <form
      onSubmit={onSubmit} 
      className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      {children}

      <div className="flex gap-2 items-end justify-end xl:col-start-3">
        {isEditMode || isFilter && (
          <Button
            type="button"
            variant="outline"
            isRounded
            onClick={onClearFields}
          >
            {!isFilter ? <X className="size-4" /> : null}
            {isFilter ? "Limpar Campos" : "Cancelar"}
          </Button>
        )}

        <Button
          type="submit"
          isRounded
          disabled={isSubmitDisabled}
        >
          {(() => {
            const Icon = isFilter ? Search : Check;
            return <Icon className="size-4" />;
          })()}
          {submitLabel}
        </Button>
      </div>
    </form>
  );

  return (
    <PrimitiveCard className="border-0 bg-[#efefef] px-5 py-5 shadow-sm">
      <div className="space-y-5">
        {collapsible ? (
          <button 
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex w-full items-center justify-between cursor-pointer"
          >
            <h2 className="text-lg font-semibold text-slate-950">
              {title}
            </h2>
            {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </button>
        ) : (
          <h2 className="text-lg font-semibold text-slate-950">
            {title}
          </h2>
        )}

        {collapsible ? (
          <div className={cn(
            "grid transition-[grid-template-rows] duration-300 ease-out",
            isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          )}>
            <div className="overflow-hidden p-1"> {form} </div>
          </div>
        ) : (
          form
        )}
      </div>
    </PrimitiveCard>
  );
}