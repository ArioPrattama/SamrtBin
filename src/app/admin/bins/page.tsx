"use client";

import { useEffect, useState } from "react";
import { mockBins } from "@/lib/mock-data";
import { getFillColor, getFillStatus, formatDate } from "@/lib/utils";
import { Bin } from "@/types";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Wifi, Battery, MapPin, RefreshCw, Filter, Search } from "lucide-react";

export default function BinsPage() {
  const [bins, setBins] = useState<Bin[]>(mockBins);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBins((prev) =>
        prev.map((bin) => ({
          ...bin,
          fillLevel: Math.min(100, Math.max(0, bin.fillLevel + (Math.random() - 0.3) * 2)),
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => {
      setBins(mockBins.map((b) => ({ ...b, fillLevel: b.fillLevel + Math.random() * 5 - 2.5 })));
      setRefreshing(false);
    }, 800);
  }

  const filtered = bins.filter((bin) => {
    const matchSearch = bin.name.toLowerCase().includes(search.toLowerCase()) || bin.location.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" ||
      (filter === "full" && bin.fillLevel >= 80) ||
      (filter === "medium" && bin.fillLevel >= 50 && bin.fillLevel < 80) ||
      (filter === "normal" && bin.fillLevel < 50);
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">SmartBins</h1>
          <p className="text-green-600 text-sm mt-0.5">{bins.length} unit terpasang • {bins.filter(b => b.fillLevel >= 80).length} perlu dijemput</p>
        </div>
        <Button size="sm" variant="secondary" onClick={handleRefresh} loading={refreshing}>
          <RefreshCw size={14} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-700" />
          <input
            type="text"
            placeholder="Cari nama atau lokasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-green-900/50 bg-[#171e19] text-sm text-green-200 placeholder-green-800 focus:outline-none focus:border-green-700/60"
          />
        </div>
        <div className="flex gap-2">
          {[["all", "Semua"], ["full", "Penuh"], ["medium", "Sedang"], ["normal", "Normal"]].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                filter === val ? "bg-green-700/40 text-green-300 border border-green-700/60" : "border border-green-900/40 text-green-600 hover:border-green-800/50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Penuh (≥80%)", count: bins.filter(b => b.fillLevel >= 80).length, color: "text-red-400", bg: "bg-red-900/20 border-red-900/40" },
          { label: "Sedang (50-79%)", count: bins.filter(b => b.fillLevel >= 50 && b.fillLevel < 80).length, color: "text-yellow-400", bg: "bg-yellow-900/20 border-yellow-900/40" },
          { label: "Normal (<50%)", count: bins.filter(b => b.fillLevel < 50).length, color: "text-green-400", bg: "bg-green-900/20 border-green-900/40" },
        ].map((s) => (
          <Card key={s.label} className={`text-center border ${s.bg}`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.count}</div>
            <div className="text-xs text-green-700 mt-0.5">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Bins table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">Detail Semua Bin</h2>
          <div className="flex items-center gap-1 text-xs text-green-600">
            <Filter size={11} />
            {filtered.length} dari {bins.length}
          </div>
        </div>
        <div className="space-y-3">
          {filtered.map((bin) => (
            <div
              key={bin.id}
              className="rounded-xl border border-green-900/30 bg-[#171e19] p-4 hover:border-green-800/50 transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: getFillColor(bin.fillLevel) }} />
                    <h3 className="font-semibold text-white text-sm">{bin.name}</h3>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      bin.fillLevel >= 80 ? "bg-red-900/30 text-red-400" :
                      bin.fillLevel >= 50 ? "bg-yellow-900/30 text-yellow-400" :
                      "bg-green-900/30 text-green-400"
                    }`}>
                      {getFillStatus(bin.fillLevel)}
                    </span>
                  </div>
                  <p className="text-xs text-green-700 mt-0.5 flex items-center gap-1">
                    <MapPin size={9} /> {bin.location}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1 text-xs text-green-500">
                    <Wifi size={11} />
                    Online
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Fill level */}
                <div>
                  <p className="text-[10px] text-green-700 mb-1">Level Isi</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-green-900/30 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${bin.fillLevel}%`, backgroundColor: getFillColor(bin.fillLevel) }}
                      />
                    </div>
                    <span className="text-xs font-mono font-bold" style={{ color: getFillColor(bin.fillLevel) }}>
                      {Math.round(bin.fillLevel)}%
                    </span>
                  </div>
                </div>

                {/* Battery */}
                <div>
                  <p className="text-[10px] text-green-700 mb-1">Baterai</p>
                  <div className="flex items-center gap-1.5">
                    <Battery size={13} className={bin.batteryLevel > 30 ? "text-green-500" : "text-red-400"} />
                    <span className="text-xs text-green-300">{bin.batteryLevel}%</span>
                  </div>
                </div>

                {/* Last collected */}
                <div>
                  <p className="text-[10px] text-green-700 mb-1">Terakhir Dijemput</p>
                  <p className="text-xs text-green-300">{formatDate(bin.lastCollected)}</p>
                </div>

                {/* Action */}
                <div className="flex items-end">
                  {bin.fillLevel >= 80 && (
                    <Button size="sm" variant="danger" className="text-[11px] py-1">
                      Jadwalkan Jemput
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
