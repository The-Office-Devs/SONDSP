import * as React from "react";
import { Upload } from "lucide-react";

import { cn } from "@/lib/utils";

function matchesAccept(file: File, accept?: string) {
  if (!accept) return true;

  const tokens = accept
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);

  if (tokens.length === 0) return true;

  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  return tokens.some((token) => {
    if (token.startsWith(".")) return name.endsWith(token);
    if (token.endsWith("/*")) return type.startsWith(token.slice(0, -1));
    return type === token;
  });
}

interface FileDropzoneProps {
  onFileSelected: (file: File) => void;
  onReject?: (file: File) => void;
  accept?: string;
  className?: string;
};

function FileDropzone({
  onFileSelected,
  onReject,
  accept,
  className,
}: Readonly<FileDropzoneProps>) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const openFilePicker = () => { inputRef.current?.click() };

  const handleFile = (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) return;

    if (!matchesAccept(file, accept)) {
      onReject?.(file);
      return;
    }

    onFileSelected(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  return (
    <div
      data-slot="file-dropzone"
      data-dragging={isDragging}
      role="button"
      onClick={openFilePicker}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        "flex min-h-28 w-full cursor-pointer flex-col justify-center gap-2 rounded-lg border border-dashed border-input bg-white",
        "hover:bg-muted/40 data-[dragging=true]:border-ring data-[dragging=true]:bg-muted/60",
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) => { handleFile(event.target.files) }}
      />

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Upload className="size-4" />
        <span>
          Arraste um arquivo aqui ou{" "}
          <span className="font-medium text-foreground underline underline-offset-2">
            clique
          </span>
        </span>
      </div>
    </div>
  );
}

export { FileDropzone };