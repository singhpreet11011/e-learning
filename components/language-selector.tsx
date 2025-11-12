"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Languages, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SUPPORTED_LANGUAGES, LanguageCode } from "@/lib/translation";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export function LanguageSelector() {
  const {
    primaryLanguage,
    secondaryLanguage,
    setPrimaryLanguage,
    setSecondaryLanguage,
    savePreferences,
  } = useLanguage();

  const [open, setOpen] = useState(false);
  const [tempPrimary, setTempPrimary] = useState<LanguageCode | null>(primaryLanguage);
  const [tempSecondary, setTempSecondary] = useState<LanguageCode | null>(secondaryLanguage);
  const { toast } = useToast();

  useEffect(() => {
    setTempPrimary(primaryLanguage);
    setTempSecondary(secondaryLanguage);
  }, [primaryLanguage, secondaryLanguage, open]);

  const handleSave = async () => {
    setPrimaryLanguage(tempPrimary);
    setSecondaryLanguage(tempSecondary);
    await savePreferences();
    setOpen(false);
    toast({
      title: "Language preferences saved",
      description: "Your language settings have been updated successfully.",
    });
  };

  const handleCancel = () => {
    setTempPrimary(primaryLanguage);
    setTempSecondary(secondaryLanguage);
    setOpen(false);
  };

  const getLanguageName = (code: LanguageCode | null) => {
    if (!code) return null;
    const lang = SUPPORTED_LANGUAGES.find((l) => l.code === code);
    return lang?.nativeName || lang?.name;
  };

  const renderCurrentLanguages = () => {
    if (!primaryLanguage && !secondaryLanguage) {
      return (
        <Button variant="ghost" size="sm">
          <Languages className="h-4 w-4" />
        </Button>
      );
    }

    return (
      <div className="flex items-center gap-1">
        {primaryLanguage && (
          <Badge variant="secondary" className="text-xs">
            {getLanguageName(primaryLanguage)}
          </Badge>
        )}
        {secondaryLanguage && (
          <Badge variant="outline" className="text-xs">
            {getLanguageName(secondaryLanguage)}
          </Badge>
        )}
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Languages className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{renderCurrentLanguages()}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Translation Languages</DialogTitle>
          <DialogDescription>
            Choose your preferred languages for automatic translation. Course content
            will be displayed in your selected language(s) alongside the original
            English.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="primary">Primary Language</Label>
            <div className="flex gap-2">
              <Select
                value={tempPrimary || ""}
                onValueChange={(value) => setTempPrimary(value as LanguageCode)}
              >
                <SelectTrigger id="primary">
                  <SelectValue placeholder="Select primary language" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.filter((lang) => lang.code !== tempSecondary).map(
                    (lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center gap-2">
                          {lang.nativeName}
                          <span className="text-muted-foreground">({lang.name})</span>
                        </span>
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              {tempPrimary && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTempPrimary(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="secondary">Secondary Language (Optional)</Label>
            <div className="flex gap-2">
              <Select
                value={tempSecondary || ""}
                onValueChange={(value) => setTempSecondary(value as LanguageCode)}
                disabled={!tempPrimary}
              >
                <SelectTrigger id="secondary">
                  <SelectValue placeholder="Select secondary language" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.filter((lang) => lang.code !== tempPrimary).map(
                    (lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center gap-2">
                          {lang.nativeName}
                          <span className="text-muted-foreground">({lang.name})</span>
                        </span>
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              {tempSecondary && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTempSecondary(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {!tempPrimary && (
              <p className="text-xs text-muted-foreground">
                Select a primary language first
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Languages</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
