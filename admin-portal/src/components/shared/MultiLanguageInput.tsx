import { useState } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LANGUAGES = [
  { code: "en", label: "EN", name: "English" },
  { code: "km", label: "KM", name: "Khmer" },
  { code: "vi", label: "VI", name: "Vietnamese" },
  { code: "tw", label: "TW", name: "Traditional Chinese" },
  { code: "cn", label: "CN", name: "Simplified Chinese" },
];

export function MultiLanguageInput({
  label,
  values = { en: "", km: "", vi: "", tw: "", cn: "" },
  onChange,
  required = false,
  type = "input",
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draft, setDraft] = useState(values);

  function handleMainChange(e) {
    const updated = { ...values, en: e.target.value };
    onChange?.(updated);
  }

  function handleDraftChange(code, val) {
    setDraft((prev) => ({ ...prev, [code]: val }));
  }

  function handleDialogOpen() {
    setDraft({ ...values });
    setDialogOpen(true);
  }

  function handleSave() {
    onChange?.(draft);
    setDialogOpen(false);
  }

  function handleCancel() {
    setDraft({ ...values });
    setDialogOpen(false);
  }

  const safeValues = { en: "", km: "", vi: "", tw: "", cn: "", ...values };

  return (
    <div className="space-y-1.5">
      {label && (
        <Label>
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </Label>
      )}

      <div className="flex gap-2">
        {type === "textarea" ? (
          <Textarea
            value={safeValues.en}
            onChange={handleMainChange}
            placeholder="Enter text in English"
            className="flex-1 resize-none"
            rows={3}
          />
        ) : (
          <Input
            value={safeValues.en}
            onChange={handleMainChange}
            placeholder="Enter text in English"
            className="flex-1"
          />
        )}

        <Button
          type="button"
          variant="outline"
          size={type === "textarea" ? "default" : "default"}
          onClick={handleDialogOpen}
          className="shrink-0 gap-1.5"
        >
          <Globe className="h-4 w-4" />
          More languages
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={(v) => !v && handleCancel()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {label ? `${label} — All Languages` : "Multi-language Input"}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="en">
            <TabsList className="w-full">
              {LANGUAGES.map((lang) => (
                <TabsTrigger key={lang.code} value={lang.code} className="flex-1">
                  {lang.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {LANGUAGES.map((lang) => (
              <TabsContent key={lang.code} value={lang.code} className="mt-4">
                <Label className="mb-1.5 block text-sm text-muted-foreground">
                  {lang.name}
                </Label>
                {type === "textarea" ? (
                  <Textarea
                    value={draft[lang.code] ?? ""}
                    onChange={(e) => handleDraftChange(lang.code, e.target.value)}
                    placeholder={`Enter text in ${lang.name}`}
                    rows={4}
                    className="resize-none"
                  />
                ) : (
                  <Input
                    value={draft[lang.code] ?? ""}
                    onChange={(e) => handleDraftChange(lang.code, e.target.value)}
                    placeholder={`Enter text in ${lang.name}`}
                  />
                )}
              </TabsContent>
            ))}
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
