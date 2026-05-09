"use client";

import { useState } from "react";
import { mockRewards } from "@/lib/mock-data";
import { formatPoints, formatDate } from "@/lib/utils";
import { ArrowLeft, CheckCircle2, Clock, Tag } from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { Reward } from "@/types";

const categories = ["Semua", "transport", "food", "shopping", "entertainment", "finance"];
const categoryLabel: Record<string, string> = {
  transport: "Transport", food: "Makanan", shopping: "Belanja",
  entertainment: "Hiburan", finance: "Keuangan",
};

export default function RewardsPage() {
  const [points] = useState(280);
  const [category, setCategory] = useState("Semua");
  const [redeemed, setRedeemed] = useState<string[]>([]);
  const [confirming, setConfirming] = useState<Reward | null>(null);
  const [success, setSuccess] = useState<Reward | null>(null);

  const filtered = mockRewards.filter(
    (r) => category === "Semua" || r.category === category
  );

  function handleRedeem(reward: Reward) {
    if (points < reward.pointsRequired) return;
    setConfirming(reward);
  }

  function confirmRedeem() {
    if (!confirming) return;
    setRedeemed((prev) => [...prev, confirming.id]);
    setSuccess(confirming);
    setConfirming(null);
  }

  return (
    <div className="max-w-2xl mx-auto pb-24 lg:pb-0">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard">
          <button className="p-2 rounded-xl text-green-600 hover:text-green-400 hover:bg-green-900/20 transition-all">
            <ArrowLeft size={20} />
          </button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">Tukar Reward</h1>
          <p className="text-sm text-green-600">Gunakan eco-points kamu</p>
        </div>
      </div>

      {/* Points balance */}
      <div className="rounded-2xl border border-green-800/40 bg-gradient-to-r from-green-900/40 to-[#161c17] p-4 mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-green-600 mb-0.5">Eco-Points Kamu</p>
          <div className="flex items-end gap-1.5">
            <span className="text-3xl font-black text-white">{formatPoints(points)}</span>
            <span className="text-green-500 text-sm mb-0.5">pts</span>
          </div>
        </div>
        <div className="text-3xl">🌿</div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 snap-x">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`snap-start shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              category === cat
                ? "bg-green-600 text-white"
                : "border border-green-900/50 text-green-600 hover:border-green-700/50 hover:text-green-400"
            }`}
          >
            {cat === "Semua" ? "Semua" : categoryLabel[cat]}
          </button>
        ))}
      </div>

      {/* Rewards grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map((reward) => {
          const canRedeem = points >= reward.pointsRequired;
          const alreadyRedeemed = redeemed.includes(reward.id);
          return (
            <div
              key={reward.id}
              className={`rounded-2xl border p-5 transition-all ${
                canRedeem && !alreadyRedeemed
                  ? "border-green-900/50 bg-[#161c17] hover:border-green-700/60"
                  : "border-green-900/20 bg-[#0a120a] opacity-70"
              }`}
            >
              <div className="text-4xl mb-3">{reward.image}</div>
              <h3 className="font-semibold text-white mb-1">{reward.name}</h3>
              <p className="text-xs text-green-600 mb-3 leading-relaxed">{reward.description}</p>

              <div className="flex items-center gap-2 mb-3 text-xs text-green-700">
                <Clock size={11} />
                <span>Berlaku hingga {formatDate(reward.validUntil)}</span>
              </div>

              <div className="flex items-center gap-2 mb-4 text-xs text-green-700">
                <Tag size={11} />
                <span>{reward.stock} tersisa</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-green-400">{formatPoints(reward.pointsRequired)}</span>
                  <span className="text-xs text-green-600 ml-1">pts</span>
                </div>
                {alreadyRedeemed ? (
                  <div className="flex items-center gap-1 text-xs text-green-500">
                    <CheckCircle2 size={14} />
                    Ditukar
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant={canRedeem ? "primary" : "ghost"}
                    disabled={!canRedeem}
                    onClick={() => handleRedeem(reward)}
                  >
                    {canRedeem ? "Tukar" : `Kurang ${reward.pointsRequired - points} pts`}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirm modal */}
      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm glass rounded-3xl p-7 text-center">
            <div className="text-5xl mb-4">{confirming.image}</div>
            <h2 className="text-xl font-bold text-white mb-2">Konfirmasi Penukaran</h2>
            <p className="text-sm text-green-400 mb-1">{confirming.name}</p>
            <p className="text-xs text-green-600 mb-5">{confirming.description}</p>
            <div className="rounded-xl bg-green-900/20 border border-green-900/40 p-3 mb-5 text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-green-600">Poin digunakan</span>
                <span className="text-red-400">-{formatPoints(confirming.pointsRequired)} pts</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-green-400">Sisa poin</span>
                <span className="text-white">{formatPoints(points - confirming.pointsRequired)} pts</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setConfirming(null)}>Batal</Button>
              <Button className="flex-1" onClick={confirmRedeem}>Konfirmasi</Button>
            </div>
          </div>
        </div>
      )}

      {/* Success modal */}
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm glass rounded-3xl p-7 text-center">
            <div className="w-20 h-20 rounded-full bg-green-700/30 border-2 border-green-500 flex items-center justify-center mx-auto mb-4 glow-green">
              <CheckCircle2 size={36} className="text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Berhasil Ditukar!</h2>
            <p className="text-sm text-green-400 mb-1">{success.name}</p>
            <p className="text-xs text-green-600 mb-6">
              Voucher akan dikirim ke email <strong className="text-green-400">kamu</strong> dalam 5 menit.
            </p>
            <Button className="w-full" onClick={() => setSuccess(null)}>Kembali ke Rewards</Button>
          </div>
        </div>
      )}
    </div>
  );
}
