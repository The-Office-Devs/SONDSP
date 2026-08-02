import { Check, Search, X } from "lucide-react";

import { Card as PrimitiveCard } from "@/components/ui/card";
import { Button } from "../ui/button";

interface CardProps {
  title: string;
  submitLabel: string;
  isSubmitDisabled: boolean;
  isEditMode?: boolean;
  onSubmit: React.SubmitEventHandler<HTMLFormElement>;
  onCancelEdit?: () => void;
  children: React.ReactNode;
}

export function Card({
  title,
  submitLabel,
  isSubmitDisabled = false,
  isEditMode = false,
  onSubmit,
  onCancelEdit,
  children 
}: Readonly<CardProps>) {
  return (
    <PrimitiveCard className="border-0 bg-[#efefef] px-5 py-5 shadow-sm">
      <div className="space-y-5">
        <h2 className="text-lg font-semibold text-slate-950">
          {title}
        </h2>

        <form
          onSubmit={onSubmit} 
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          {children}

          <div className="flex gap-2 items-end justify-end xl:col-start-3">
            {isEditMode && (
              <Button
                type="button"
                variant="outline"
                isRounded={true}
                onClick={onCancelEdit}
              >
                <X className="size-4" />
                Cancelar
              </Button>
            )}

            <Button
              type="submit"
              isRounded={true}
              disabled={isSubmitDisabled}
            >
              {(() => {
                const Icon = onCancelEdit ? Check : Search;
                return <Icon className="size-4" />;
              })()}
              {submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </PrimitiveCard>
  );
}