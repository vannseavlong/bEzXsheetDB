import { useEffect, useRef, useState } from "react";
import { Camera, Loader2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { toEmbeddableImageUrl } from "@/lib/drive-image";

type ProfilePickerProps = {
  imageUrl?: string
  onChange?: (file: File, url: string) => void
  onUpload?: (file: File) => Promise<string>
  className?: string
}

export function ProfilePicker({ imageUrl, onChange, onUpload, className }: ProfilePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(imageUrl ? toEmbeddableImageUrl(imageUrl) : null);
  const [uploading, setUploading] = useState(false);
  // URL we just produced via our own upload — re-receiving it as a prop shouldn't
  // clobber the still-good local blob preview with a Drive link that may not load yet.
  const lastUploadedUrl = useRef<string | null>(null);

  // Sync preview when imageUrl prop changes (e.g. edit page finishes loading)
  useEffect(() => {
    if (imageUrl && imageUrl !== lastUploadedUrl.current) setPreview(toEmbeddableImageUrl(imageUrl));
  }, [imageUrl]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    // Always show a local blob preview immediately — Drive URLs don't embed reliably in <img>
    const blobUrl = URL.createObjectURL(file);
    setPreview(blobUrl);

    if (onUpload) {
      setUploading(true);
      try {
        const remoteUrl = await onUpload(file);
        lastUploadedUrl.current = remoteUrl;
        onChange?.(file, remoteUrl);
      } finally {
        setUploading(false);
      }
    } else {
      onChange?.(file, blobUrl);
    }
  }

  return (
    <div className={cn("relative inline-block", className)}>
      <button
        type="button"
        onClick={() => !uploading && inputRef.current?.click()}
        className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-muted-foreground/30 bg-muted transition-colors hover:border-primary/50 hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Change profile picture"
        disabled={uploading}
      >
        {uploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        ) : preview ? (
          <img
            src={preview}
            alt="Profile"
            className="h-full w-full object-cover"
            onError={() => setPreview(null)}
          />
        ) : (
          <User className="h-10 w-10 text-muted-foreground" />
        )}

        {!uploading && (
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <Camera className="h-6 w-6 text-white" />
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={() => !uploading && inputRef.current?.click()}
        disabled={uploading}
        className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm ring-2 ring-background transition-colors hover:bg-primary/90 disabled:opacity-50"
        aria-label="Upload photo"
      >
        <Camera className="h-3.5 w-3.5" />
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
