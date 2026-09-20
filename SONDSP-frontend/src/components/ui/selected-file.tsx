import { ImageIcon, X } from "lucide-react";
import { Button } from "./button";

interface SelectedFileProps {
  file: File;
  onRemove: () => void;
  icon?: React.ElementType;
}

export function SelectedFile({
  file,
  onRemove,
  icon: Icon = ImageIcon
}: Readonly<SelectedFileProps>) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-2 rounded-lg border border-input bg-white px-3 py-2.25">
      <div className="flex min-w-0 items-center gap-2 text-sm">
        <Icon className="size-4 shrink-0 text-muted-foreground" />
        <p className="truncate font-medium">{file.name}</p>
        <p className="shrink-0 whitespace-nowrap text-muted-foreground">
          {(file.size / 1024).toFixed(0)} KB
        </p>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="w-auto shrink-0"
        onClick={onRemove}
      >
        <X className="size-4 opacity-50" />
      </Button>
    </div>
  );
}