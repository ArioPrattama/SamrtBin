"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useCurrentUser } from "@/lib/use-current-user";
import { useRouter } from "next/navigation";
import { mockTransactions } from "@/lib/mock-data";
import { formatDate, formatPoints } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import {
  User, Mail, Calendar, Leaf, LogOut, ArrowLeft,
  TrendingUp, Recycle, Gift
} from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function ProfilePage() {
  const user = useCurrentUser();
  const { signOut } = useAuthActions();
  const router = useRouter();

  async function handleLogout() {
    await signOut();
    router.push("/");
  }

  const stats = [
    { icon: Recycle, label: "Total Buang Sampah", value: "27x", color: "text-green-400" },
    { icon: Leaf, label: "Total Eco-Points", value: "480 pts", color: "text-green-400" },
    { icon: Gift, label: "Reward Ditukar", value: "2x", color: "text-yellow-400" },
    { icon: TrendingUp, label: "Poin Bulan Ini", value: "+80 pts", color: "text-blue-400" },
  ];

  return (
    <div className="max-w-2xl mx-auto pb-24 lg:pb-0">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard">
          <button className="p-2 rounded-xl text-green-600 hover:text-green-400 hover:bg-green-900/20 transition-all">
            <ArrowLeft size={20} />
          </button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">Profil Saya</h1>
          <p className="text-sm text-green-600">Akun & statistik kamu</p>
        </div>
      </div>

      {/* Profile card */}
      <Card className="mb-5">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-700 to-green-900 flex items-center justify-center text-2xl font-bold text-white">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{user?.name || "Pengguna"}</h2>
            <p className="text-sm text-green-500">@{user?.email?.split("@")[0] || "user"}</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-green-700">
              <Leaf size={11} />
              <span>Member SmartBin</span>
            </div>
          </div>
        </div>

        <div className="space-y-2.5 text-sm">
          <div className="flex items-center gap-3 text-green-400">
            <Mail size={15} className="text-green-600 shrink-0" />
            <span>{user?.email || "—"}</span>
          </div>
          <div className="flex items-center gap-3 text-green-400">
            <Calendar size={15} className="text-green-600 shrink-0" />
            <span>{user?.createdAt ? `Bergabung ${formatDate(new Date(user.createdAt).toISOString())}` : "Bergabung baru-baru ini"}</span>
          </div>
          <div className="flex items-center gap-3 text-green-400">
            <User size={15} className="text-green-600 shrink-0" />
            <span className="capitalize">{user?.role || "user"}</span>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className={`w-8 h-8 rounded-xl bg-green-900/40 flex items-center justify-center mb-2 ${stat.color}`}>
              <stat.icon size={16} />
            </div>
            <div className={`text-2xl font-bold mb-0.5 ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-green-700">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Achievement badges */}
      <Card className="mb-5">
        <h3 className="font-semibold text-white mb-4">Badge Pencapaian</h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            { emoji: "🌱", label: "Pemula", earned: true },
            { emoji: "♻️", label: "Recycler", earned: true },
            { emoji: "🌿", label: "Eco Hero", earned: true },
            { emoji: "🌍", label: "Earth Guard", earned: false },
          ].map((badge) => (
            <div key={badge.label} className={`text-center ${!badge.earned && "opacity-30"}`}>
              <div className={`text-2xl mb-1 mx-auto w-12 h-12 rounded-xl flex items-center justify-center ${
                badge.earned ? "bg-green-900/40 border border-green-800/60" : "bg-green-900/20 border border-green-900/30"
              }`}>
                {badge.emoji}
              </div>
              <p className="text-xs text-green-600">{badge.label}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Transaction history */}
      <Card className="mb-5">
        <h3 className="font-semibold text-white mb-4">Riwayat Aktivitas</h3>
        <div className="space-y-3">
          {mockTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between py-2 border-b border-green-900/30 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  tx.type === "earn" ? "bg-green-900/40" : "bg-yellow-900/40"
                }`}>
                  {tx.type === "earn" ? "♻️" : "🎁"}
                </div>
                <div>
                  <p className="text-sm text-green-200">
                    {tx.type === "earn" ? tx.binName : tx.rewardName}
                  </p>
                  <p className="text-xs text-green-700">{formatDate(tx.timestamp)}</p>
                </div>
              </div>
              <span className={`text-sm font-semibold ${tx.points > 0 ? "text-green-400" : "text-red-400"}`}>
                {tx.points > 0 ? "+" : ""}{formatPoints(tx.points)} pts
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Logout */}
      <Button
        variant="danger"
        className="w-full"
        onClick={handleLogout}
      >
        <LogOut size={16} />
        Keluar dari Akun
      </Button>
    </div>
  );
}
