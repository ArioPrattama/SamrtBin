"use client";

import { useState } from "react";
import { mockBins } from "@/lib/mock-data";
import { getFillColor, getFillStatus } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Route, Truck, MapPin, Clock, Zap, CheckCircle2, ArrowDown } from "lucide-react";

// DSS scoring: priority based on fill level (weight 60%) + battery (weight 20%) + time since collected (weight 20%)
function calculatePriority(bin: (typeof mockBins)[0]): number {
  const fillScore = bin.fillLevel / 100;
  const batteryScore = 1 - bin.batteryLevel / 100;
  const daysSince = Math.floor((Date.now() - new Date(bin.lastCollected).getTime()) / (1000 * 60 * 60 * 24));
  const timeScore = Math.min(daysSince / 3, 1);
  return Math.round((fillScore * 0.6 + batteryScore * 0.2 + timeScore * 0.2) * 100);
}

export default function RoutesPage() {
  const [generated, setGenerating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);

  const urgentBins = mockBins
    .map((bin) => ({ ...bin, priority: calculatePriority(bin) }))
    .sort((a, b) => b.priority - a.priority)
    .filter((b) => b.fillLevel >= 50);

  function generateRoute() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setGenerating(true);
    }, 1500);
  }

  function markDone(id: string) {
    setCompleted((prev) => [...prev, id]);
  }

  const totalDistance = "12.4 km";
  const estimatedTime = "45 menit";

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Rute Penjemputan</h1>
        <p className="text-green-600 text-sm mt-0.5">
          Sistem DSS menentukan urutan penjemputan berdasarkan urgensi, lokasi, dan efisiensi rute
        </p>
      </div>

      {/* DSS explanation */}
      <Card>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-900/30 flex items-center justify-center shrink-0">
            <Zap size={18} className="text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1.5">Cara Kerja DSS (Decision Support System)</h3>
            <p className="text-sm text-green-500 mb-3">
              Algoritma DSS menghitung skor prioritas setiap bin berdasarkan 3 faktor:
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Level Isi", weight: "60%", desc: "≥80% = prioritas tinggi", color: "text-red-400" },
                { label: "Waktu Tunggu", weight: "20%", desc: "Makin lama = urgen", color: "text-orange-400" },
                { label: "Baterai IoT", weight: "20%", desc: "Rendah = segera servis", color: "text-yellow-400" },
              ].map((f) => (
                <div key={f.label} className="rounded-xl bg-green-900/10 border border-green-900/30 p-3 text-center">
                  <div className={`text-lg font-bold ${f.color}`}>{f.weight}</div>
                  <div className="text-xs font-semibold text-green-200 mt-0.5">{f.label}</div>
                  <div className="text-[10px] text-green-700 mt-0.5">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Priority list */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">Urutan Prioritas ({urgentBins.length} bin)</h2>
          {!generated ? (
            <Button onClick={generateRoute} loading={loading} size="sm">
              <Route size={14} />
              Generate Rute
            </Button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-green-500">
              <CheckCircle2 size={13} />
              Rute dioptimasi
            </div>
          )}
        </div>

        <div className="space-y-3">
          {urgentBins.map((bin, index) => {
            const isDone = completed.includes(bin.id);
            return (
              <div key={bin.id}>
                <div className={`rounded-xl border p-4 transition-all ${
                  isDone
                    ? "border-green-900/20 bg-green-900/5 opacity-50"
                    : bin.fillLevel >= 80
                    ? "border-red-900/50 bg-red-900/10"
                    : "border-yellow-900/40 bg-yellow-900/5"
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                        isDone ? "bg-green-800/30 text-green-600" :
                        bin.fillLevel >= 80 ? "bg-red-800/40 text-red-300" : "bg-yellow-800/30 text-yellow-300"
                      }`}>
                        {isDone ? "✓" : index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white text-sm">{bin.name}</h3>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{
                            backgroundColor: getFillColor(bin.fillLevel) + "20",
                            color: getFillColor(bin.fillLevel)
                          }}>
                            {getFillStatus(bin.fillLevel)}
                          </span>
                        </div>
                        <p className="text-xs text-green-700 mt-0.5 flex items-center gap-1">
                          <MapPin size={9} /> {bin.location}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs text-green-600 mb-1">Skor Prioritas</div>
                      <div className={`text-xl font-bold ${bin.fillLevel >= 80 ? "text-red-400" : "text-yellow-400"}`}>
                        {bin.priority}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-4 text-xs text-green-700">
                      <span>Isi: <strong style={{ color: getFillColor(bin.fillLevel) }}>{Math.round(bin.fillLevel)}%</strong></span>
                      <span>Baterai: <strong className="text-green-400">{bin.batteryLevel}%</strong></span>
                    </div>
                    {generated && !isDone && (
                      <Button size="sm" variant="secondary" onClick={() => markDone(bin.id)}>
                        <CheckCircle2 size={12} />
                        Tandai Selesai
                      </Button>
                    )}
                  </div>
                </div>
                {index < urgentBins.length - 1 && (
                  <div className="flex justify-center my-1">
                    <ArrowDown size={14} className="text-green-800" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Route summary */}
      {generated && (
        <Card>
          <h2 className="font-semibold text-white mb-4">Ringkasan Rute</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-10 h-10 rounded-xl bg-blue-900/30 flex items-center justify-center mx-auto mb-2">
                <Truck size={18} className="text-blue-400" />
              </div>
              <div className="text-lg font-bold text-white">{urgentBins.length - completed.length}</div>
              <div className="text-xs text-green-700">Bin Tersisa</div>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-xl bg-green-900/30 flex items-center justify-center mx-auto mb-2">
                <Route size={18} className="text-green-400" />
              </div>
              <div className="text-lg font-bold text-white">{totalDistance}</div>
              <div className="text-xs text-green-700">Total Jarak</div>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-xl bg-orange-900/30 flex items-center justify-center mx-auto mb-2">
                <Clock size={18} className="text-orange-400" />
              </div>
              <div className="text-lg font-bold text-white">{estimatedTime}</div>
              <div className="text-xs text-green-700">Estimasi Waktu</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
