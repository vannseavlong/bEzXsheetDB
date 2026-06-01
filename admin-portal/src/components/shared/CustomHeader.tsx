import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CustomHeader({
  title,
  onBack,
  onSave,
  saveLabel = "Save",
  showSave = true,
  children,
}: {
  title?: any;
  onBack?: any;
  onSave?: any;
  saveLabel?: string;
  showSave?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-6">
      {/* Left: back + title */}
      <div className="flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        )}
        {title && (
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        )}
      </div>

      {/* Right: extra children + save */}
      <div className="flex items-center gap-2">
        {children}
        {showSave && onSave && (
          <Button onClick={onSave}>{saveLabel}</Button>
        )}
      </div>
    </div>
  );
}
