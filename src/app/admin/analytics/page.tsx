"use client";

import { mockAnalyticsWeekly, mockBins } from "@/lib/mock-data";
import { Card } from "@/components/ui/Card";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { TrendingUp, Recycle, Users, Leaf, Award } from "lucide-react";

const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

const pieData = [
  { name: "Normal (<50%)", value: mockBins.filter(b => b.fillLevel < 50).length },
  { name: "Sedang (50-80%)", value: mockBins.filter(b => b.fillLevel >= 50 && b.fillLevel < 80).length },
  { name: "Penuh (≥80%)", value: mockBins.filter(b => b.fillLevel >= 80).length },
];

const monthlyData = [
  { month: "Jan", users: 45, collections: 120, points: 1800 },
  { month: "Feb", users: 62, collections: 145, points: 2200 },
  { month: "Mar", users: 78, collections: 189, points: 2900 },
  { month: "Apr", users: 95, collections: 210, points: 3400 },
  { month: "Mei", users: 128, collections: 247, points: 3920 },
];

export default function AnalyticsPage() {
  const totalCollections = mockAnalyticsWeekly.reduce((s, d) => s + d.collections, 0);
  const totalPoints = mockAnalyticsWeekly.reduce((s, d) => s + d.points, 0);
  const totalWaste = mockAnalyticsWeekly.reduce((s, d) => s + d.waste, 0);
  const avgFill = Math.round(mockBins.reduce((s, b) => s + b.fillLevel, 0) / mockBins.length);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Analitik</h1>
        <p className="text-green-600 text-sm mt-0.5">Metrik dan performa sistem SmartBin</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Recycle, label: "Total Pengangkutan (Minggu ini)", value: totalCollections, suffix: "x", color: "text-green-400", bg: "bg-green-900/30" },
          { icon: Leaf, label: "Eco-Points Dibagikan", value: totalPoints.toLocaleString(), suffix: " pts", color: "text-yellow-400", bg: "bg-yellow-900/30" },
          { icon: Users, label: "Total Sampah (Minggu ini)", value: totalWaste, suffix: " kg", color: "text-blue-400", bg: "bg-blue-900/30" },
          { icon: TrendingUp, label: "Rata-rata Level Bin", value: avgFill, suffix: "%", color: "text-orange-400", bg: "bg-orange-900/30" },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <div className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center mb-3 ${kpi.color}`}>
              <kpi.icon size={16} />
            </div>
            <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}{kpi.suffix}</div>
            <div className="text-xs text-green-700 mt-1 leading-snug">{kpi.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Weekly bar chart */}
        <div className="lg:col-span-2">
          <Card>
            <h2 className="font-semibold text-white mb-4">Pengangkutan & Eco-Points Mingguan</h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockAnalyticsWeekly} barGap={4}>
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#4ade8060" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#4ade8060" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#161c17", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 12, fontSize: 12 }}
                    labelStyle={{ color: "#86efac" }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#4ade80" }} />
                  <Bar dataKey="collections" fill="#22c55e" radius={[4, 4, 0, 0]} name="Pengangkutan" />
                  <Bar dataKey="waste" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Sampah (kg)" opacity={0.7} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Pie chart */}
        <Card>
          <h2 className="font-semibold text-white mb-4">Distribusi Status Bin</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#161c17", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 12, fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-green-600 flex-1">{d.name}</span>
                <span className="text-green-400 font-semibold">{d.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Monthly growth */}
      <Card>
        <h2 className="font-semibold text-white mb-4">Pertumbuhan Bulanan</h2>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPtsMonthly" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#4ade8060" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#4ade8060" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#161c17", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 12, fontSize: 12 }}
                labelStyle={{ color: "#86efac" }}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: "#4ade80" }} />
              <Area type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorUsers)" name="Users Aktif" />
              <Area type="monotone" dataKey="collections" stroke="#22c55e" strokeWidth={2} fill="url(#colorPtsMonthly)" name="Pengangkutan" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Top performers */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Award size={16} className="text-yellow-400" />
          <h2 className="font-semibold text-white">Top Pengguna Eco-Points (Minggu ini)</h2>
        </div>
        <div className="space-y-3">
          {[
            { rank: 1, name: "Andi Pratama", points: 80, scans: 8 },
            { rank: 2, name: "Sari Dewi", points: 70, scans: 7 },
            { rank: 3, name: "Budi Santoso", points: 60, scans: 6 },
            { rank: 4, name: "Lina Wijaya", points: 50, scans: 5 },
            { rank: 5, name: "Reza Putra", points: 40, scans: 4 },
          ].map((user) => (
            <div key={user.rank} className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                user.rank === 1 ? "bg-yellow-700/40 text-yellow-300" :
                user.rank === 2 ? "bg-gray-700/40 text-gray-300" :
                user.rank === 3 ? "bg-orange-900/40 text-orange-400" :
                "bg-green-900/30 text-green-500"
              }`}>
                {user.rank}
              </div>
              <div className="flex-1">
                <p className="text-sm text-green-200">{user.name}</p>
                <p className="text-xs text-green-700">{user.scans}x scan QR</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-green-400">+{user.points} pts</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
