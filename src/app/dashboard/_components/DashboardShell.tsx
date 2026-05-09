"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useCurrentUser } from "@/lib/use-current-user";
import { cn } from "@/lib/utils";
import {
  Leaf, Home, QrCode, Gift, User, LogOut, Menu, X, Bell
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Beranda" },
  { href: "/dashboard/scan", icon: QrCode, label: "Scan QR" },
  { href: "/dashboard/rewards", icon: Gift, label: "Rewards" },
  { href: "/dashboard/profile", icon: User, label: "Profil" },
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useCurrentUser();
  const { signOut } = useAuthActions();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await signOut();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-[#0e1411] flex flex-col">
      {/* Top nav (mobile) */}
      <header className="lg:hidden sticky top-0 z-40 glass border-b border-green-900/30 h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Leaf size={18} className="text-green-500" />
          <span className="font-bold gradient-text text-lg">SmartBin</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-green-600 hover:text-green-400">
            <Bell size={18} />
          </button>
          <button
            className="p-2 text-green-400"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:flex w-60 shrink-0 flex-col glass border-r border-green-900/30 min-h-screen sticky top-0 h-screen">
          <div className="p-5 border-b border-green-900/30">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
                <Leaf size={16} className="text-white" />
              </div>
              <span className="font-bold gradient-text">SmartBin</span>
            </Link>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-green-900/30">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-green-700/50 flex items-center justify-center text-sm font-bold text-green-300">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-green-200 truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-green-600 truncate">{user?.email || ""}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                    active
                      ? "bg-green-700/30 text-green-300 border border-green-700/40"
                      : "text-green-600 hover:text-green-400 hover:bg-green-900/20"
                  )}
                >
                  <item.icon size={17} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-green-900/30">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-green-700 hover:text-red-400 hover:bg-red-900/10 transition-all"
            >
              <LogOut size={17} />
              Keluar
            </button>
          </div>
        </aside>

        {/* Mobile overlay menu */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <div className="absolute left-0 top-14 bottom-0 w-64 glass border-r border-green-900/30 flex flex-col">
              <div className="p-4 border-b border-green-900/30">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-green-700/50 flex items-center justify-center text-sm font-bold text-green-300">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-green-200 truncate">{user?.name || "User"}</p>
                    <p className="text-xs text-green-600 truncate">{user?.email || ""}</p>
                  </div>
                </div>
              </div>
              <nav className="flex-1 p-3 space-y-1">
                {navItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all",
                        active
                          ? "bg-green-700/30 text-green-300 border border-green-700/40"
                          : "text-green-600 hover:text-green-400 hover:bg-green-900/20"
                      )}
                    >
                      <item.icon size={17} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="p-3 border-t border-green-900/30">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm text-green-700 hover:text-red-400 hover:bg-red-900/10 transition-all"
                >
                  <LogOut size={17} />
                  Keluar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Bottom nav (mobile) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-green-900/30 flex">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-all",
                active ? "text-green-400" : "text-green-700 hover:text-green-500"
              )}
            >
              <item.icon size={20} className={active ? "drop-shadow-[0_0_6px_rgba(74,222,128,0.8)]" : ""} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
