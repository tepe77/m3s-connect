"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, Share2 } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
  subtitle?: string;
}

export function ShareModal({
  isOpen,
  onClose,
  title,
  url,
  subtitle = "Bagikan diskusi ini kepada rekan-rekan alumni MAN 3 Sleman",
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (typeof window !== "undefined") {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(url);
        } else {
          const textArea = document.createElement("textarea");
          textArea.value = url;
          textArea.style.position = "fixed";
          textArea.style.opacity = "0";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: `${title} - Forum IKAMAYOGA`,
          url,
        });
        onClose();
      } catch {
        // User cancelled share
      }
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${title} - Forum IKAMAYOGA: ${url}`
  )}`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `${title} - Forum IKAMAYOGA`
  )}&url=${encodeURIComponent(url)}`;

  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
    url
  )}&text=${encodeURIComponent(title)}`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-6 rounded-3xl">
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-600" />
            <span>Bagikan Topik Diskusi</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {subtitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-3">
          {/* Quick Share Buttons */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors text-emerald-900 group"
            >
              <span className="text-xl mb-1">💬</span>
              <span className="text-xs font-bold">WhatsApp</span>
            </a>

            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors text-sky-900 group"
            >
              <span className="text-xl mb-1">✈️</span>
              <span className="text-xs font-bold">Telegram</span>
            </a>

            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors text-slate-900 group"
            >
              <span className="text-xl mb-1">𝕏</span>
              <span className="text-xs font-bold">Twitter / X</span>
            </a>
          </div>

          {/* Copy Link Input Bar */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              Salin Tautan Langsung
            </label>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={url}
                className="text-xs font-mono bg-slate-50 border-slate-200 text-slate-700 select-all"
              />
              <Button
                type="button"
                onClick={handleCopy}
                className="shrink-0 gap-1.5 px-4 text-xs font-semibold rounded-xl"
                variant={copied ? "secondary" : "default"}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Native Web Share option for mobile */}
          {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
            <div className="pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={handleNativeShare}
                className="w-full text-xs font-semibold rounded-2xl border-slate-200 gap-2 h-10"
              >
                <Share2 className="w-4 h-4 text-slate-600" />
                <span>Buka Menu Berbagi Bawaan Perangkat</span>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
