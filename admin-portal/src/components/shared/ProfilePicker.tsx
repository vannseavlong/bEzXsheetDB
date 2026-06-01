import { useRef, useState } from "react";
import { Camera, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProfilePicker({ imageUrl, onChange, className }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(imageUrl ?? null);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    onChange?.(file, objectUrl);

    // Reset so same file can be re-selected
    e.target.value = "";
  }

  return (
    <div className={cn("relative inline-block", className)}>
      {/* Avatar circle */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-muted-foreground/30 bg-muted transition-colors hover:border-primary/50 hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Change profile picture"
      >
        {preview ? (
          <img
            src={preview}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        ) : (
          <User className="h-10 w-10 text-muted-foreground" />
        )}

        {/* Hover overlay */}
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <Camera className="h-6 w-6 text-white" />
        </span>
      </button>

      {/* Camera badge button */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm ring-2 ring-background transition-colors hover:bg-primary/90"
        aria-label="Upload photo"
      >
        <Camera className="h-3.5 w-3.5" />
      </button>

      {/* Hidden file input */}
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
