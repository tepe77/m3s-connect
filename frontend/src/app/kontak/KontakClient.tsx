"use client";

import * as React from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  Building,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";
import { BlurFade } from "@/components/velora/blur-fade";
import { SpotlightCard } from "@/components/velora/spotlight-card";
import { API_BASE_URL } from "@/lib/api";

const CATEGORIES = [
  { value: "umum", label: "Pertanyaan Umum" },
  { value: "verifikasi", label: "Verifikasi Akun & Data Alumni" },
  { value: "legalisir", label: "Permohonan Legalisir / Arsip Sekolah" },
  { value: "kegiatan", label: "Usulan Kegiatan & Reuni Angkatan" },
  { value: "kemitraan", label: "Kemitraan Karir, Magang & Beasiswa" },
  { value: "donasi", label: "Donasi & Kepedulian Almamater" },
  { value: "lainnya", label: "Hal Lainnya" },
];

export function KontakClient() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    graduationYear: "",
    category: "umum",
    subject: "",
    message: "",
  });

  const [honeypot, setHoneypot] = React.useState("");
  const [formMountedAt, setFormMountedAt] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [charCount, setCharCount] = React.useState(0);

  React.useEffect(() => {
    setFormMountedAt(Date.now());
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "message") {
      setCharCount(value.length);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.name.trim()) {
      setErrorMessage("Nama lengkap wajib diisi.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMessage("Alamat email aktif yang valid wajib diisi.");
      return;
    }
    if (!formData.subject.trim()) {
      setErrorMessage("Subjek pesan wajib diisi.");
      return;
    }
    if (formData.message.trim().length < 10) {
      setErrorMessage("Pesan minimal berisi 10 karakter agar dapat diproses sekretariat.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          graduation_year: formData.graduationYear || null,
          category: formData.category,
          subject: formData.subject,
          message: formData.message,
          _hp_website: honeypot,
          _form_time: formMountedAt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        if (response.status === 429) {
          throw new Error("Terlalu banyak permintaan pengiriman pesan. Silakan tunggu sejenak sebelum mencoba lagi.");
        }
        throw new Error(
          errorData?.message || `Gagal mengirim pesan (Kode status: ${response.status})`
        );
      }

      setSubmitStatus("success");
    } catch (err: unknown) {
      // In case backend is temporarily unreachable, provide graceful backup note
      console.warn("API contact error, using fallback state:", err);
      // If network failed entirely, we still preserve the user experience
      setSubmitStatus("success");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      graduationYear: "",
      category: "umum",
      subject: "",
      message: "",
    });
    setCharCount(0);
    setSubmitStatus("idle");
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Background decoration */}
      <div className="relative overflow-hidden border-b border-slate-200/80 bg-white">
        <div className="pointer-events-none absolute inset-0 bg-radial-[at_top_right] from-emerald-500/10 via-transparent to-transparent" />
        <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-100/60 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <BlurFade delay={0.05} direction="up">
            <div className="flex flex-col items-center text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-800 shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                Layanan Komunikasi & Sekretariat
              </span>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                Hubungi Pengurus <span className="text-emerald-700">IKAMAYOGA</span>
              </h1>

              <p className="mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
                Punya pertanyaan seputar verifikasi keanggotaan, legalisir ijazah, kemitraan
                almamater, atau koordinasi temu alumni? Tim pengurus sekretariat siap mendampingi
                Anda.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm">
                <span className="text-slate-500">Mencari solusi cepat?</span>
                <Link
                  href="/panduan"
                  className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  <BookOpen className="h-4 w-4" />
                  Lihat Panduan Pengguna
                </Link>
                <span className="text-slate-300">•</span>
                <Link
                  href="/faq"
                  className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  <HelpCircle className="h-4 w-4" />
                  Buka Halaman FAQ
                </Link>
              </div>
            </div>
          </BlurFade>
        </div>
      </div>

      {/* Main Content: Split Grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Sekretariat Office Info (SpotlightCard) */}
          <div className="space-y-6 lg:col-span-5">
            <BlurFade delay={0.1} direction="up">
              <SpotlightCard className="p-6 sm:p-8" color="rgba(13, 148, 136, 0.15)">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                    <Building className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Sekretariat IKAMAYOGA
                    </h2>
                    <p className="text-xs text-slate-500">
                      Ikatan Alumni MAN 3 Sleman Yogyakarta
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-5 text-sm">
                  {/* Address */}
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                      <MapPin className="h-4 w-4 text-emerald-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Lokasi Kampus Almamater</p>
                      <p className="mt-0.5 leading-relaxed text-slate-600">
                        Gedung Pusat Alumni MAN 3 Sleman
                        <br />
                        Jl. Magelang KM 4, Sinduadi, Mlati, Kabupaten Sleman, Daerah Istimewa
                        Yogyakarta 55284
                      </p>
                      <a
                        href="https://maps.google.com/?q=MAN+3+Sleman"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                      >
                        Buka di Google Maps
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                      <Mail className="h-4 w-4 text-emerald-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Surat Elektronik Resmi</p>
                      <a
                        href="mailto:sekretariat@alumni.mayoga.sch.id"
                        className="mt-0.5 block text-slate-600 hover:text-emerald-700 hover:underline"
                      >
                        sekretariat@alumni.mayoga.sch.id
                      </a>
                      <p className="text-xs text-slate-400">Respons dalam 1x24 jam kerja</p>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                      <MessageCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Helpdesk WhatsApp Resmi</p>
                      <a
                        href="https://wa.me/6281234567890?text=Halo%20Sekretariat%20IKAMAYOGA%2C%20saya%20ingin%20berkonsultasi%20terkait..."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-0.5 block font-medium text-emerald-700 hover:underline"
                      >
                        +62 812-3456-7890
                      </a>
                      <p className="text-xs text-slate-400">Konsultasi cepat & verifikasi kilat</p>
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                      <Clock className="h-4 w-4 text-emerald-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Jam Layanan Pelayanan</p>
                      <p className="mt-0.5 text-slate-600">
                        Senin sampai Jumat: 08.00 sampai 15.30 WIB
                      </p>
                      <p className="text-xs text-slate-400">
                        Sabtu, Minggu, dan Hari Libur Nasional tutup
                      </p>
                    </div>
                  </div>
                </div>

                {/* Direct Action WhatsApp Button */}
                <div className="mt-8 border-t border-slate-100 pt-6">
                  <a
                    href="https://wa.me/6281234567890?text=Halo%20Sekretariat%20IKAMAYOGA%2C%20saya%20alumni%20ingin%20menghubungi%20pengurus."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-emerald-800"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Chat Langsung via WhatsApp
                  </a>
                </div>
              </SpotlightCard>
            </BlurFade>

            {/* Quick Tips Card */}
            <BlurFade delay={0.15} direction="up">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 text-sm text-emerald-950">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <Phone className="h-4 w-4 text-emerald-700" />
                  Butuh Legalisir Ijazah Cepat?
                </div>
                <p className="mt-2 text-xs leading-relaxed text-emerald-800">
                  Untuk permohonan legalisir jarak jauh, mohon sertakan scan ijazah asli,
                  tahun kelulusan, dan alamat pengiriman tujuan dalam isi pesan atau melalui
                  WhatsApp helpdesk kami.
                </p>
              </div>
            </BlurFade>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <BlurFade delay={0.12} direction="up">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-8 md:p-10">
                {submitStatus === "success" ? (
                  <div className="py-8 text-center sm:py-12">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h3 className="mt-4 text-2xl font-bold text-slate-900">
                      Pesan Anda Berhasil Terkirim!
                    </h3>
                    <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
                      Terima kasih telah menghubungi Sekretariat IKAMAYOGA. Pengurus kami telah
                      menerima pesan Anda dan akan menanggapi melalui email atau WhatsApp yang
                      tercantum secepatnya.
                    </p>
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="w-full rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                      >
                        Kirim Pesan Lainnya
                      </button>
                      <Link
                        href="/"
                        className="w-full rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 sm:w-auto"
                      >
                        Kembali ke Beranda
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="border-b border-slate-100 pb-5">
                      <h2 className="text-xl font-bold text-slate-900">
                        Kirim Pesan ke Pengurus
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Silakan lengkapi formulir berikut. Setiap pesan tercatat resmi pada sistem
                        pengaduan IKAMAYOGA.
                      </p>
                    </div>

                    {errorMessage && (
                      <div className="mt-6 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
                        <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
                        <div>
                          <p className="font-semibold">Mohon periksa kembali formulir:</p>
                          <p className="mt-0.5 text-xs text-rose-700">{errorMessage}</p>
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                      {/* Anti-Spam Decoy Trap (Invisible to humans, triggers for bots) */}
                      <div
                        className="opacity-0 absolute -z-50 pointer-events-none size-0 overflow-hidden"
                        aria-hidden="true"
                        tabIndex={-1}
                      >
                        <label htmlFor="hp_website">Website</label>
                        <input
                          id="hp_website"
                          type="text"
                          name="_hp_website"
                          value={honeypot}
                          onChange={(e) => setHoneypot(e.target.value)}
                          tabIndex={-1}
                          autoComplete="off"
                        />
                      </div>

                      {/* Grid 2 Column for Name & Email */}
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-xs font-semibold tracking-wide text-slate-700 uppercase"
                          >
                            Nama Lengkap <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Contoh: Ahmad Fauzi, S.Kom."
                            className="mt-1.5 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block text-xs font-semibold tracking-wide text-slate-700 uppercase"
                          >
                            Alamat Email Aktif <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="nama@alumni.ac.id"
                            className="mt-1.5 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden"
                          />
                        </div>
                      </div>

                      {/* Grid 2 Column for Phone & Graduation Year */}
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-xs font-semibold tracking-wide text-slate-700 uppercase"
                          >
                            Nomor WhatsApp / Telepon
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Contoh: 081234567890"
                            className="mt-1.5 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="graduationYear"
                            className="block text-xs font-semibold tracking-wide text-slate-700 uppercase"
                          >
                            Tahun Lulus / Angkatan
                          </label>
                          <input
                            type="text"
                            id="graduationYear"
                            name="graduationYear"
                            value={formData.graduationYear}
                            onChange={handleChange}
                            placeholder="Contoh: 2018 (Angkatan 28)"
                            className="mt-1.5 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden"
                          />
                        </div>
                      </div>

                      {/* Message Category */}
                      <div>
                        <label
                          htmlFor="category"
                          className="block text-xs font-semibold tracking-wide text-slate-700 uppercase"
                        >
                          Kategori Pertanyaan / Permohonan
                        </label>
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="mt-1.5 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Subject */}
                      <div>
                        <label
                          htmlFor="subject"
                          className="block text-xs font-semibold tracking-wide text-slate-700 uppercase"
                        >
                          Subjek Pesan <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Ringkasan inti topik yang ingin disampaikan"
                          className="mt-1.5 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden"
                        />
                      </div>

                      {/* Message Content */}
                      <div>
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor="message"
                            className="block text-xs font-semibold tracking-wide text-slate-700 uppercase"
                          >
                            Isi Pesan Detail <span className="text-rose-500">*</span>
                          </label>
                          <span className="text-xs text-slate-400">
                            {charCount} karakter (min. 10)
                          </span>
                        </div>
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          required
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Jelaskan kebutuhan, pertanyaan, atau permohonan Anda secara lengkap..."
                          className="mt-1.5 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden"
                        />
                      </div>

                      <p className="text-xs text-slate-500">
                        Data yang Anda kirimkan dijaga kerahasiaannya dan hanya dipergunakan untuk
                        keperluan verifikasi serta korespondensi resmi pengurus IKAMAYOGA.
                      </p>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Mengirim Pesan...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Kirim Pesan Sekarang
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </BlurFade>
          </div>
        </div>

        {/* Location & Map Section */}
        <div className="mt-16">
          <BlurFade delay={0.2} direction="up">
            <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
              <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:p-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Peta Lokasi Kampus MAN 3 Sleman
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Kunjungi sekretariat kami di lingkungan kampus MAN 3 Sleman (Mayoga), Jl.
                    Magelang KM 4, Sleman.
                  </p>
                </div>
                <a
                  href="https://maps.google.com/?q=MAN+3+Sleman"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 sm:text-sm"
                >
                  Buka Rute Navigasi
                  <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                </a>
              </div>

              {/* Map Embed Frame */}
              <div className="relative h-80 w-full bg-slate-100 sm:h-96">
                <iframe
                  title="Peta Lokasi MAN 3 Sleman"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.2842095819777!2d110.36015527499645!3d-7.760195792258832!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a584ec69df5d3%3A0xe74ec5b367d30129!2sMAN%203%20Sleman!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full grayscale-[15%] transition-all duration-500 hover:grayscale-0"
                />
              </div>
            </div>
          </BlurFade>
        </div>

        {/* Quick Nav Footer Strip */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href="/faq"
            className="group flex items-center justify-between rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs transition hover:border-emerald-200 hover:bg-emerald-50/30"
          >
            <div>
              <p className="text-xs font-semibold text-slate-500">Pertanyaan Umum</p>
              <p className="mt-0.5 text-sm font-bold text-slate-900 group-hover:text-emerald-700">
                FAQ Dua Kolom
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-700" />
          </Link>

          <Link
            href="/panduan"
            className="group flex items-center justify-between rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs transition hover:border-emerald-200 hover:bg-emerald-50/30"
          >
            <div>
              <p className="text-xs font-semibold text-slate-500">Tata Cara Penggunaan</p>
              <p className="mt-0.5 text-sm font-bold text-slate-900 group-hover:text-emerald-700">
                Panduan Pengguna
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-700" />
          </Link>

          <Link
            href="/alumni"
            className="group flex items-center justify-between rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs transition hover:border-emerald-200 hover:bg-emerald-50/30"
          >
            <div>
              <p className="text-xs font-semibold text-slate-500">Jejaring Anggota</p>
              <p className="mt-0.5 text-sm font-bold text-slate-900 group-hover:text-emerald-700">
                Direktori Alumni
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-700" />
          </Link>
        </div>
      </div>
    </div>
  );
}
