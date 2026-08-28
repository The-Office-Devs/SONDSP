import { 
  Check, 
  ChevronDown, 
  ChevronUp, 
  FilterX, 
  Search, 
  X 
} from "lucide-react";

import { Card as PrimitiveCard } from "@/components/ui/card";
import { Button } from "../ui/button";
import { Children, useState } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  title: string;
  submitLabel: string;
  isSubmitDisabled: boolean;
  isFilter?: boolean;
  isEditMode?: boolean;
  onSubmit: React.SubmitEventHandler<HTMLFormElement>;
  onReset?: () => void;
  collapsible?: boolean;
  children: React.ReactNode;
}

export function Card({
  title,
  submitLabel,
  isSubmitDisabled = false,
  isFilter = true,
  isEditMode = false,
  onSubmit,
  onReset,
  collapsible = false,
  children 
}: Readonly<CardProps>) {
  const [open, setOpen] = useState(true);
  const isOpen = !collapsible || open;

  const fieldCount = Children.count(children);
  const inlineAtMd = fieldCount % 2 !== 0;
  const inlineAtXl = fieldCount % 3 !== 0;

  const actionsClass = cn("flex gap-2 justify-end",
    inlineAtMd
      ? "md:mt-[2rem] md:self-start"
      : "md:col-start-2 md:mt-0 md:self-auto",
    inlineAtXl
      ? "xl:col-auto xl:mt-[2rem] xl:self-start"
      : "xl:col-start-3 xl:mt-0 xl:self-auto"
  );
  const ResetIcon = isFilter ? FilterX : X;
  const SubmitIcon = onReset ? Check : Search;

  const form = (
    <form
      onSubmit={onSubmit} 
      className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      {children}

      <div className={actionsClass}>
        {(isEditMode || isFilter) && (
          <Button
            type="button"
            variant="outline"
            isRounded
            onClick={onReset}
          >
            <ResetIcon className="size-4" />
            {isFilter ? "Limpar Campos" : "Cancelar"}
          </Button>
        )}

        <Button
          type="submit"
          isRounded
          disabled={isSubmitDisabled}
        >
          <SubmitIcon className="size-4" />
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