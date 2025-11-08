"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface CoachShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token: string | null;
  onGenerateLink: () => Promise<void>;
}

export function CoachShareDialog({
  open,
  onOpenChange,
  token,
  onGenerateLink,
}: CoachShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const shareUrl = token
    ? `${window.location.origin}/coach/${token}`
    : null;

  const handleCopy = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await onGenerateLink();
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogClose onClose={() => onOpenChange(false)} />
        <DialogHeader>
          <DialogTitle>Partager au coach</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {!token ? (
            <>
              <p className="text-sm text-muted-foreground">
                Génère un lien de partage en lecture seule pour ton coach.
              </p>
              <Button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full bg-accent hover:bg-accent-light text-white"
              >
                {generating ? "Génération..." : "Générer le lien"}
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Partage créé. Copie le lien et envoie-le à ton coach.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl || ""}
                  className="flex-1 px-3 py-2 bg-muted rounded-md text-sm border border-border"
                />
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="sm"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Ce lien expire dans 14 jours et peut être révoqué à tout moment.
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

