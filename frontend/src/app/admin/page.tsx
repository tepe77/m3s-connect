"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Users,
  FolderTree,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  Edit3,
  Trash2,
  Lock,
  Search,
  ArrowLeft,
  Clock,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Eye,
  FileCheck,
  Check,
  X,
  Palette,
  Sliders,
} from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

import {
  getAdminCategories,
  saveAdminCategory,
  deleteAdminCategory,
  getAdminReports,
  resolveAdminReport,
  getAdminVerifications,
  approveAlumniVerification,
  rejectAlumniVerification,
  ModerationReport,
  AlumniVerificationItem,
} from "@/data/adminData";
import { ForumCategoryData } from "@/data/forumData";

const PRESET_COLORS = [
  { name: "Toska Mayoga", hex: "#0D9488" },
  { name: "Biru Profesional", hex: "#2563EB" },
  { name: "Emas Reuni", hex: "#D97706" },
  { name: "Hijau Bisnis", hex: "#059669" },
  { name: "Merah Teknologi", hex: "#DC2626" },
  { name: "Ungu Akademik", hex: "#7C3AED" },
];

const PRESET_COVERS = [
  { name: "Gerbang Madrasah", url: "/images/hero-man3-sleman.jpg" },
  { name: "Dokumentasi Wisuda", url: "/images/doc-wisuda.jpg" },
  { name: "Bakti Sosial", url: "/images/doc-baksos.jpg" },
  { name: "Kegiatan Reuni", url: "/images/news-reuni.jpg" },
  { name: "Prestasi Internasional", url: "/images/news-internasional.jpg" },
  { name: "Peluncuran Buletin", url: "/images/news-peluncuran.jpg" },
];

export default function AdminModerationPage() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; role: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Data states
  const [categories, setCategories] = useState<ForumCategoryData[]>([]);
  const [reports, setReports] = useState<ModerationReport[]>([]);
  const [verifications, setVerifications] = useState<AlumniVerificationItem[]>([]);

  // Filter states
  const [verificationFilter, setVerificationFilter] = useState<string>("all");
  const [verificationSearch, setVerificationSearch] = useState("");
  const [reportFilter, setReportFilter] = useState<string>("all");

  // Category Dialog States
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ForumCategoryData | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryColor, setCategoryColor] = useState("#0D9488");
  const [categoryImage, setCategoryImage] = useState("/images/hero-man3-sleman.jpg");
  const [categorySortOrder, setCategorySortOrder] = useState<number>(1);

  // Verification Dialog States
  const [selectedVerification, setSelectedVerification] = useState<AlumniVerificationItem | null>(null);
  const [rejectReasonModalOpen, setRejectReasonModalOpen] = useState(false);
  const [targetRejectId, setTargetRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Report Resolution Dialog States
  const [selectedReport, setSelectedReport] = useState<ModerationReport | null>(null);
  const [reportActionModalOpen, setReportActionModalOpen] = useState(false);
  const [reportActionType, setReportActionType] = useState<"lock" | "takedown" | "dismiss">("lock");

  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const loadAllData = () => {
    setCategories(getAdminCategories());
    setReports(getAdminReports());
    setVerifications(getAdminVerifications());
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("m3s_user");
      if (stored) {
        const u = JSON.parse(stored);
        setCurrentUser(u);
      }
    } catch {
      setCurrentUser(null);
    } finally {
      loadAllData();
      setLoading(false);
    }

    const handleUpdate = () => loadAllData();
    window.addEventListener("m3s_admin_data_change", handleUpdate);
    return () => window.removeEventListener("m3s_admin_data_change", handleUpdate);
  }, []);

  const showToast = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  // Helper stats
  const pendingVerificationsCount = verifications.filter((v) => v.status === "pending").length;
  const pendingReportsCount = reports.filter((r) => r.status === "pending" || r.status === "reviewing").length;
  const activeCategoriesCount = categories.length;

  // Filtered verifications
  const filteredVerifications = verifications.filter((v) => {
    if (verificationFilter !== "all" && v.status !== verificationFilter) return false;
    if (verificationSearch.trim()) {
      const q = verificationSearch.toLowerCase();
      return (
        v.name.toLowerCase().includes(q) ||
        v.email.toLowerCase().includes(q) ||
        v.diplomaNumber.toLowerCase().includes(q) ||
        v.graduationClass.toLowerCase().includes(q) ||
        v.graduationYear.toString().includes(q)
      );
    }
    return true;
  });

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    if (reportFilter === "pending") return r.status === "pending" || r.status === "reviewing";
    if (reportFilter === "resolved") return r.status === "resolved";
    if (reportFilter === "rejected") return r.status === "rejected";
    return true;
  });

  // Category Actions
  const handleOpenCategoryModal = (cat?: ForumCategoryData) => {
    if (cat) {
      setEditingCategory(cat);
      setCategoryName(cat.name);
      setCategoryDescription(cat.description);
      setCategoryColor(cat.color);
      setCategoryImage(cat.image);
      setCategorySortOrder(cat.sortOrder);
    } else {
      setEditingCategory(null);
      setCategoryName("");
      setCategoryDescription("");
      setCategoryColor("#0D9488");
      setCategoryImage("/images/hero-man3-sleman.jpg");
      setCategorySortOrder(categories.length + 1);
    }
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    const slug = editingCategory
      ? editingCategory.slug
      : categoryName
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");

    const newCat: ForumCategoryData = {
      id: editingCategory ? editingCategory.id : `cat-${Date.now()}`,
      name: categoryName.trim(),
      slug,
      description: categoryDescription.trim(),
      color: categoryColor,
      icon: editingCategory ? editingCategory.icon : "chat",
      image: categoryImage,
      sortOrder: categorySortOrder,
      topicCount: editingCategory ? editingCategory.topicCount : 0,
      postCount: editingCategory ? editingCategory.postCount : 0,
    };

    saveAdminCategory(newCat);
    setCategoryModalOpen(false);
    showToast(editingCategory ? "Kategori forum berhasil diperbarui." : "Kategori forum baru berhasil ditambahkan.");
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus kategori "${name}"? Tindakan ini aman jika belum ada topik terikat.`)) {
      deleteAdminCategory(id);
      showToast(`Kategori "${name}" telah dihapus.`);
    }
  };

  // Verification Actions
  const handleApproveVerification = (id: string, name: string) => {
    approveAlumniVerification(id);
    showToast(`Data alumni atas nama ${name} berhasil diverifikasi dan disetujui.`);
    setSelectedVerification(null);
  };

  const handleOpenRejectModal = (id: string) => {
    setTargetRejectId(id);
    setRejectReason("Data ijazah belum sesuai dengan catatan buku induk madrasah.");
    setRejectReasonModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (targetRejectId) {
      rejectAlumniVerification(targetRejectId, rejectReason);
      showToast("Pendaftaran alumni telah ditolak dengan catatan alasan.");
      setRejectReasonModalOpen(false);
      setTargetRejectId(null);
      setSelectedVerification(null);
    }
  };

  // Report Actions
  const handleOpenReportActionModal = (report: ModerationReport, action: "lock" | "takedown" | "dismiss") => {
    setSelectedReport(report);
    setReportActionType(action);
    setReportActionModalOpen(true);
  };

  const handleExecuteReportAction = () => {
    if (!selectedReport) return;

    const staffName = currentUser?.name || "Moderator Komunitas";

    if (reportActionType === "lock") {
      resolveAdminReport(selectedReport.id, "resolved", "Kunci Topik & Peringatkan Penulis", staffName);
      showToast("Topik berhasil dikunci dan laporan diselesaikan.");
    } else if (reportActionType === "takedown") {
      resolveAdminReport(selectedReport.id, "resolved", "Hapus Konten dari Komunitas", staffName);
      showToast("Konten spam berhasil dihapus dan laporan diselesaikan.");
    } else {
      resolveAdminReport(selectedReport.id, "rejected", "Ditolak / Laporan Tidak Terbukti", staffName);
      showToast("Laporan telah diabaikan.");
    }

    setReportActionModalOpen(false);
    setSelectedReport(null);
  };

  // Access check
  const isStaff = currentUser?.role === "admin" || currentUser?.role === "moderator";

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-slate-500">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin mx-auto mb-3" />
        <p>Memeriksa otentikasi staf...</p>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-10 bg-slate-50/60 min-h-screen">
      <Container size="wide">
        {/* Toast Notification */}
        {notificationMsg && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-xl flex items-center gap-3 animate-fade-in border border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notificationMsg}</span>
          </div>
        )}

        {/* Access Warning Header (Only shown if tester is logged in as regular user) */}
        {!isStaff && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Akun aktif Anda saat ini ({currentUser?.name || "Tamu"}) belum memiliki peran Administrator/Moderator.
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const simulatedStaff = {
                  id: "staff-simulated",
                  name: "Administrator M3S",
                  email: "admin@m3s-connect.id",
                  role: "admin",
                  status: "active",
                };
                localStorage.setItem("m3s_user", JSON.stringify(simulatedStaff));
                setCurrentUser(simulatedStaff);
                showToast("Beralih ke sesi Administrator untuk pengetesan panel.");
              }}
              className="rounded-full bg-white text-amber-900 border-amber-300 text-xs font-bold"
            >
              Aktifkan Sesi Admin (Demo)
            </Button>
          </div>
        )}

        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="emerald" className="gap-1 font-bold text-[11px] px-2.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{currentUser?.role === "admin" ? "Administrator Utama" : "Moderator Komunitas"}</span>
              </Badge>
              <span className="text-xs text-slate-400 font-mono">
                {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Pusat Moderasi & Administrasi M3S
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Kelola kategori diskusi forum, tindak lanjuti laporan spam komunitas, dan verifikasi data alumni baru.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="http://localhost:8000/admin"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center min-h-[36px] px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-full transition-colors gap-1.5 shadow-xs"
              title="Buka Panel Filament di Backend Laravel"
            >
              <span>Panel Backend Filament ↗</span>
            </a>

            <Button asChild variant="outline" size="sm" className="rounded-full gap-1.5 text-xs font-semibold h-9">
              <Link href="/forum">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Ke Forum Publik</span>
              </Link>
            </Button>

            <Button asChild variant="outline" size="sm" className="rounded-full gap-1.5 text-xs font-semibold h-9">
              <Link href="/dashboard">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Dashboard Anggota</span>
              </Link>
            </Button>

            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => {
                loadAllData();
                showToast("Data moderasi berhasil diperbarui dari sistem.");
              }}
              className="rounded-full gap-1.5 text-xs font-bold h-9 shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Segarkan Data</span>
            </Button>
          </div>
        </div>

        {/* Top KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Pending Verifications */}
          <Card className="bg-white border-slate-200 shadow-2xs">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Verifikasi Tertunda</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-slate-900 font-mono">
                    {pendingVerificationsCount}
                  </span>
                  <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Perlu Ditinjau
                  </span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                <Users className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Spam & Content Reports */}
          <Card className="bg-white border-slate-200 shadow-2xs">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Laporan Konten & Spam</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-slate-900 font-mono">
                    {pendingReportsCount}
                  </span>
                  <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                    Antrean Aktif
                  </span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Forum Categories */}
          <Card className="bg-white border-slate-200 shadow-2xs">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Kategori Forum</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-slate-900 font-mono">
                    {activeCategoriesCount}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Aktif Tayang
                  </span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <FolderTree className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Integrity Status */}
          <Card className="bg-white border-slate-200 shadow-2xs">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Integritas Komunitas</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-emerald-600 font-mono">
                    100%
                  </span>
                  <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                    Aman
                  </span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs Navigation */}
        <Tabs defaultValue="alumni" className="space-y-6">
          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <TabsList className="bg-slate-100/90 h-10 p-1">
              <TabsTrigger value="alumni" className="rounded-xl px-4 text-xs font-bold gap-2">
                <Users className="w-3.5 h-3.5" />
                <span>Verifikasi Alumni Baru</span>
                {pendingVerificationsCount > 0 && (
                  <Badge variant="amber" className="h-5 px-1.5 text-[10px]">
                    {pendingVerificationsCount}
                  </Badge>
                )}
              </TabsTrigger>

              <TabsTrigger value="reports" className="rounded-xl px-4 text-xs font-bold gap-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Laporan Spam & Konten</span>
                {pendingReportsCount > 0 && (
                  <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
                    {pendingReportsCount}
                  </Badge>
                )}
              </TabsTrigger>

              <TabsTrigger value="categories" className="rounded-xl px-4 text-xs font-bold gap-2">
                <FolderTree className="w-3.5 h-3.5" />
                <span>Kelola Kategori Forum</span>
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                  {categories.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <span className="text-[11px] text-slate-400 font-medium px-3 hidden md:inline">
              M3S Connect v2.4 Moderation Suite
            </span>
          </div>

          {/* ==================================================== */}
          {/* TAB 1: ALUMNI VERIFICATIONS                          */}
          {/* ==================================================== */}
          <TabsContent value="alumni" className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <Button
                  type="button"
                  variant={verificationFilter === "all" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setVerificationFilter("all")}
                  className="rounded-full text-xs font-bold h-8 px-3.5"
                >
                  Semua ({verifications.length})
                </Button>
                <Button
                  type="button"
                  variant={verificationFilter === "pending" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setVerificationFilter("pending")}
                  className="rounded-full text-xs font-bold h-8 px-3.5 text-amber-700 hover:bg-amber-50"
                >
                  Menunggu ({pendingVerificationsCount})
                </Button>
                <Button
                  type="button"
                  variant={verificationFilter === "active" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setVerificationFilter("active")}
                  className="rounded-full text-xs font-bold h-8 px-3.5 text-emerald-700 hover:bg-emerald-50"
                >
                  Terverifikasi ({verifications.filter((v) => v.status === "active").length})
                </Button>
              </div>

              <div className="relative sm:w-64">
                <Input
                  type="text"
                  placeholder="Cari nama, email, nomor ijazah..."
                  value={verificationSearch}
                  onChange={(e) => setVerificationSearch(e.target.value)}
                  className="h-8 pl-8 pr-3 text-xs rounded-full border-slate-200"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Verification Table / Cards */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Calon Alumni</th>
                      <th className="py-3 px-4">Angkatan & Kelas</th>
                      <th className="py-3 px-4">No. Ijazah / Dokumen</th>
                      <th className="py-3 px-4">Pekerjaan & Kota</th>
                      <th className="py-3 px-4">Status Akun</th>
                      <th className="py-3 px-4 text-right">Aksi Verifikasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredVerifications.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          Tidak ada data pendaftaran alumni yang cocok dengan filter.
                        </td>
                      </tr>
                    ) : (
                      filteredVerifications.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-9 h-9 rounded-full overflow-hidden bg-slate-100 ring-1 ring-slate-200 shrink-0">
                                <Image src={item.avatar} alt={item.name} fill className="object-cover" />
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-900 leading-tight">{item.name}</h4>
                                <span className="text-[11px] text-slate-500">{item.email}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <Badge variant="emerald" className="text-[10px] font-bold px-2 py-0">
                              Alumni &apos;{item.graduationYear.toString().slice(-2)}
                            </Badge>
                            <span className="block text-[11px] text-slate-500 mt-0.5">{item.graduationClass}</span>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                            <span className="bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                              {item.diplomaNumber}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-slate-600">
                            <p className="font-medium text-slate-800">{item.occupation}</p>
                            <span className="text-[11px] text-slate-400">{item.company} • {item.currentCity}</span>
                          </td>

                          <td className="py-3.5 px-4">
                            {item.status === "pending" && (
                              <Badge variant="amber" className="text-[10px] font-bold">
                                Menunggu Verifikasi
                              </Badge>
                            )}
                            {item.status === "active" && (
                              <div>
                                <Badge variant="emerald" className="text-[10px] font-bold">
                                  Terverifikasi
                                </Badge>
                                {item.alumniIdentifier && (
                                  <span className="block text-[10px] font-mono text-emerald-700 font-bold mt-0.5">
                                    {item.alumniIdentifier}
                                  </span>
                                )}
                              </div>
                            )}
                            {item.status === "suspended" && (
                              <Badge variant="destructive" className="text-[10px] font-bold">
                                Ditolak
                              </Badge>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {item.status === "pending" ? (
                                <>
                                  <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => handleApproveVerification(item.id, item.name)}
                                    className="h-7 px-2.5 rounded-full text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                                    title="Setujui pendaftaran dan terbitkan NPA"
                                  >
                                    <Check className="w-3 h-3" />
                                    <span>Setujui</span>
                                  </Button>

                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleOpenRejectModal(item.id)}
                                    className="h-7 px-2.5 rounded-full text-[11px] font-bold text-rose-600 border-rose-200 hover:bg-rose-50 gap-1"
                                    title="Tolak pendaftaran dengan alasan"
                                  >
                                    <X className="w-3 h-3" />
                                    <span>Tolak</span>
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedVerification(item)}
                                  className="h-7 px-2.5 text-xs text-slate-500 hover:text-slate-800"
                                >
                                  Detail Data
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* ==================================================== */}
          {/* TAB 2: SPAM & CONTENT MODERATION                     */}
          {/* ==================================================== */}
          <TabsContent value="reports" className="space-y-4">
            {/* Filter Bar */}
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <Button
                  type="button"
                  variant={reportFilter === "all" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setReportFilter("all")}
                  className="rounded-full text-xs font-bold h-8 px-3.5"
                >
                  Semua Laporan ({reports.length})
                </Button>
                <Button
                  type="button"
                  variant={reportFilter === "pending" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setReportFilter("pending")}
                  className="rounded-full text-xs font-bold h-8 px-3.5 text-rose-600 hover:bg-rose-50"
                >
                  Perlu Ditindak ({pendingReportsCount})
                </Button>
                <Button
                  type="button"
                  variant={reportFilter === "resolved" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setReportFilter("resolved")}
                  className="rounded-full text-xs font-bold h-8 px-3.5 text-emerald-700 hover:bg-emerald-50"
                >
                  Selesai Ditangani ({reports.filter((r) => r.status === "resolved").length})
                </Button>
                <Button
                  type="button"
                  variant={reportFilter === "rejected" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setReportFilter("rejected")}
                  className="rounded-full text-xs font-bold h-8 px-3.5 text-slate-600 hover:bg-slate-100"
                >
                  Laporan Ditolak ({reports.filter((r) => r.status === "rejected").length})
                </Button>
              </div>

              <span className="text-xs text-slate-400">
                Laporan spam direspon dalam target waktu &lt; 2 jam.
              </span>
            </div>

            {/* Reports Stream */}
            <div className="space-y-4">
              {filteredReports.length === 0 ? (
                <Card className="p-12 text-center text-slate-400 border-slate-200">
                  <ShieldCheck className="w-10 h-10 mx-auto mb-2 text-emerald-500/60" />
                  <p className="text-sm font-semibold text-slate-700">Tidak ada laporan konten yang perlu ditindaklanjuti.</p>
                  <p className="text-xs text-slate-400 mt-1">Komunitas saat ini berada dalam kondisi aman dan bersih dari spam.</p>
                </Card>
              ) : (
                filteredReports.map((report) => (
                  <Card
                    key={report.id}
                    className={`border transition-all ${
                      report.status === "pending"
                        ? "bg-white border-rose-200 ring-1 ring-rose-500/10 shadow-xs"
                        : "bg-white border-slate-200 shadow-2xs"
                    }`}
                  >
                    <CardContent className="p-5 sm:p-6 space-y-3.5">
                      {/* Report Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant={
                              report.reason === "spam"
                                ? "destructive"
                                : report.reason === "impersonation"
                                ? "amber"
                                : "secondary"
                            }
                            className="text-[10px] font-bold uppercase tracking-wider"
                          >
                            {report.reason === "spam"
                              ? "Spam / Iklan Terlarang"
                              : report.reason === "impersonation"
                              ? "Identitas Palsu"
                              : report.reason === "hate_speech"
                              ? "Ujaran Kebencian"
                              : "Pelanggaran Etika"}
                          </Badge>

                          <Badge variant="outline" className="text-[10px] text-slate-500 bg-slate-50 font-mono">
                            Tipe: {report.reportableType.toUpperCase()}
                          </Badge>

                          <span className="text-xs text-slate-400">
                            Dilaporkan oleh <strong className="text-slate-700">{report.reporterName}</strong> ({report.reporterRole})
                          </span>
                        </div>

                        <div>
                          {report.status === "pending" && (
                            <Badge variant="destructive" className="text-[10px] font-bold">
                              Menunggu Tindakan
                            </Badge>
                          )}
                          {report.status === "reviewing" && (
                            <Badge variant="blue" className="text-[10px] font-bold">
                              Dalam Peninjauan
                            </Badge>
                          )}
                          {report.status === "resolved" && (
                            <Badge variant="emerald" className="text-[10px] font-bold">
                              Telah Diselesaikan
                            </Badge>
                          )}
                          {report.status === "rejected" && (
                            <Badge variant="secondary" className="text-[10px] font-bold">
                              Laporan Ditolak
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Content Target Title */}
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {report.contentTitle}
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          Penulis konten: <strong className="text-slate-700">{report.authorName}</strong>
                        </span>
                      </div>

                      {/* Reported Content Snippet */}
                      <div className="p-3.5 rounded-xl bg-slate-50 border-l-2 border-rose-500 text-xs text-slate-700 font-mono">
                        &quot;{report.contentSnippet}&quot;
                      </div>

                      {/* Reporter's Reason Note */}
                      {report.description && (
                        <p className="text-xs text-slate-600 italic bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/60">
                          Catatan pelapor: {report.description}
                        </p>
                      )}

                      {/* Resolution Log if resolved */}
                      {report.resolvedAt && (
                        <div className="text-[11px] text-emerald-800 bg-emerald-50/70 p-2 rounded-lg border border-emerald-200 flex items-center justify-between">
                          <span>
                            Tindakan: <strong>{report.actionTaken}</strong> oleh {report.resolverName}
                          </span>
                          <span>
                            {new Date(report.resolvedAt).toLocaleString("id-ID")}
                          </span>
                        </div>
                      )}

                      {/* Actions Bar */}
                      {report.status === "pending" && (
                        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Dilaporkan {new Date(report.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
                          </span>

                          <div className="flex flex-wrap items-center gap-2">
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => handleOpenReportActionModal(report, "lock")}
                              className="h-8 px-3.5 rounded-full text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white gap-1.5"
                            >
                              <Lock className="w-3.5 h-3.5" />
                              <span>Kunci Topik</span>
                            </Button>

                            <Button
                              type="button"
                              size="sm"
                              onClick={() => handleOpenReportActionModal(report, "takedown")}
                              className="h-8 px-3.5 rounded-full text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white gap-1.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Takedown / Hapus</span>
                            </Button>

                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenReportActionModal(report, "dismiss")}
                              className="h-8 px-3.5 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100"
                            >
                              <span>Abaikan Laporan</span>
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* ==================================================== */}
          {/* TAB 3: FORUM CATEGORIES MANAGEMENT                  */}
          {/* ==================================================== */}
          <TabsContent value="categories" className="space-y-4">
            {/* Top Action Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Kategori Forum Diskusi</h3>
                <p className="text-xs text-slate-500">
                  Kelola ruang diskusi, warna tema, banner visual cover madrasah, dan urutan tampil.
                </p>
              </div>

              <Button
                type="button"
                onClick={() => handleOpenCategoryModal()}
                className="rounded-full px-4 h-9 text-xs font-bold gap-1.5 shadow-xs shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Kategori Baru</span>
              </Button>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((cat) => (
                <Card key={cat.id} className="overflow-hidden border-slate-200 shadow-2xs bg-white hover:border-slate-300 transition-all flex flex-col">
                  {/* Category Image Cover */}
                  <div className="relative h-32 w-full bg-slate-100">
                    <Image
                      src={cat.image || "/images/hero-man3-sleman.jpg"}
                      alt={cat.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-xs shrink-0 shadow-xs" style={{ backgroundColor: cat.color }} />
                        <h4 className="text-sm font-bold text-white drop-shadow-xs">{cat.name}</h4>
                      </div>
                      <Badge variant="outline" className="bg-slate-900/70 border-white/20 text-white font-mono text-[10px]">
                        Urutan #{cat.sortOrder}
                      </Badge>
                    </div>
                  </div>

                  {/* Category Content */}
                  <CardContent className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {cat.description || "Tidak ada deskripsi tambahan."}
                    </p>

                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                        <span>Slug: <strong className="text-slate-800">{cat.slug}</strong></span>
                        <span>{cat.topicCount} Topik</span>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <Link
                          href={`/forum?category=${cat.slug}`}
                          className="text-[11px] font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                        >
                          <span>Buka Forum</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>

                        <div className="flex items-center gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenCategoryModal(cat)}
                            className="h-7 px-2.5 rounded-lg text-xs font-medium gap-1 text-slate-700 hover:text-emerald-700"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCategory(cat.id, cat.name)}
                            className="h-7 w-7 p-0 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            title="Hapus Kategori"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* ==================================================== */}
        {/* MODAL: ADD / EDIT FORUM CATEGORY                     */}
        {/* ==================================================== */}
        <Dialog open={categoryModalOpen} onOpenChange={setCategoryModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Perbarui Kategori Forum" : "Tambah Kategori Forum Baru"}
              </DialogTitle>
              <DialogDescription>
                Sesuaikan nama, identitas warna tema, gambar cover, dan urutan kategori forum.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveCategory} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Nama Kategori</Label>
                <Input
                  type="text"
                  required
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Misal: Info Karir & Magang"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Deskripsi Singkat</Label>
                <Textarea
                  rows={2}
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  placeholder="Penjelasan ruang lingkup diskusi kategori ini..."
                  className="text-xs"
                />
              </div>

              {/* Color Presets */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Warna Identitas Kategori</span>
                  <span className="font-mono text-[11px] text-slate-500">{categoryColor}</span>
                </Label>
                <div className="flex flex-wrap items-center gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setCategoryColor(c.hex)}
                      className={`h-7 px-2.5 rounded-lg text-[11px] font-bold text-white flex items-center gap-1.5 transition-transform ${
                        categoryColor === c.hex ? "ring-2 ring-slate-900 scale-105" : "opacity-85 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cover Image Presets */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Gambar Cover Banner</Label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_COVERS.map((img) => (
                    <button
                      key={img.url}
                      type="button"
                      onClick={() => setCategoryImage(img.url)}
                      className={`relative h-14 rounded-lg overflow-hidden border-2 text-left transition-all ${
                        categoryImage === img.url ? "border-emerald-600 ring-2 ring-emerald-500/20" : "border-slate-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image src={img.url} alt={img.name} fill className="object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-slate-950/70 text-[9px] text-white px-1 truncate">
                        {img.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Urutan Tampil (Sort Order)</Label>
                <Input
                  type="number"
                  min={1}
                  max={99}
                  value={categorySortOrder}
                  onChange={(e) => setCategorySortOrder(Number(e.target.value))}
                  className="text-xs w-28"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setCategoryModalOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" size="sm" className="px-5">
                  Simpan Kategori
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* ==================================================== */}
        {/* MODAL: REJECT ALUMNI WITH REASON                     */}
        {/* ==================================================== */}
        <Dialog open={rejectReasonModalOpen} onOpenChange={setRejectReasonModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tolak Pendaftaran Calon Alumni</DialogTitle>
              <DialogDescription>
                Berikan catatan atau alasan penolakan agar calon alumni dapat mengajukan banding atau revisi dokumen.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2">
              <Label className="text-xs font-bold text-slate-700">Alasan Penolakan</Label>
              <Textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Misal: Nomor Ijazah tidak terdaftar di angkatan 2018..."
                className="text-xs"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setRejectReasonModalOpen(false)}>
                Batal
              </Button>
              <Button type="button" variant="destructive" size="sm" onClick={handleConfirmReject}>
                Konfirmasi Penolakan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ==================================================== */}
        {/* MODAL: REPORT RESOLUTION CONFIRMATION                */}
        {/* ==================================================== */}
        <Dialog open={reportActionModalOpen} onOpenChange={setReportActionModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Konfirmasi Tindakan Laporan</DialogTitle>
              <DialogDescription>
                {reportActionType === "lock" && "Topik diskusi akan dikunci sehingga balasan baru tidak dapat dikirimkan."}
                {reportActionType === "takedown" && "Konten spam akan dihapus secara permanen dari basis data komunitas."}
                {reportActionType === "dismiss" && "Laporan akan ditutup sebagai tidak terbukti / diabaikan."}
              </DialogDescription>
            </DialogHeader>

            {selectedReport && (
              <div className="p-3 rounded-xl bg-slate-50 text-xs border border-slate-200 space-y-1">
                <p className="font-bold text-slate-800">{selectedReport.contentTitle}</p>
                <p className="text-slate-500 italic">&quot;{selectedReport.contentSnippet}&quot;</p>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setReportActionModalOpen(false)}>
                Batal
              </Button>
              <Button
                type="button"
                variant={reportActionType === "dismiss" ? "secondary" : "destructive"}
                size="sm"
                onClick={handleExecuteReportAction}
              >
                Jalankan Tindakan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Container>
    </div>
  );
}
