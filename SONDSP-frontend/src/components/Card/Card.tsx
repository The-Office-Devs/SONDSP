import { Children, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
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
  collapsible = true,
  children 
}: Readonly<CardProps>) {
  const [open, setOpen] = useState(true);
  const isOpen = !collapsible || open;
  const contentRef = useRef<HTMLDivElement>(null);

  const [wasEditMode, setWasEditMode] = useState(isEditMode);
  if (isEditMode !== wasEditMode) {
    setWasEditMode(isEditMode);
    if (isEditMode) setOpen(true);
  }

  useEffect(() => {
    if (isEditMode) {
      contentRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, [isEditMode]);

  const fieldCount = Children.count(children);
  const inlineAtMd = fieldCount % 2 !== 0;
  const inlineAtXl = fieldCount % 3 !== 0;

  const actionsClass = cn(
    "flex flex-col-reverse gap-2 md:flex-row md:justify-end md:col-start-2 xl:col-start-3",
    inlineAtMd 
      ? "md:mt-[2rem] md:self-start" 
      : "md:mt-0 md:self-auto",
    inlineAtXl 
      ? "xl:mt-[2rem] xl:self-start" 
      : "xl:mt-0 xl:self-auto"
  );
  const ResetIcon = isFilter ? FilterX : X;
  const SubmitIcon = isFilter ? Search : Check;

  const form = (
    <form
      onSubmit={onSubmit} 
      className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      {children}

      <div className={actionsClass}>
        {(isEditMode || isFilter) && (
          <Button
            type="button"
            variant="outline"
            isRounded
            className="w-full md:w-auto"
            onClick={onReset}
          >
            <ResetIcon className="size-4" />
            {isFilter ? "Limpar Campos" : "Cancelar"}
          </Button>
        )}

        <Button
          type="submit"
          isRounded
          className="w-full md:w-auto"
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
      <div ref={contentRef} className="scroll-mt-24 space-y-5">
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