"use client";

import { useEffect, useState } from "react";
import { mockBins, mockAnalyticsWeekly } from "@/lib/mock-data";
import { getFillColor, getFillStatus } from "@/lib/utils";
import { Bin } from "@/types";
import { Card } from "@/components/ui/Card";
import { Trash2, Truck, Users, Leaf, AlertTriangle, TrendingUp } from "lucide-react";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const [bins, setBins] = useState<Bin[]>(mockBins);

  // Simulate real-time bin level changes
  useEffect(() => {
    const interval = setInterval(() => {
      setBins((prev) =>
        prev.map((bin) => ({
          ...bin,
          fillLevel: Math.min(100, Math.max(0, bin.fillLevel + (Math.random() - 0.3) * 3)),
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fullBins = bins.filter((b) => b.fillLevel >= 80).length;
  const avgFill = Math.round(bins.reduce((s, b) => s + b.fillLevel, 0) / bins.length);

  const stats = [
    { icon: Trash2, label: "Total SmartBin", value: bins.length, color: "text-green-400", bg: "bg-green-900/30" },
    { icon: AlertTriangle, label: "Perlu Dijemput", value: fullBins, color: "text-red-400", bg: "bg-red-900/30" },
    { icon: Truck, label: "Rute Aktif", value: 2, color: "text-blue-400", bg: "bg-blue-900/30" },
    { icon: Users, label: "User Aktif", value: 128, color: "text-purple-400", bg: "bg-purple-900/30" },
    { icon: Leaf, label: "Eco-Points Hari Ini", value: "340 pts", color: "text-yellow-400", bg: "bg-yellow-900/30" },
    { icon: TrendingUp, label: "Rata-rata Isi", value: `${avgFill}%`, color: "text-orange-400", bg: "bg-orange-900/30" },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-green-600 text-sm mt-0.5">Overview sistem SmartBin — data diperbarui setiap 3 detik</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-green-500 bg-green-900/20 border border-green-900/40 rounded-full px-3 py-1.5">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          Live
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="text-center">
            <div className={`w-8 h-8 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-2 ${stat.color}`}>
              <stat.icon size={15} />
            </div>
            <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-[10px] text-green-700 mt-0.5 leading-tight">{stat.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Map placeholder */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Peta SmartBin</h2>
              <Link href="/admin/bins" className="text-xs text-green-500 hover:text-green-400">Lihat semua</Link>
            </div>
            {/* Simulated map with bin dots */}
            <div className="relative rounded-xl bg-[#0a180a] border border-green-900/30 h-64 overflow-hidden">
              {/* Grid lines */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.04)_1px,transparent_1px)] bg-[size:30px_30px]" />
              <div className="absolute top-2 left-2 text-xs text-green-800 font-mono">Jakarta, Indonesia</div>

              {/* Roads */}
              <div className="absolute left-1/4 top-0 bottom-0 w-px bg-green-900/30" />
              <div className="absolute right-1/4 top-0 bottom-0 w-px bg-green-900/30" />
              <div className="absolute top-1/3 left-0 right-0 h-px bg-green-900/30" />
              <div className="absolute top-2/3 left-0 right-0 h-px bg-green-900/30" />

              {/* Bin markers */}
              {bins.map((bin, i) => {
                const x = [20, 45, 70, 30, 60, 80][i] || 50;
                const y = [30, 55, 25, 70, 45, 65][i] || 50;
                return (
                  <div
                    key={bin.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <div
                      className="w-4 h-4 rounded-full border-2 border-[#0a180a] transition-all group-hover:scale-150"
                      style={{ backgroundColor: getFillColor(bin.fillLevel) }}
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10 bg-[#161c17] border border-green-900/50 rounded-lg px-2 py-1 text-[10px] text-green-300 whitespace-nowrap">
                      {bin.name}: {Math.round(bin.fillLevel)}%
                    </div>
                    {bin.fillLevel >= 80 && (
                      <div className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: getFillColor(bin.fillLevel), opacity: 0.3 }} />
                    )}
                  </div>
                );
              })}

              {/* Legend */}
              <div className="absolute bottom-2 right-2 flex flex-col gap-1">
                {[["#22c55e", "Normal"], ["#f59e0b", "Sedang"], ["#ef4444", "Penuh"]].map(([color, label]) => (
                  <div key={label} className="flex items-center gap-1.5 text-[10px] text-green-700">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Bin status list */}
        <Card>
          <h2 className="font-semibold text-white mb-4">Status Bin</h2>
          <div className="space-y-3">
            {bins.map((bin) => (
              <div key={bin.id} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: getFillColor(bin.fillLevel) }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-green-200 truncate">{bin.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex-1 h-1 bg-green-900/30 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${bin.fillLevel}%`, backgroundColor: getFillColor(bin.fillLevel) }}
                      />
                    </div>
                    <span className="text-[10px] font-mono shrink-0" style={{ color: getFillColor(bin.fillLevel) }}>
                      {Math.round(bin.fillLevel)}%
                    </span>
                  </div>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${
                  bin.fillLevel >= 80 ? "bg-red-900/30 text-red-400" :
                  bin.fillLevel >= 50 ? "bg-yellow-900/30 text-yellow-400" :
                  "bg-green-900/30 text-green-400"
                }`}>
                  {getFillStatus(bin.fillLevel)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <h2 className="font-semibold text-white mb-4">Aktivitas Mingguan</h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockAnalyticsWeekly}>
              <defs>
                <linearGradient id="colorPts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#4ade8060" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#4ade8060" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#161c17", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 12, fontSize: 12 }}
                labelStyle={{ color: "#86efac" }}
              />
              <Area type="monotone" dataKey="points" stroke="#22c55e" strokeWidth={2} fill="url(#colorPts)" name="Eco-Points" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
