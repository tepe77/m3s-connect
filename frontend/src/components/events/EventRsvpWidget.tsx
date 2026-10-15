"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  EventModel,
  submitEventRsvp,
  cancelEventRsvp,
  fetchEventDetail,
} from "@/data/eventData";
import {
  CheckCircle2,
  Users,
  AlertCircle,
  CalendarCheck,
  XCircle,
  LogIn,
  Loader2,
  Share2,
  Copy,
  Check,
  Ticket,
} from "lucide-react";

interface EventRsvpWidgetProps {
  event: EventModel;
}

export function EventRsvpWidget({ event }: EventRsvpWidgetProps) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isRegistered, setIsRegistered] = useState<boolean>(event.is_registered ?? false);
  const [rsvpsCount, setRsvpsCount] = useState<number>(event.rsvps_count);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("m3s_token");
    const userStr = localStorage.getItem("m3s_user");
    if (token) {
      setIsLoggedIn(true);
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setCurrentUser(user);
        } catch {}
      }

      // Sync fresh authenticated registration status directly from backend
      fetchEventDetail(event.slug, token).then((fresh) => {
        if (fresh) {
          if (fresh.is_registered !== undefined) {
            setIsRegistered(fresh.is_registered);
          }
          if (fresh.rsvps_count !== undefined) {
            setRsvpsCount(fresh.rsvps_count);
          }
        }
      });
    }
  }, [event.slug]);

  const handleRsvp = async () => {
    const token = localStorage.getItem("m3s_token");
    if (!token) {
      router.push(`/login?redirect=/events/${event.slug}`);
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    const result = await submitEventRsvp(event.slug, token);
    setIsLoading(false);

    if (result.success) {
      setIsRegistered(true);
      setRsvpsCount((prev) => prev + 1);
      setFeedback({ type: "success", text: result.message });
      router.refresh();
    } else {
      setFeedback({ type: "error", text: result.message });
    }
  };

  const handleCancelRsvp = async () => {
    if (!confirm("Apakah Anda yakin ingin membatalkan kehadiran pada agenda ini?")) {
      return;
    }

    const token = localStorage.getItem("m3s_token");
    if (!token) return;

    setIsLoading(true);
    setFeedback(null);

    const result = await cancelEventRsvp(event.slug, token);
    setIsLoading(false);

    if (result.success) {
      setIsRegistered(false);
      setRsvpsCount((prev) => Math.max(0, prev - 1));
      setFeedback({ type: "success", text: result.message });
      router.refresh();
    } else {
      setFeedback({ type: "error", text: result.message });
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const maxQuota = event.max_participants;
  const isFull = maxQuota ? rsvpsCount >= maxQuota : false;
  const percentage = maxQuota ? Math.min(100, Math.round((rsvpsCount / maxQuota) * 100)) : null;

  return (
    <div className="space-y-6">
      {/* Admission Ticket Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Ticket Header Ribbon */}
        <div className="bg-slate-900 text-white p-5 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Ticket className="size-3.5" /> Konfirmasi Hadir
            </span>
            <span className="text-slate-400 font-mono text-[11px]">RSVP-TKT</span>
          </div>
          <p className="text-sm font-bold text-slate-100 truncate">{event.title}</p>
        </div>

        {/* Ticket Body */}
        <div className="p-6 space-y-5">
          {/* Status Label */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">Status Pendaftaran:</span>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold ${
                event.is_past
                  ? "bg-slate-100 text-slate-700"
                  : isRegistered
                  ? "bg-emerald-100 text-emerald-900 font-bold"
                  : isFull
                  ? "bg-amber-100 text-amber-900"
                  : "bg-emerald-50 text-emerald-800"
              }`}
            >
              {event.is_past
                ? "Agenda Selesai"
                : isRegistered
                ? "Terdaftar Hadir"
                : isFull
                ? "Kuota Penuh"
                : "Pendaftaran Dibuka"}
            </span>
          </div>

          {/* Quota Gauge */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Users className="size-3.5 text-emerald-700" /> Kuota Peserta Terisi
              </span>
              <span className="font-bold text-slate-900">
                {rsvpsCount} {maxQuota ? `/ ${maxQuota} Kursi` : "Alumni Hadir"}
              </span>
            </div>

            {maxQuota && (
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    percentage && percentage >= 90
                      ? "bg-amber-500"
                      : "bg-emerald-700"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            )}
          </div>

          {/* Feedback Banner */}
          {feedback && (
            <div
              className={`p-3 rounded-xl text-xs flex items-start gap-2.5 ${
                feedback.type === "success"
                  ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                  : "bg-red-50 text-red-900 border border-red-200"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 className="size-4 shrink-0 text-emerald-700 mt-0.5" />
              ) : (
                <AlertCircle className="size-4 shrink-0 text-red-700 mt-0.5" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}

          {/* Action Button States */}
          {event.is_past ? (
            <div className="p-3 bg-slate-50 rounded-xl text-center text-xs text-slate-500 font-medium border border-slate-100">
              Agenda ini telah selesai dilaksanakan.
            </div>
          ) : isRegistered ? (
            <div className="space-y-3">
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200/80 flex items-start gap-3 text-xs text-emerald-900">
                <CheckCircle2 className="size-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-sm">Kehadiran Terkonfirmasi</p>
                  <p className="text-emerald-800 text-[11px] leading-relaxed">
                    Nama Anda telah tercatat resmi. Tautan virtual atau nomor meja akan diinformasikan menjelang hari H.
                  </p>
                </div>
              </div>

              <button
                onClick={handleCancelRsvp}
                disabled={isLoading}
                className="w-full py-2.5 px-4 text-xs font-semibold text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-xl border border-slate-200 hover:border-red-200 transition-colors flex items-center justify-center gap-1.5"
              >
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <>
                    <XCircle className="size-3.5" />
                    <span>Batalkan Konfirmasi Hadir</span>
                  </>
                )}
              </button>
            </div>
          ) : !isLoggedIn ? (
            <div className="space-y-3">
              <Link
                href={`/login?redirect=/events/${event.slug}`}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all shadow-xs"
              >
                <LogIn className="size-4" />
                <span>Masuk untuk Konfirmasi Hadir (RSVP)</span>
              </Link>
              <p className="text-[11px] text-center text-slate-400">
                Belum terdaftar?{" "}
                <Link href="/register" className="text-emerald-800 font-semibold hover:underline">
                  Daftar akun alumni
                </Link>
              </p>
            </div>
          ) : isFull ? (
            <div className="p-3 bg-amber-50 rounded-xl text-center text-xs text-amber-900 font-medium border border-amber-200">
              Kuota peserta telah maksimal. Pantau informasi pembukaan kuota tambahan via panitia.
            </div>
          ) : (
            <button
              onClick={handleRsvp}
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all shadow-xs"
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <CalendarCheck className="size-4" />
                  <span>Konfirmasi Kehadiran Saya (RSVP)</span>
                </>
              )}
            </button>
          )}

          {/* Share & Copy Link Section */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium text-slate-700">Bagikan Agenda:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700"
                title="Salin Link Agenda"
              >
                {copied ? (
                  <>
                    <Check className="size-3.5 text-emerald-700" />
                    <span className="text-[11px] text-emerald-800 font-semibold">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5 text-slate-400" />
                    <span className="text-[11px]">Salin Link</span>
                  </>
                )}
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Hai Rekan Alumni! Ikuti agenda "${event.title}". Konfirmasi RSVP di: ${
                    typeof window !== "undefined" ? window.location.href : ""
                  }`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors font-semibold text-[11px]"
              >
                <Share2 className="size-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Organizer Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Penyelenggara
        </p>
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-black text-sm shadow-xs">
            MY
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">
              {event.creator?.name || "Pengurus Pusat IKAMAYOGA"}
            </p>
            <p className="text-[11px] text-slate-500">
              Ikatan Alumni Madrasah Aliyah Negeri 3 Sleman
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed pt-1">
          Pertanyaan terkait kepanitiaan, kontribusi, atau sponsorship agenda dapat diajukan melalui narahubung resmi.
        </p>
        <div className="pt-1">
          <Link
            href="/kontak"
            className="inline-block text-xs font-semibold text-emerald-800 hover:underline"
          >
            Kontak Panitia & Bantuan Resmi →
          </Link>
        </div>
      </div>
    </div>
  );
}
