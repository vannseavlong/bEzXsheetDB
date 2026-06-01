import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function getInitials(name) {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function ColumnUserInfo({ name, subtitle, imageUrl, initials }) {
  const fallback = initials
    ? String(initials).slice(0, 2).toUpperCase()
    : getInitials(name);

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8 shrink-0">
        {imageUrl && <AvatarImage src={imageUrl} alt={name ?? "user"} />}
        <AvatarFallback className="text-xs font-medium">
          {fallback}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium leading-tight">
          {name ?? "—"}
        </p>
        {subtitle && (
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
