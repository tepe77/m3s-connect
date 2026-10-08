"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Marquee } from "@/components/ui/marquee";

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
  if (url.startsWith("/storage/")) {
    return `http://localhost:8000${url}`;
  }
  return url;
}

function ReviewCard({ quote, name, role, avatar, rating }: TestimonialItem) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <figure className="flex w-80 shrink-0 flex-col justify-between gap-5 rounded-2xl border border-slate-200/90 bg-white p-5 text-slate-800 shadow-xs transition-all hover:border-teal-400 hover:shadow-md sm:w-96 select-none">
      <div>
        {/* Star Ratings */}
        <div className="flex gap-1 text-amber-400" role="img" aria-label={`Rating ${rating} dari 5 bintang`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < rating ? "fill-amber-400" : "fill-slate-200 text-slate-200"}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        {/* Quote text */}
        <blockquote className="mt-3.5 text-xs sm:text-sm leading-relaxed text-slate-600 line-clamp-4">
          &ldquo;{quote}&rdquo;
        </blockquote>
      </div>

      {/* Author Caption */}
      <figcaption className="flex items-center gap-3 pt-3 border-t border-slate-100">
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-teal-50 border border-teal-200/60 shrink-0 flex items-center justify-center font-bold text-xs text-teal-700">
          {avatar ? (
            <Image
              src={avatar}
              alt={name}
              fill
              className="object-cover"
              sizes="40px"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <div className="min-w-0 text-left">
          <div className="truncate text-xs sm:text-sm font-bold text-slate-900">{name}</div>
          <div className="truncate text-[11px] font-medium text-slate-500">{role}</div>
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
        const res = await fetch("http://localhost:8000/api/v1/testimonials?limit=16", {
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
      const res = await fetch("http://localhost:8000/api/v1/testimonials", {
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
        }, 2500);
      }
    } catch {
      alert("Gagal mengirim testimoni. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  // Split into 2 rows for Velora UI Marquee
  const half = Math.ceil(testimonials.length / 2);
  const topRow = testimonials.slice(0, half);
  const bottomRow = testimonials.slice(half);

  return (
    <section className="relative isolate overflow-hidden py-16 sm:py-20 bg-slate-50 border-y border-slate-200/80">
      {/* Background Soft Glow */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-1/2 -z-10 mx-auto h-72 max-w-4xl -translate-y-1/2 rounded-full bg-teal-500/10 blur-3xl"
      />

      {/* Section Header */}
      <div className="mx-auto max-w-3xl text-center px-4 sm:px-6 lg:px-8 mb-12">
        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-[#0D9488] border border-emerald-200">
          Kesan & Cerita Alumni
        </span>
        <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight">
          Inspirasi & Jejak Langkah Alumni Mayoga
        </h2>
        <p className="mt-3 text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Simak pengalaman rekan-rekan alumni MAN 3 Sleman dalam meniti karir, studi lanjut, dan kontribusi nyata untuk masyarakat.
        </p>

        {/* Action Button: Tulis Testimoni */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0D9488] hover:bg-[#0F766E] shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Bagikan Kesan & Testimoni Anda</span>
          </button>
        </div>
      </div>

      {/* Two Scrolling Marquee Rows (Velora UI Pattern) */}
      <div className="flex flex-col gap-5 overflow-hidden">
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

      {/* Submission Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-900">Kirim Kesan & Testimoni Alumni</h3>
                <p className="text-xs text-slate-500">Cerita Anda akan diverifikasi oleh admin sebelum tampil di beranda.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Tutup"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-sm font-bold text-slate-900">Terima Kasih atas Testimoni Anda!</h4>
                <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                  Testimoni Anda telah kami terima dan akan melalui proses verifikasi oleh tim moderasi sebelum diterbitkan di Marquee Beranda.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Budi Santoso, S.Kom."
                      value={formData.author_name}
                      onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tahun Lulus / Angkatan</label>
                    <input
                      type="text"
                      placeholder="Contoh: 2018"
                      value={formData.graduation_year}
                      onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Jabatan / Profesi</label>
                    <input
                      type="text"
                      placeholder="Contoh: Software Engineer"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Perusahaan / Kampus</label>
                    <input
                      type="text"
                      placeholder="Contoh: Tokopedia / UGM"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rating Kepuasan</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (Sangat Puas - 5 Bintang)</option>
                    <option value={4}>⭐⭐⭐⭐ (Puas - 4 Bintang)</option>
                    <option value={3}>⭐⭐⭐ (Cukup - 3 Bintang)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kesan, Pesan & Pengalaman</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Ceritakan bagaimana MAN 3 Sleman membantu perkembangan karir, studi, atau karakter Anda..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-lg bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold transition-colors disabled:opacity-50"
                  >
                    {submitting ? "Mengirim..." : "Kirim Testimoni"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
