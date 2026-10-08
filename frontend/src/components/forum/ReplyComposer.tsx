"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
  Bold,
  Italic,
  Quote,
  Code,
  Smile,
  Link as LinkIcon,
  Image as ImageIcon,
  Video as VideoIcon,
  Upload,
  Send,
  Lock,
  MessageSquare,
  X,
  Sparkles,
} from "lucide-react";

import { ForumAuthor } from "@/data/forumData";
import { RichContentRenderer } from "./RichContentRenderer";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ReplyComposerProps {
  isLocked: boolean;
  replyTarget?: { author: ForumAuthor; postId: string } | null;
  onClearTarget?: () => void;
  onSubmitReply: (body: string, parentId?: string, parentAuthorName?: string) => Promise<boolean>;
}

export function ReplyComposer({
  isLocked,
  replyTarget,
  onClearTarget,
  onSubmitReply,
}: ReplyComposerProps) {
  const [currentUser, setCurrentUser] = useState<ForumAuthor | null>(null);
  const [replyText, setReplyText] = useState("");
  const [activeTab, setActiveTab] = useState<string>("write");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dialog States
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);

  // Dialog Inputs
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const POPULAR_EMOJIS = [
    "👍", "❤️", "🎉", "🔥", "👏", "🤝", "🎓", "🚀", "💡", "😊", "🙌", "✨", "☕", "🌟", "📚", "💯"
  ];

  useEffect(() => {
    try {
      const token = localStorage.getItem("m3s_token");
      const userStr = localStorage.getItem("m3s_user");
      if (token && userStr) {
        const u = JSON.parse(userStr);
        setCurrentUser({
          id: u.id || "user-current",
          name: u.name || "Alumni Terdaftar",
          avatar: u.avatar || "/images/avatar-ahmad.jpg",
          role: u.role || "alumni",
          graduationYear: 2018,
          occupation: "Alumni Terverifikasi",
        });
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    }
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyText.trim()) return;

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const success = await onSubmitReply(
        replyText.trim(),
        replyTarget?.postId,
        replyTarget?.author.name
      );

      if (success) {
        setReplyText("");
        setActiveTab("write");
        if (onClearTarget) onClearTarget();
      } else {
        setErrorMessage("Gagal mengirimkan balasan. Silakan coba sesaat lagi.");
      }
    } catch {
      setErrorMessage("Terjadi gangguan koneksi ke server.");
    } finally {
      setSubmitting(false);
    }
  };

  const insertFormatting = (prefix: string, suffix = "") => {
    setReplyText((prev) => `${prev}${prefix}teks${suffix}`);
  };

  const insertEmoji = (emoji: string) => {
    setReplyText((prev) => `${prev} ${emoji} `);
    setIsEmojiOpen(false);
  };

  const handleInsertLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl.trim()) return;
    const title = linkText.trim() || linkUrl.trim();
    setReplyText((prev) => `${prev} [${title}](${linkUrl.trim()}) `);
    setLinkText("");
    setLinkUrl("");
    setIsLinkDialogOpen(false);
  };

  const handleInsertImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;
    const caption = imageCaption.trim() || "Gambar Dokumentasi";
    setReplyText((prev) => `${prev}\n\n![${caption}](${imageUrl.trim()})\n\n`);
    setImageCaption("");
    setImageUrl("");
    setIsImageDialogOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Hanya format file gambar yang diperbolehkan.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        setImageUrl(result);
        if (!imageCaption) {
          setImageCaption(file.name.replace(/\.[^/.]+$/, ""));
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInsertVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) return;
    setReplyText((prev) => `${prev}\n\n[video: ${videoUrl.trim()}]\n\n`);
    setVideoUrl("");
    setIsVideoDialogOpen(false);
  };

  // Case 1: Topic is locked
  if (isLocked) {
    return (
      <Card className="bg-slate-50 border-slate-200 text-center p-6 sm:p-8">
        <div className="w-12 h-12 rounded-2xl bg-slate-200 text-slate-600 flex items-center justify-center mx-auto mb-3">
          <Lock className="w-6 h-6" />
        </div>
        <h4 className="text-base font-extrabold text-[#0F172A]">Topik Ini Telah Dikunci</h4>
        <p className="text-xs text-[#64748B] max-w-md mx-auto mt-1">
          Moderator telah mengunci topik diskusi ini. Balasan baru tidak lagi diterima untuk menjaga integritas arsip madrasah.
        </p>
      </Card>
    );
  }

  // Case 2: User is not logged in
  if (!currentUser) {
    return (
      <Card className="bg-gradient-to-r from-emerald-50/60 via-teal-50/40 to-white border-emerald-200 p-6 sm:p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-white text-[#0D9488] shadow-xs border border-emerald-100 flex items-center justify-center mx-auto">
          <MessageSquare className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-base font-extrabold text-[#0F172A]">
            Bergabung dalam Percakapan Topik Ini
          </h4>
          <p className="text-xs text-[#065F46] max-w-md mx-auto leading-relaxed">
            Hanya sesama anggota alumni terdaftar yang dapat membalas dan mengirimkan opini di forum ini. Silakan masuk untuk berkontribusi.
          </p>
        </div>
        <div className="pt-2">
          <Button asChild size="lg" className="rounded-full px-7 shadow-xs">
            <Link href="/login">
              Masuk untuk Menulis Balasan &rarr;
            </Link>
          </Button>
        </div>
      </Card>
    );
  }

  // Case 3: Logged in composer
  return (
    <Card className="bg-white border-[#E2E8F0] shadow-sm overflow-hidden">
      <CardContent className="p-5 sm:p-7 space-y-4">
        {/* Header Bar: Author Info, Replying Badge, and Mode Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden bg-slate-100 ring-2 ring-emerald-100 shrink-0">
              <Image
                src={currentUser.avatar}
                alt={currentUser.name}
                fill
                sizes="36px"
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#0F172A] block leading-tight">
                  {currentUser.name}
                </span>
                <Badge variant="emerald" className="text-[9px] py-0 px-1.5">
                  Alumni Terverifikasi
                </Badge>
              </div>
              <span className="text-[11px] text-[#64748B]">
                Menulis tanggapan diskusi
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {replyTarget && (
              <Badge variant="secondary" className="gap-1.5 py-1 px-3 text-xs bg-slate-100 hover:bg-slate-200 transition-colors">
                <span>Membalas @{replyTarget.author.name}</span>
                <button
                  type="button"
                  onClick={onClearTarget}
                  title="Batal membalas kutipan spesifik"
                  className="hover:text-rose-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}

            {/* Shadcn Tabs for Write vs Preview */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-slate-100">
                <TabsTrigger value="write">Tulis</TabsTrigger>
                <TabsTrigger value="preview">Pratinjau</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
            {errorMessage}
          </div>
        )}

        {/* Toolbar: Markdown Formatters, Emoji, Link, Image, Video */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting("**", "**")}
            className="h-7 px-2 font-black text-slate-700"
            title="Tebal (Bold)"
          >
            <Bold className="w-3.5 h-3.5" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting("*", "*")}
            className="h-7 px-2 italic text-slate-700"
            title="Miring (Italic)"
          >
            <Italic className="w-3.5 h-3.5" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting("> ")}
            className="h-7 px-2 text-slate-700"
            title="Kutipan (Quote)"
          >
            <Quote className="w-3.5 h-3.5" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting("`", "`")}
            className="h-7 px-2 font-mono text-slate-700"
            title="Inline Code"
          >
            <Code className="w-3.5 h-3.5" />
          </Button>

          <div className="w-px h-4 bg-slate-200 mx-1" />

          {/* Emoji Popover */}
          <Popover open={isEmojiOpen} onOpenChange={setIsEmojiOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2.5 gap-1 text-slate-700 hover:text-[#0D9488]"
              >
                <Smile className="w-3.5 h-3.5 text-amber-500" />
                <span>Emoji</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-72 p-3">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#64748B] block">
                  Pilih Emoji Cepat
                </span>
                <div className="grid grid-cols-8 gap-1">
                  {POPULAR_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => insertEmoji(emoji)}
                      className="h-7 w-7 rounded-lg hover:bg-slate-100 text-base flex items-center justify-center transition-transform hover:scale-110"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Link Dialog Trigger */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsLinkDialogOpen(true)}
            className="h-7 px-2.5 gap-1 text-slate-700 hover:text-[#0D9488]"
          >
            <LinkIcon className="w-3.5 h-3.5 text-blue-500" />
            <span>Tautan</span>
          </Button>

          {/* Photo Dialog Trigger */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsImageDialogOpen(true)}
            className="h-7 px-2.5 gap-1 text-slate-700 hover:text-[#0D9488]"
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>Foto</span>
          </Button>

          {/* Video Dialog Trigger */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsVideoDialogOpen(true)}
            className="h-7 px-2.5 gap-1 text-slate-700 hover:text-[#0D9488]"
          >
            <VideoIcon className="w-3.5 h-3.5 text-rose-500" />
            <span>Video</span>
          </Button>
        </div>

        {/* Editor Area / Preview Area */}
        {activeTab === "write" ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Tuliskan pandangan, ide, atau tanggapan Anda di sini... Mendukung Markdown, gambar, dan emoji."
              className="min-h-[140px] text-xs sm:text-sm resize-y rounded-2xl border-[#CBD5E1] p-4 focus-visible:ring-[#0D9488]/25 focus-visible:border-[#0D9488]"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1.5 text-[11px] text-[#94A3B8]">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Tekan Shift+Enter untuk baris baru</span>
              </div>

              <Button
                type="submit"
                disabled={submitting || !replyText.trim()}
                className="rounded-full px-6 gap-2 shadow-xs"
              >
                {submitting ? (
                  <span>Mengirimkan...</span>
                ) : (
                  <>
                    <span>Kirim Balasan</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 min-h-[140px]">
              {replyText.trim() ? (
                <RichContentRenderer content={replyText} />
              ) : (
                <p className="text-xs text-[#94A3B8] italic">
                  Belum ada konten balasan untuk ditampilkan pada pratinjau.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("write")}
                className="rounded-full"
              >
                &larr; Kembali Menulis
              </Button>

              <Button
                type="button"
                onClick={() => handleSubmit()}
                disabled={submitting || !replyText.trim()}
                className="rounded-full px-6 gap-2 shadow-xs"
              >
                {submitting ? "Mengirimkan..." : "Kirim Balasan"}
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Modal 1: Sisipkan Tautan */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sisipkan Tautan Web</DialogTitle>
            <DialogDescription>
              Tautan akan diformat sebagai hyperlink markdown yang dapat diklik oleh pembaca.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleInsertLink} className="space-y-3 pt-2">
            <div className="space-y-1">
              <Label className="text-xs font-bold text-[#0F172A]">Teks Tautan (Opsional)</Label>
              <Input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Contoh: Website Resmi Alumni MAN 3 Sleman"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold text-[#0F172A]">URL Tujuan</Label>
              <Input
                type="url"
                required
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://contoh-link.com"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsLinkDialogOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit">
                Sisipkan Tautan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal 2: Unggah / Sisipkan Foto */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Unggah atau Sisipkan Foto</DialogTitle>
            <DialogDescription>
              Sertakan foto dokumentasi kegiatan atau ilustrasi untuk memperkaya diskusi.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleInsertImage} className="space-y-3 pt-2">
            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-11 border-dashed border-[#0D9488] text-[#0D9488] bg-emerald-50/30 hover:bg-emerald-50 hover:text-[#0D9488] gap-2 rounded-2xl"
              >
                <Upload className="w-4 h-4" />
                <span>Pilih Foto dari Perangkat</span>
              </Button>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-[#64748B] block">Atau pilih dokumentasi:</span>
              <div className="flex flex-wrap items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setImageUrl("/images/hero-man3-sleman.jpg");
                    setImageCaption("Gedung Kampus MAN 3 Sleman");
                  }}
                  className="h-6 text-[10px] px-2 rounded-md"
                >
                  Kampus Mayoga
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setImageUrl("/images/doc-wisuda.jpg");
                    setImageCaption("Pelepasan Alumni");
                  }}
                  className="h-6 text-[10px] px-2 rounded-md"
                >
                  Wisuda Alumni
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setImageUrl("/images/doc-baksos.jpg");
                    setImageCaption("Bakti Sosial Ramadhan");
                  }}
                  className="h-6 text-[10px] px-2 rounded-md"
                >
                  Bakti Sosial
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold text-[#0F172A]">Keterangan Foto (Caption)</Label>
              <Input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="Contoh: Suasana Reuni Akbar 2026"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold text-[#0F172A]">URL Foto</Label>
              <Input
                type="text"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://... atau hasil upload di atas"
                className="font-mono text-[11px]"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsImageDialogOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={!imageUrl.trim()}>
                Sisipkan Foto
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal 3: Sisipkan Video */}
      <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sisipkan Video YouTube atau MP4</DialogTitle>
            <DialogDescription>
              Video akan disematkan langsung sebagai player responsif pada postingan Anda.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleInsertVideo} className="space-y-3 pt-2">
            <div className="space-y-1">
              <Label className="text-xs font-bold text-[#0F172A]">URL Video</Label>
              <Input
                type="url"
                required
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsVideoDialogOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={!videoUrl.trim()}>
                Sisipkan Video
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
