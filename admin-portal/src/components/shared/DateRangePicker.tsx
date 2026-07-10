import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function formatDate(date) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function DateRangePicker({
  from,
  to,
  onChange,
  placeholder = "Select date range",
}) {
  const [open, setOpen] = useState(false);

  const selected =
    from || to
      ? { from: from ?? undefined, to: to ?? undefined }
      : undefined;

  function handleSelect(range) {
    if (!range) {
      onChange?.({ from: null, to: null });
      return;
    }
    onChange?.({ from: range.from ?? null, to: range.to ?? null });
    if (range.from && range.to) {
      setOpen(false);
    }
  }

  const label =
    from && to
      ? `${formatDate(from)} - ${formatDate(to)}`
      : from
      ? `${formatDate(from)} - …`
      : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-9 justify-start gap-2 text-left font-normal"
        >
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <span className={from || to ? "" : "text-muted-foreground"}>
            {label}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" sideOffset={4}>
        <Calendar
          mode="range"
          selected={selected}
          onSelect={handleSelect}
          numberOfMonths={2}
          defaultMonth={from ?? new Date()}
        />
        <div className="flex items-center justify-end gap-2 border-t px-4 py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onChange?.({ from: null, to: null });
              setOpen(false);
            }}
          >
            Clear
          </Button>
          <Button size="sm" onClick={() => setOpen(false)}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
