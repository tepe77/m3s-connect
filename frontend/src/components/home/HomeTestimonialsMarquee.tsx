"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Marquee } from "@/components/ui/marquee";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { API_BASE_URL, getAssetUrl } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  rating: number;
}

const FALLBACK_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "t1",
    name: "Siti Nurhaliza, S.T.",
    role: "Lead AI Engineer, GoTo Financial",
    quote: "Belajar di MAN 3 Sleman memberikan pondasi nalar ilmiah dan adab yang sangat kokoh. Suasana madrasah yang mendukung riset teknologi membimbing saya hingga dipercaya memimpin tim kecerdasan buatan saat ini.",
    avatar: "/images/avatar-siti.jpg",
    rating: 5,
  },
  {
    id: "t2",
    name: "Ahmad Fauzan, B.Eng.",
    role: "Robotics Specialist, Tokyo Tech Research",
    quote: "Laboratorium dan bimbingan olimpiade sains di Mayoga adalah pintu pertama saya mengenal dunia robotika global. Nilai ukhuwah alumni selalu terasa hangat di manapun kami berada.",
    avatar: "/images/avatar-ahmad.jpg",
    rating: 5,
  },
  {
    id: "t3",
    name: "Rina Marlina, S.Farm.",
    role: "Research Scientist, Bio Farma",
    quote: "Tradisi integrasi sains dan agama di MAN 3 Sleman membentuk integritas kami sebagai saintis. Mayoga bukan sekadar madrasah, tapi rumah pembentukan karakter masa depan yang sesungguhnya.",
    avatar: "/images/avatar-rina.jpg",
    rating: 5,
  },
  {
    id: "t4",
    name: "Hendra Prasetyo, S.Kom.",
    role: "Founder & CEO, EduTech Nusantara",
    quote: "Jaringan alumni Mayoga sangat solid dan suportif. Ketika saya merintis startup edutech, mentor dan rekan diskusi pertama saya adalah senior dan sesama alumni dari madrasah tercinta ini.",
    avatar: "/images/avatar-ahmad.jpg",
    rating: 5,
  },
  {
    id: "t5",
    name: "Dr. dr. Nurul Hidayati, Sp.A.",
    role: "Dokter Spesialis Anak, RSUP Dr. Sardjito",
    quote: "Disiplin tahfiz dan keteladanan guru-guru Mayoga menemani perjuangan saya menyelesaikan pendidikan dokter spesialis. Kebanggaan mendalam selalu melekat sebagai alumnus madrasah berprestasi.",
    avatar: "/images/avatar-rina.jpg",
    rating: 5,
  },
  {
    id: "t6",
    name: "Fajar Ramadhan, S.T.",
    role: "Software Engineer, Shopee Indonesia",
    quote: "Portal M3S Connect memudahkan kami para lulusan muda untuk terhubung langsung dengan para profesional senior. Peluang bimbingan karir dan referensi industri jadi jauh lebih terbuka lebar!",
    avatar: "/images/avatar-ahmad.jpg",
    rating: 5,
  },
  {
    id: "t7",
    name: "Diana Puspitasari, S.Hub.Int.",
    role: "Diplomat Muda, Kementerian Luar Negeri RI",
    quote: "Kemampuan wawasan internasional dan literasi diplomasi yang diasah sejak di madrasah menjadi modal berharga saat saya bertugas mewakili delegasi Indonesia di forum multilateral.",
    avatar: "/images/avatar-siti.jpg",
    rating: 5,
  },
  {
    id: "t8",
    name: "Budi Santoso, M.Sc.",
    role: "Data Analyst Specialist, Bank Indonesia",
    quote: "Keluarga besar alumni yang aktif berbagi beasiswa dan pendampingan kampus membuat mimpi anak madrasah menembus universitas terbaik dunia terasa sangat mungkin dicapai.",
    avatar: "/images/avatar-ahmad.jpg",
    rating: 5,
  },
];

function resolveImageUrl(url: string | undefined | null, fallbackUrl: string): string {
  if (!url) return fallbackUrl;
  const match = url.match(/(news-[a-z0-9-]+|doc-[a-z0-9-]+|avatar-[a-z0-9-]+|hero-[a-z0-9-]+)\.(jpg|png|webp)/i);
  if (match) {
    return `/images/${match[0]}`;
  }
  return getAssetUrl(url);
}

function ReviewCard({ quote, name, role, avatar, rating }: TestimonialItem) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <figure className="flex w-72 shrink-0 flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-slate-800 shadow-xs transition-all hover:border-teal-400 hover:shadow-md sm:w-88 select-none">
      <div>
        {/* Star Ratings */}
        <div className="flex gap-1 text-amber-400" role="img" aria-label={`Rating ${rating} dari 5 bintang`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`w-3.5 h-3.5 ${i < rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        {/* Quote text */}
        <blockquote className="mt-3 text-xs leading-relaxed text-slate-600 line-clamp-4">
          &ldquo;{quote}&rdquo;
        </blockquote>
      </div>

      {/* Author Caption */}
      <figcaption className="flex items-center gap-3 pt-3 border-t border-slate-100">
        <div className="relative w-9 h-9 rounded-full overflow-hidden bg-teal-50 border border-teal-200 shrink-0 flex items-center justify-center font-bold text-xs text-teal-700">
          {avatar ? (
            <Image
              src={avatar}
              alt={name}
              fill
              className="object-cover"
              sizes="36px"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <div className="min-w-0 text-left">
          <div className="truncate text-xs font-bold text-slate-900">{name}</div>
          <div className="truncate text-[11px] text-slate-500">{role}</div>
        </div>
      </figcaption>
    </figure>
  );
}

export function HomeTestimonialsMarquee() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(FALLBACK_TESTIMONIALS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    author_name: "",
    graduation_year: "",
    position: "",
    company: "",
    rating: 5,
    content: "",
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchTestimonials() {
      try {
        const res = await fetch(`${API_BASE_URL}/testimonials?limit=16`, {
          cache: "no-store",
        });
        if (res.ok) {
          const json = await res.json();
          const list = json?.data;
          if (Array.isArray(list) && list.length > 0) {
            const mapped: TestimonialItem[] = list.map((item: any, idx: number) => {
              const fallback = FALLBACK_TESTIMONIALS[idx % FALLBACK_TESTIMONIALS.length];
              return {
                id: item.id || fallback.id,
                name: item.display_name || fallback.name,
                role: item.display_role || fallback.role,
                quote: item.content || fallback.quote,
                avatar: resolveImageUrl(item.display_avatar || item.author_avatar, fallback.avatar),
                rating: item.rating || 5,
              };
            });
            if (isMounted) {
              setTestimonials(mapped);
            }
          }
        }
      } catch {
        // Fallback to initial
      }
    }

    fetchTestimonials();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/testimonials`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitSuccess(true);
        setFormData({
          author_name: "",
          graduation_year: "",
          position: "",
          company: "",
          rating: 5,
          content: "",
        });
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitSuccess(false);
        }, 2200);
      }
    } catch {
      alert("Gagal mengirim testimoni. Silakan periksa koneksi backend Anda.");
    } finally {
      setSubmitting(false);
    }
  };

  // Split into 2 rows for Velora UI Marquee
  const half = Math.ceil(testimonials.length / 2);
  const topRow = testimonials.slice(0, half);
  const bottomRow = testimonials.slice(half);

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
      {/* Boxed Rounded Card Container (Aligned with grid above and CTA below) */}
      <div className="relative rounded-3xl bg-gradient-to-b from-slate-50/90 via-white to-slate-50/60 border border-[#E2E8F0] py-10 sm:py-14 px-3 sm:px-6 shadow-xs overflow-hidden">
        {/* Subtle Background Radial Glow */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-500/8 via-transparent to-transparent pointer-events-none"
        />

        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center px-4 mb-10">
          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-[#0D9488] border border-emerald-200">
            Kesan & Cerita Alumni
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Inspirasi & Jejak Langkah Alumni Mayoga
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Simak pengalaman rekan-rekan alumni MAN 3 Sleman dalam meniti karir, studi lanjut, dan kontribusi nyata untuk masyarakat.
          </p>

          {/* Action Button: Tulis Testimoni */}
          <div className="mt-5 flex items-center justify-center">
            <Button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0D9488] hover:bg-[#0F766E] shadow-sm hover:shadow-md transition-all active:scale-98"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Bagikan Kesan & Testimoni Anda</span>
            </Button>
          </div>
        </div>

        {/* Two Scrolling Marquee Rows (Contained within frame) */}
        <div className="flex flex-col gap-4 overflow-hidden rounded-2xl">
          {/* Row 1: Drifting Left */}
          <Marquee repeat={3} className="[--duration:55s]">
            {topRow.map((item) => (
              <ReviewCard key={item.id} {...item} />
            ))}
          </Marquee>

          {/* Row 2: Drifting Right (Reverse) */}
          <Marquee reverse repeat={3} className="[--duration:60s]">
            {bottomRow.map((item) => (
              <ReviewCard key={item.id} {...item} />
            ))}
          </Marquee>
        </div>
      </div>

      {/* Submission Modal Dialog (Standard shadcn UI Dialog + Form primitives) */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg p-6">
          <DialogHeader>
            <DialogTitle>Kirim Kesan & Testimoni Alumni</DialogTitle>
            <DialogDescription>
              Kesan Anda akan diverifikasi admin sebelum tampil di beranda.
            </DialogDescription>
          </DialogHeader>

          {submitSuccess ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-sm font-bold text-slate-900">Terima Kasih atas Testimoni Anda!</h4>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                Testimoni Anda telah tersimpan dan akan melalui proses verifikasi oleh tim moderasi sebelum diterbitkan di Marquee Beranda.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="author_name">Nama Lengkap & Gelar</Label>
                  <Input
                    id="author_name"
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso, S.Kom."
                    value={formData.author_name}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="graduation_year">Tahun Lulus / Angkatan</Label>
                  <Input
                    id="graduation_year"
                    type="text"
                    placeholder="Contoh: 2018"
                    value={formData.graduation_year}
                    onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="position">Jabatan / Profesi</Label>
                  <Input
                    id="position"
                    type="text"
                    placeholder="Contoh: Software Engineer"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="company">Perusahaan / Kampus</Label>
                  <Input
                    id="company"
                    type="text"
                    placeholder="Contoh: Tokopedia / UGM"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="rating-select">Rating Kepuasan</Label>
                <Select
                  value={String(formData.rating)}
                  onValueChange={(val) => setFormData({ ...formData, rating: Number(val) })}
                >
                  <SelectTrigger id="rating-select">
                    <SelectValue placeholder="Pilih rating kepuasan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">⭐⭐⭐⭐⭐ (Sangat Puas - 5 Bintang)</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ (Puas - 4 Bintang)</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ (Cukup - 3 Bintang)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="testimonial-content">Kesan, Pesan & Pengalaman</Label>
                <Textarea
                  id="testimonial-content"
                  required
                  rows={4}
                  placeholder="Ceritakan bagaimana MAN 3 Sleman membantu perkembangan karir, studi, atau karakter Anda..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? "Mengirim..." : "Kirim Testimoni"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
