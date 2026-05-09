"use client";

import { useState, useEffect } from "react";
import { mockBins } from "@/lib/mock-data";
import { QrCode, CheckCircle2, MapPin, Wifi, ArrowLeft, Leaf } from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { getFillColor, getFillStatus } from "@/lib/utils";

type ScanState = "idle" | "scanning" | "verifying" | "success" | "error";

// Simulated QR data grid
function QRGrid({ animating }: { animating: boolean }) {
  // Use a deterministic pseudo-random pattern keyed on cell index
  // so render is pure (no Math.random in render).
  const cells = Array.from({ length: 100 }, (_, i) => i);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!animating) return;
    const id = setInterval(() => setTick((t) => t + 1), 120);
    return () => clearInterval(id);
  }, [animating]);
  return (
    <div className="grid grid-cols-10 gap-0.5 w-48 h-48">
      {cells.map((i) => {
        const lit = animating
          ? ((i * 9301 + 49297 + tick * 233) % 233280) / 233280 > 0.5
          : i % 3 === 0 || i % 7 === 0;
        return (
          <div
            key={i}
            className={`w-full aspect-square rounded-[1px] transition-all duration-300 ${
              animating
                ? lit ? "bg-green-400" : "bg-green-900/30"
                : lit ? "bg-green-500" : "bg-green-900/20"
            }`}
            style={{ transitionDelay: `${(i % 20) * 10}ms` }}
          />
        );
      })}
    </div>
  );
}

export default function ScanPage() {
  const [state, setState] = useState<ScanState>("idle");
  const [selectedBin, setSelectedBin] = useState(mockBins[0]);
  const [earnedPoints] = useState(10);
  const [progress, setProgress] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (state !== "scanning") return;
    const interval = setInterval(() => {
      setScanProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setState("verifying");
          return 100;
        }
        return p + 4;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [state]);

  useEffect(() => {
    if (state !== "verifying") return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setState("success");
          return 100;
        }
        return p + 5;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [state]);

  function startScan() {
    setState("scanning");
  }

  function reset() {
    setState("idle");
    setProgress(0);
    setScanProgress(0);
  }

  return (
    <div className="max-w-md mx-auto pb-24 lg:pb-0">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard">
          <button className="p-2 rounded-xl text-green-600 hover:text-green-400 hover:bg-green-900/20 transition-all">
            <ArrowLeft size={20} />
          </button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">Scan QR Code</h1>
          <p className="text-sm text-green-600">Buang sampah dan dapatkan eco-points</p>
        </div>
      </div>

      {/* Nearby bins */}
      <div className="mb-6">
        <p className="text-xs text-green-600 mb-2 font-medium uppercase tracking-wide">SmartBin Terdekat</p>
        <div className="flex gap-2 overflow-x-auto pb-1 snap-x">
          {mockBins.slice(0, 4).map((bin) => (
            <button
              key={bin.id}
              onClick={() => setSelectedBin(bin)}
              className={`snap-start shrink-0 rounded-xl border px-3 py-2 text-left transition-all ${
                selectedBin.id === bin.id
                  ? "border-green-600/70 bg-green-900/30 text-green-300"
                  : "border-green-900/40 bg-[#161c17] text-green-600 hover:border-green-800/60"
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-medium mb-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getFillColor(bin.fillLevel) }} />
                {bin.name}
              </div>
              <div className="text-[10px] text-green-700 flex items-center gap-1">
                <MapPin size={9} /> {bin.location.split(",")[0]}
              </div>
              <div className="text-[10px] mt-0.5" style={{ color: getFillColor(bin.fillLevel) }}>
                {bin.fillLevel}% — {getFillStatus(bin.fillLevel)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected bin info */}
      <div className="rounded-2xl border border-green-900/40 bg-[#161c17] p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white">{selectedBin.name}</h3>
            <p className="text-xs text-green-600 mt-0.5 flex items-center gap-1">
              <MapPin size={10} /> {selectedBin.location}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <Wifi size={12} className="text-green-500" />
            <span className="text-green-500">Online</span>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-2 bg-green-900/30 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${selectedBin.fillLevel}%`,
                backgroundColor: getFillColor(selectedBin.fillLevel),
              }}
            />
          </div>
          <span className="text-xs font-medium" style={{ color: getFillColor(selectedBin.fillLevel) }}>
            {selectedBin.fillLevel}%
          </span>
        </div>
      </div>

      {/* Main scan area */}
      <div className="rounded-3xl border border-green-900/40 bg-[#161c17] p-6 text-center">
        {state === "idle" && (
          <>
            <div className="w-24 h-24 rounded-2xl border-2 border-green-700/50 bg-green-900/20 flex items-center justify-center mx-auto mb-5">
              <QrCode size={44} className="text-green-500" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Siap Buang Sampah?</h2>
            <p className="text-sm text-green-500 mb-6">
              Buang sampah ke SmartBin, layar akan menampilkan QR code. Tekan tombol di bawah untuk mensimulasikan proses scan.
            </p>
            <Button onClick={startScan} size="lg" className="w-full">
              Mulai Scan QR
            </Button>
            <p className="text-xs text-green-700 mt-3">Kamu akan mendapatkan <strong className="text-green-500">+10 eco-points</strong></p>
          </>
        )}

        {state === "scanning" && (
          <>
            <div className="relative mx-auto w-48 h-48 mb-5">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-green-400 rounded-tl" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-green-400 rounded-tr" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-green-400 rounded-bl" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-green-400 rounded-br" />
              {/* Scan line */}
              <div
                className="absolute left-2 right-2 h-0.5 bg-green-400/80 shadow-[0_0_8px_2px_rgba(74,222,128,0.5)] transition-all"
                style={{ top: `${scanProgress}%` }}
              />
              <div className="absolute inset-2">
                <QRGrid animating={true} />
              </div>
            </div>
            <p className="text-sm text-green-300 mb-2 font-medium">Memindai QR Code...</p>
            <div className="w-full bg-green-900/30 rounded-full h-1.5 mb-1">
              <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${scanProgress}%` }} />
            </div>
            <p className="text-xs text-green-600">{scanProgress}%</p>
          </>
        )}

        {state === "verifying" && (
          <>
            <div className="w-20 h-20 rounded-full border-2 border-green-700/50 bg-green-900/20 flex items-center justify-center mx-auto mb-5 relative">
              <Leaf size={30} className="text-green-400" />
              <div className="absolute inset-0 rounded-full border-2 border-green-400 border-t-transparent animate-spin" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Memverifikasi...</h2>
            <p className="text-sm text-green-500 mb-4">Sensor mengkonfirmasi sampah masuk</p>
            <div className="space-y-2 text-left text-xs text-green-600">
              {[
                { label: "Sensor berat", done: progress > 30 },
                { label: "Sensor volume ultrasonik", done: progress > 60 },
                { label: "Validasi QR unik", done: progress > 90 },
              ].map(({ label, done }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full border ${done ? "bg-green-500 border-green-400" : "border-green-800"}`} />
                  <span className={done ? "text-green-400" : "text-green-800"}>{label}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {state === "success" && (
          <>
            <div className="w-24 h-24 rounded-full bg-green-700/30 border-2 border-green-500 flex items-center justify-center mx-auto mb-5 glow-green">
              <CheckCircle2 size={44} className="text-green-400" />
            </div>
            <div className="text-5xl font-black text-white mb-1">+{earnedPoints}</div>
            <div className="text-green-400 font-semibold mb-1">Eco-Points Didapat! 🎉</div>
            <p className="text-sm text-green-600 mb-6">
              Terima kasih sudah buang sampah di <strong className="text-green-400">{selectedBin.name}</strong>
            </p>

            <div className="rounded-xl border border-green-800/40 bg-green-900/10 p-4 mb-5 text-left">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-green-600">Total poin sebelumnya</span>
                <span className="text-green-300">270 pts</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-green-600">Poin didapat</span>
                <span className="text-green-400">+{earnedPoints} pts</span>
              </div>
              <div className="border-t border-green-900/40 pt-2 mt-2 flex justify-between font-semibold">
                <span className="text-green-400">Total sekarang</span>
                <span className="text-white">{270 + earnedPoints} pts</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={reset} variant="secondary" className="flex-1">
                Scan Lagi
              </Button>
              <Link href="/dashboard/rewards" className="flex-1">
                <Button className="w-full">Tukar Poin</Button>
              </Link>
            </div>
          </>
        )}
      </div>

      <p className="text-center text-xs text-green-800 mt-4">
        Didukung sensor berlapis untuk mencegah kecurangan
      </p>
    </div>
  );
}
