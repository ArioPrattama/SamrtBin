"use client";

import { useCurrentUser } from "@/lib/use-current-user";
import { mockTransactions, mockBins } from "@/lib/mock-data";
import { formatPoints, formatDate, getFillColor, getFillStatus } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import {
  QrCode, Gift, TrendingUp, Leaf, ArrowRight, MapPin, Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";

const tips = [
  "Buang sampah lebih awal di pagi hari saat bin masih kosong.",
  "Kumpulkan 100 poin untuk dapat diskon TransJakarta 50%.",
  "Ajak teman pakai SmartBin — kotamu jadi lebih bersih.",
];

export default function DashboardHome() {
  const user = useCurrentUser();
  const [ecoPoints] = useState(270);
  const [tipIdx, setTipIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTipIdx((i) => (i + 1) % tips.length), 4000);
    return () => clearInterval(t);
  }, []);

  const firstName = user?.name?.split(" ")[0] || "Pengguna";
  const nearby = mockBins.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto pb-24 lg:pb-0">
      {/* Greeting — full width */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">
          Halo, {firstName} <span className="font-normal">👋</span>
        </h1>
        <p className="text-[#97a89d] text-sm mt-1">
          Yuk, mulai kumpulkan eco-points hari ini.
        </p>
      </div>

      {/* Two-column grid on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
        {/* ============================================== LEFT COLUMN ===== */}
        <div className="lg:col-span-2 space-y-5 lg:space-y-6">
          {/* Points card */}
          <div className="relative rounded-3xl bg-gradient-to-br from-[#2f5d3f] via-[#1c2620] to-[#161c17] border border-[#84a98c]/25 p-6 lg:p-8 overflow-hidden">
            {/* decorative leaf glow */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#84a98c]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex items-start justify-between mb-5">
              <div>
                <p className="text-[#b3cdb6] text-sm mb-1">Total Eco-Points</p>
                <div className="flex items-end gap-2">
                  <span className="text-5xl lg:text-6xl font-bold text-white tabular-nums">
                    {formatPoints(ecoPoints)}
                  </span>
                  <span className="text-[#84a98c] text-lg mb-1.5">pts</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#84a98c] mt-2">
                  <TrendingUp size={13} />
                  <span>+10 pts hari ini · diperbarui barusan</span>
                </div>
              </div>
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-[#84a98c]/15 border border-[#84a98c]/20 flex items-center justify-center shrink-0">
                <Leaf size={22} className="text-[#b3cdb6]" />
              </div>
            </div>

            <div className="relative">
              <div className="flex justify-between text-xs text-[#97a89d] mb-1.5">
                <span>{formatPoints(ecoPoints)} / 500 pts</span>
                <span>🎬 Tiket Bioskop XXI</span>
              </div>
              <div className="h-1.5 bg-[#0a0e0c] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#5b8c5a] to-[#84a98c] rounded-full transition-all"
                  style={{ width: `${Math.min((ecoPoints / 500) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-4 lg:gap-5">
            <Link href="/dashboard/scan" className="group">
              <div className="h-full rounded-2xl border border-[#84a98c]/20 bg-[#161c17] p-5 lg:p-6 hover:border-[#84a98c]/40 hover:bg-[#1c2620] transition-all">
                <div className="w-11 h-11 rounded-xl bg-[#84a98c]/15 flex items-center justify-center mb-4">
                  <QrCode size={20} className="text-[#b3cdb6]" />
                </div>
                <h3 className="font-semibold text-white text-sm lg:text-base mb-1">Scan QR</h3>
                <p className="text-xs lg:text-sm text-[#97a89d] leading-relaxed">
                  Buang sampah, scan QR di SmartBin, dapatkan 10 pts.
                </p>
                <div className="flex items-center gap-1 mt-4 text-xs text-[#84a98c] group-hover:gap-2 transition-all">
                  Scan sekarang <ArrowRight size={12} />
                </div>
              </div>
            </Link>

            <Link href="/dashboard/rewards" className="group">
              <div className="h-full rounded-2xl border border-amber-900/30 bg-[#161c17] p-5 lg:p-6 hover:border-amber-700/40 hover:bg-[#1c2620] transition-all">
                <div className="w-11 h-11 rounded-xl bg-amber-700/15 flex items-center justify-center mb-4">
                  <Gift size={20} className="text-amber-300" />
                </div>
                <h3 className="font-semibold text-white text-sm lg:text-base mb-1">Tukar Reward</h3>
                <p className="text-xs lg:text-sm text-[#97a89d] leading-relaxed">
                  Voucher transport, makanan, &amp; belanja sudah menanti.
                </p>
                <div className="flex items-center gap-1 mt-4 text-xs text-amber-400 group-hover:gap-2 transition-all">
                  Lihat reward <ArrowRight size={12} />
                </div>
              </div>
            </Link>
          </div>

          {/* Recent activity */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Aktivitas Terbaru</h2>
              <Link
                href="/dashboard/profile"
                className="text-xs text-[#84a98c] hover:text-[#b3cdb6]"
              >
                Lihat semua
              </Link>
            </div>
            <div className="space-y-1">
              {mockTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-3 border-b border-[#84a98c]/10 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm ${
                        tx.type === "earn"
                          ? "bg-[#84a98c]/15"
                          : "bg-amber-700/15"
                      }`}
                    >
                      {tx.type === "earn" ? "♻️" : "🎁"}
                    </div>
                    <div>
                      <p className="text-sm text-[#e7eee9]">
                        {tx.type === "earn" ? tx.binName : tx.rewardName}
                      </p>
                      <p className="text-xs text-[#5e6e64]">{formatDate(tx.timestamp)}</p>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-semibold tabular-nums ${
                      tx.points > 0 ? "text-[#b3cdb6]" : "text-red-400"
                    }`}
                  >
                    {tx.points > 0 ? "+" : ""}
                    {tx.points} pts
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ============================================== RIGHT COLUMN ===== */}
        <div className="space-y-5 lg:space-y-6">
          {/* Tip banner */}
          <div className="rounded-2xl border border-[#84a98c]/15 bg-[#1c2620]/40 px-4 py-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#84a98c]/15 flex items-center justify-center shrink-0">
              <Sparkles size={15} className="text-[#b3cdb6]" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-[#5e6e64] mb-0.5">Tips Hari Ini</p>
              <p className="text-sm text-[#e7eee9] leading-relaxed">{tips[tipIdx]}</p>
            </div>
          </div>

          {/* Stats summary */}
          <Card>
            <h3 className="font-semibold text-white text-sm mb-4">Ringkasan Bulan Ini</h3>
            <div className="space-y-3">
              {[
                { label: "Buang sampah", val: "12x", icon: "♻️" },
                { label: "Poin didapat", val: "+120 pts", icon: "🌱" },
                { label: "Reward ditukar", val: "1x", icon: "🎁" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2 text-[#97a89d]">
                    <span className="text-base">{s.icon}</span>
                    {s.label}
                  </div>
                  <span className="font-semibold text-[#e7eee9] tabular-nums">{s.val}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Nearby bins — desktop only (mobile already cluttered) */}
          <Card className="hidden lg:block">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white text-sm">SmartBin Terdekat</h3>
              <Link
                href="/dashboard/scan"
                className="text-xs text-[#84a98c] hover:text-[#b3cdb6]"
              >
                Lihat peta
              </Link>
            </div>
            <div className="space-y-3">
              {nearby.map((bin) => (
                <div
                  key={bin.id}
                  className="flex items-center justify-between py-2 border-b border-[#84a98c]/10 last:border-0"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-sm text-[#e7eee9] mb-0.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: getFillColor(bin.fillLevel) }}
                      />
                      <span className="truncate">{bin.name}</span>
                    </div>
                    <p className="text-[11px] text-[#5e6e64] flex items-center gap-1 truncate">
                      <MapPin size={10} className="shrink-0" />
                      {bin.location.split(",")[0]}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <div
                      className="text-xs font-semibold tabular-nums"
                      style={{ color: getFillColor(bin.fillLevel) }}
                    >
                      {bin.fillLevel}%
                    </div>
                    <div className="text-[10px] text-[#5e6e64]">{getFillStatus(bin.fillLevel)}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Next reward teaser */}
          <Card className="bg-gradient-to-br from-[#1c2620] to-[#161c17]">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🎬</div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-wide text-[#5e6e64] mb-0.5">
                  Reward berikutnya
                </p>
                <h4 className="text-sm font-semibold text-white mb-1">Tiket Bioskop XXI</h4>
                <p className="text-xs text-[#97a89d] leading-relaxed">
                  Tinggal {500 - ecoPoints} poin lagi — sekitar 23 kali buang sampah.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
