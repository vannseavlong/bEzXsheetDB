import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <Input
        type="text"
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        className="h-9 rounded-md border pl-9 pr-3 text-sm"
      />
    </div>
  );
}
