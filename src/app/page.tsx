"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useConvexAuth } from "convex/react";
import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import {
  Wifi, BarChart3, QrCode, Gift, MapPin, Zap,
  ChevronRight, Leaf, ArrowRight, CheckCircle2, LayoutDashboard
} from "lucide-react";

const BinScene = dynamic(() => import("@/components/3d/BinScene"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full border-2 border-green-600 border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-green-600 text-sm">Loading 3D Model...</p>
      </div>
    </div>
  ),
});

const features = [
  {
    icon: MapPin,
    title: "Cari SmartBin Terdekat",
    desc: "Lihat lokasi SmartBin di sekitarmu di peta — lengkap dengan status kosong, sedang, atau penuh secara real-time.",
    color: "text-[#b3cdb6]",
    bg: "bg-[#1c2620]/60 border-[#84a98c]/20",
  },
  {
    icon: QrCode,
    title: "Scan & Dapat Poin Instan",
    desc: "Buang sampah, scan QR yang muncul di layar SmartBin — eco-points langsung masuk ke akunmu, tanpa antre, tanpa ribet.",
    color: "text-[#b3cdb6]",
    bg: "bg-[#1c2620]/60 border-[#84a98c]/20",
  },
  {
    icon: Gift,
    title: "Tukar Reward Asli",
    desc: "Kumpulkan poin dan tukarkan dengan voucher TransJakarta, Grab, GoFood, Indomaret, atau saldo DANA.",
    color: "text-amber-300",
    bg: "bg-amber-900/15 border-amber-900/25",
  },
  {
    icon: Wifi,
    title: "Sampah Tak Pernah Meluber",
    desc: "Sensor IoT memberi tahu petugas tepat sebelum SmartBin penuh. Lingkunganmu tetap rapi sepanjang hari.",
    color: "text-[#b3cdb6]",
    bg: "bg-[#1c2620]/60 border-[#84a98c]/20",
  },
  {
    icon: BarChart3,
    title: "Dampak yang Bisa Diukur",
    desc: "Lihat berapa banyak sampah yang sudah kamu salurkan dengan benar — kontribusimu nyata, terdokumentasi.",
    color: "text-[#b3cdb6]",
    bg: "bg-[#1c2620]/60 border-[#84a98c]/20",
  },
  {
    icon: Zap,
    title: "Validasi Anti-Curang",
    desc: "Sensor berat & volume memastikan poin hanya diberikan saat sampah benar-benar masuk. Adil untuk semua.",
    color: "text-[#b3cdb6]",
    bg: "bg-[#1c2620]/60 border-[#84a98c]/20",
  },
];

const steps = [
  { num: "01", title: "Datangi SmartBin", desc: "Cek peta di aplikasi atau temukan SmartBin terdekat di area publik." },
  { num: "02", title: "Buang Sampahmu", desc: "Masukkan sampah seperti biasa. Sensor otomatis mendeteksi dan mengonfirmasi." },
  { num: "03", title: "Scan QR Code", desc: "QR unik muncul di layar SmartBin — buka aplikasi dan arahkan kamera." },
  { num: "04", title: "Nikmati Reward", desc: "10 eco-points masuk ke akunmu. Tukarkan kapan saja dengan reward favoritmu." },
];

const rewards = [
  { emoji: "🚌", name: "TransJakarta", discount: "50% off" },
  { emoji: "🛵", name: "Grab/Gojek", discount: "Voucher Rp 20rb" },
  { emoji: "🛒", name: "Indomaret", discount: "Belanja Rp 25rb" },
  { emoji: "🍜", name: "GoFood", discount: "Diskon Rp 15rb" },
  { emoji: "🎬", name: "Bioskop XXI", discount: "1 Tiket Gratis" },
  { emoji: "💰", name: "DANA", discount: "Saldo Rp 10rb" },
];

export default function HomePage() {
  const { isAuthenticated } = useConvexAuth();

  // Live fill-level demo: cycles slowly for the hero scene.
  const [fill, setFill] = useState(45);
  useEffect(() => {
    const id = setInterval(() => {
      setFill((f) => {
        const next = f + 7;
        return next > 92 ? 18 : next;
      });
    }, 2400);
    return () => clearInterval(id);
  }, []);

  const fillLabel =
    fill >= 80 ? "PENUH" : fill >= 60 ? "TINGGI" : fill >= 35 ? "SEDANG" : "AMAN";
  const fillTone =
    fill >= 80
      ? "text-red-300 border-red-500/30"
      : fill >= 60
        ? "text-amber-300 border-amber-400/30"
        : "text-[#b3cdb6] border-[#84a98c]/25";

  return (
    <main className="min-h-screen bg-[#0e1411] overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-16">
        {/* very subtle dot grid — no neon */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(132,169,140,0.06)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#84a98c]/[0.04] rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-4rem)]">
            <div className="space-y-6 py-12 lg:py-0">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#84a98c]/25 bg-[#1c2620]/60 text-[#b3cdb6] text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#84a98c]" />
                IoT-Based Smart Waste Management
              </div>
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold leading-[1.05] tracking-tight">
                <span className="text-[#e7eee9]">Buang sampah,</span>
                <br />
                <span className="gradient-text">dapat reward.</span>
              </h1>
              <p className="text-[#97a89d] text-lg leading-relaxed max-w-lg">
                SmartBin mengubah kebiasaan membuang sampah menjadi aktivitas yang menguntungkan. Sensor IoT, eco-points, dan pengelolaan sampah yang lebih efisien.
              </p>
              <div className="flex flex-wrap gap-4">
                {isAuthenticated ? (
                  <Link href="/dashboard">
                    <Button size="lg" className="group">
                      <LayoutDashboard size={18} />
                      Buka Dashboard
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/register">
                    <Button size="lg" className="group">
                      Mulai Sekarang
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                )}
                <a href="#how-it-works">
                  <Button variant="secondary" size="lg">Cara Kerja <ChevronRight size={18} /></Button>
                </a>
              </div>
              <div className="flex flex-wrap gap-8 pt-4 border-t border-[#84a98c]/10">
                {[
                  { val: "80%+", label: "Efisiensi Pengangkutan" },
                  { val: "10 Poin", label: "Per Buang Sampah" },
                  { val: "Real-time", label: "Monitoring Level" },
                ].map((s) => (
                  <div key={s.label} className="pt-4">
                    <div className="text-xl font-semibold text-[#b3cdb6]">{s.val}</div>
                    <div className="text-xs text-[#5e6e64] mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative lg:h-[600px] h-[420px]">
              {/* very subtle radial — like a soft studio backdrop */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(132,169,140,0.10),transparent_70%)]" />

              <BinScene fillLevel={fill} height="100%" interactive={true} />

              {/* status card — product info, less HUD */}
              <div className={`absolute top-5 right-4 rounded-xl px-3.5 py-2.5 text-xs border ${fillTone} bg-[#161c17]/85 backdrop-blur-md float-animation`}>
                <div className="text-[10px] uppercase tracking-wider opacity-80 mb-1">Status</div>
                <div className="font-semibold">{fillLabel}</div>
              </div>

              {/* live fill bar */}
              <div className="absolute top-5 left-4 rounded-xl px-3.5 py-2.5 w-44 border border-[#84a98c]/20 bg-[#161c17]/85 backdrop-blur-md float-animation" style={{ animationDelay: "0.4s" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-[#5e6e64] font-medium tracking-wide uppercase">Fill Level</span>
                  <span className="text-xs font-medium text-[#b3cdb6] tabular-nums">{fill}%</span>
                </div>
                <div className="h-1.5 bg-[#0a0e0c] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${fill}%`,
                      background:
                        fill >= 80
                          ? "#dc2626"
                          : fill >= 60
                            ? "#d97706"
                            : "#65a30d",
                    }}
                  />
                </div>
              </div>

              {/* telemetry chip */}
              <div className="absolute bottom-16 left-4 rounded-xl px-3.5 py-2 text-xs border border-[#84a98c]/20 bg-[#161c17]/85 backdrop-blur-md float-animation" style={{ animationDelay: "0.9s" }}>
                <div className="flex items-center gap-2 text-[#b3cdb6]">
                  <Wifi size={12} className="text-[#84a98c]" /> <span>IoT Online</span>
                </div>
                <div className="text-[10px] text-[#5e6e64] mt-0.5">32ms · LTE</div>
              </div>

              {/* reward toast */}
              <div className="absolute bottom-5 right-4 rounded-xl px-3.5 py-2 border border-[#84a98c]/20 bg-[#161c17]/85 backdrop-blur-md float-animation" style={{ animationDelay: "1.4s" }}>
                <div className="text-[10px] text-[#5e6e64] mb-0.5">Eco Points</div>
                <div className="font-semibold text-[#b3cdb6] text-sm flex items-center gap-1.5">
                  +10 pts <CheckCircle2 size={13} className="text-[#84a98c]" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#5e6e64] text-xs">
          <span>Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#5e6e64] to-transparent" />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#84a98c]/25 text-[#84a98c] text-xs mb-4">
              <Leaf size={12} /> Untukmu &amp; Lingkunganmu
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
              Buang sampah jadi terasa berarti
            </h2>
            <p className="text-[#97a89d] max-w-xl mx-auto leading-relaxed">
              Setiap kali kamu memilih SmartBin, kamu ikut menjaga kotamu tetap bersih — dan dapat ganjaran nyata sebagai apresiasi.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className={`rounded-2xl border p-6 ${f.bg} hover:border-[#84a98c]/40 transition-colors`}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-[#0e1411] ${f.color}`}>
                  <f.icon size={20} />
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-[#97a89d] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-[#131915]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
              Mulai dapat reward dalam 4 langkah
            </h2>
            <p className="text-[#97a89d] max-w-md mx-auto">
              Tanpa daftar ribet di SmartBin-nya, tanpa scan tagihan. Cukup aplikasimu.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={step.num} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-[#84a98c]/30 to-transparent" />
                )}
                <div className="w-20 h-20 rounded-2xl border border-[#84a98c]/25 bg-[#1c2620]/40 flex flex-col items-center justify-center mx-auto mb-4">
                  <span className="text-[10px] text-[#5e6e64] uppercase tracking-wider">Langkah</span>
                  <span className="text-xl font-bold text-[#b3cdb6]">{i + 1}</span>
                </div>
                <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-[#97a89d] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REWARDS */}
      <section id="rewards" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-700/30 text-amber-300 text-xs mb-4">
                <Gift size={12} /> Reward Nyata
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
                Sampahmu, <br />
                <span className="gradient-text">jadi voucher beneran.</span>
              </h2>
              <p className="text-[#97a89d] mb-6 leading-relaxed">
                10 eco-points per kantong sampah — dan kamu bisa tukarkan ke voucher transport, makanan, sampai saldo digital. Tanpa minimum, tanpa syarat membingungkan.
              </p>
              <div className="space-y-2.5 mb-8">
                {[
                  "10 poin per kali buang sampah",
                  "Voucher dari mitra terpercaya — TransJakarta, Grab, GoFood, dll.",
                  "Poin berlaku 12 bulan, bebas ditukar kapan saja",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm text-[#e7eee9]">
                    <CheckCircle2 size={16} className="text-[#84a98c] shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <Link href="/register">
                <Button size="lg">Mulai Kumpulkan Poin <ArrowRight size={16} /></Button>
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {rewards.map((r) => (
                <div key={r.name} className="rounded-2xl border border-[#84a98c]/15 bg-[#161c17] p-4 text-center hover:border-[#84a98c]/35 hover:bg-[#1c2620] transition-all">
                  <div className="text-3xl mb-2">{r.emoji}</div>
                  <div className="text-xs font-semibold text-white">{r.name}</div>
                  <div className="text-[10px] text-[#84a98c] mt-0.5">{r.discount}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 bg-[#131915]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="rounded-3xl border border-[#84a98c]/20 bg-gradient-to-br from-[#1c2620] to-[#161c17] p-10 sm:p-14">
            <div className="text-5xl mb-4">🌿</div>
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
              {isAuthenticated ? "Selamat datang kembali" : "Yuk, mulai dari hari ini"}
            </h2>
            <p className="text-[#97a89d] mb-8 leading-relaxed">
              {isAuthenticated
                ? "Buka dashboard untuk lihat poin, scan QR, dan tukar reward favoritmu."
                : "Daftar gratis, temukan SmartBin terdekat, dan rasakan sendiri — buang sampah ternyata bisa jadi kebiasaan yang menyenangkan."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button size="lg"><LayoutDashboard size={16} /> Buka Dashboard <ArrowRight size={16} /></Button>
                </Link>
              ) : (
                <>
                  <Link href="/register">
                    <Button size="lg">Daftar Gratis <ArrowRight size={16} /></Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="secondary" size="lg">Sudah punya akun? Masuk</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#84a98c]/10 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#2f5d3f] flex items-center justify-center">
                <Leaf size={14} className="text-[#b3cdb6]" />
              </div>
              <div>
                <div className="font-semibold text-[#e7eee9]">SmartBin</div>
                <div className="text-xs text-[#5e6e64]">Smart waste, real reward.</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#97a89d]">
              <a href="#features" className="hover:text-[#b3cdb6] transition-colors">Fitur</a>
              <a href="#how-it-works" className="hover:text-[#b3cdb6] transition-colors">Cara Kerja</a>
              <a href="#rewards" className="hover:text-[#b3cdb6] transition-colors">Reward</a>
              <Link href="/register" className="hover:text-[#b3cdb6] transition-colors">Daftar</Link>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-[#84a98c]/10 flex flex-col sm:flex-row justify-between gap-2 text-xs text-[#5e6e64]">
            <div>© 2026 SmartBin. Bersama menjaga Indonesia tetap bersih.</div>
            <div>Hubungi kami · Kebijakan privasi · Syarat &amp; ketentuan</div>
          </div>
        </div>
      </footer>
    </main>
  );
}
