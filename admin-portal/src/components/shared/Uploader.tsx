import { useRef, useState } from "react";
import { UploadCloud, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function Uploader({
  label,
  accept = "image/*",
  multiple = false,
  onFilesSelected,
  files = [],
  maxSize = "10MB",
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  function processFiles(fileList) {
    const newFiles = Array.from(fileList);
    if (!multiple && newFiles.length > 0) {
      onFilesSelected?.(newFiles.slice(0, 1));
    } else {
      onFilesSelected?.(newFiles);
    }
  }

  function handleChange(e) {
    if (e.target.files?.length) {
      processFiles(e.target.files);
    }
    e.target.value = "";
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) {
      processFiles(e.dataTransfer.files);
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  function removeFile(index) {
    const updated = files.filter((_, i) => i !== index);
    onFilesSelected?.(updated);
  }

  // Derive format hint from accept
  const formatHint = accept
    .split(",")
    .map((s) => s.trim().replace("image/", "").replace("*", "all images").toUpperCase())
    .join(", ");

  return (
    <div className="space-y-2">
      {label && (
        <p className="text-sm font-medium leading-none">{label}</p>
      )}

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors",
          dragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 bg-muted/30 hover:border-primary/50 hover:bg-muted/50"
        )}
      >
        <UploadCloud
          className={cn(
            "h-8 w-8 transition-colors",
            dragOver ? "text-primary" : "text-muted-foreground"
          )}
        />
        <div className="space-y-0.5">
          <p className="text-sm font-medium">
            Select a file or drag and drop here
          </p>
          <p className="text-xs text-muted-foreground">
            {formatHint} — max size {maxSize}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          Browse files
        </Button>
      </div>

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleChange}
      />

      {/* File list */}
      {files.length > 0 && (
        <ul className="space-y-1.5">
          {files.map((file, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2"
            >
              <div className="flex min-w-0 items-center gap-2">
                <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate text-sm font-medium">
                  {file.name}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatBytes(file.size)}
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => removeFile(idx)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
