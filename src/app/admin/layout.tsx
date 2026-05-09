"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Leaf, LayoutDashboard, Trash2, Route, BarChart3,
  LogOut, Bell, Shield, ChevronDown
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/bins", icon: Trash2, label: "SmartBins" },
  { href: "/admin/routes", icon: Route, label: "Rute Penjemputan" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analitik" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  // Skip layout for admin login page
  if (pathname === "/admin") return <>{children}</>;

  function handleLogout() {
    document.cookie = "admin_session=; path=/; max-age=0";
    router.push("/admin");
  }

  return (
    <div className="min-h-screen bg-[#0a0e0c] flex">
      {/* Sidebar */}
      <aside className={cn(
        "hidden lg:flex flex-col glass border-r border-green-900/30 min-h-screen sticky top-0 h-screen transition-all",
        collapsed ? "w-16" : "w-60"
      )}>
        {/* Logo */}
        <div className="p-4 border-b border-green-900/30 flex items-center justify-between">
          {!collapsed && (
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-green-700 flex items-center justify-center shrink-0">
                <Leaf size={14} className="text-white" />
              </div>
              <span className="font-bold text-sm gradient-text">SmartBin Admin</span>
            </Link>
          )}
          {collapsed && (
            <div className="w-7 h-7 rounded-lg bg-green-700 flex items-center justify-center mx-auto">
              <Leaf size={14} className="text-white" />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn("p-1 text-green-700 hover:text-green-400 transition-colors", collapsed && "mx-auto mt-1")}
          >
            <ChevronDown size={14} className={cn("transition-transform", collapsed ? "-rotate-90" : "rotate-90")} />
          </button>
        </div>

        {/* Admin badge */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-green-900/30">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-800/60 flex items-center justify-center">
                <Shield size={14} className="text-green-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-green-300">Administrator</p>
                <p className="text-[10px] text-green-700">admin@smartbin.com</p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  collapsed && "justify-center",
                  active
                    ? "bg-green-700/30 text-green-300 border border-green-700/40"
                    : "text-green-600 hover:text-green-400 hover:bg-green-900/20"
                )}
              >
                <item.icon size={17} className="shrink-0" />
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-green-900/30 space-y-1">
          <Link href="/" title={collapsed ? "Lihat Website" : undefined}
            className={cn("flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-green-700 hover:text-green-500 hover:bg-green-900/10 transition-all", collapsed && "justify-center")}>
            <Leaf size={15} className="shrink-0" />
            {!collapsed && "Lihat Website"}
          </Link>
          <button
            onClick={handleLogout}
            title={collapsed ? "Logout" : undefined}
            className={cn("flex items-center gap-3 w-full px-3 py-2 rounded-xl text-xs text-green-700 hover:text-red-400 hover:bg-red-900/10 transition-all", collapsed && "justify-center")}
          >
            <LogOut size={15} className="shrink-0" />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 glass border-b border-green-900/30 h-14 flex items-center justify-between px-5">
          <div className="flex items-center gap-2 lg:hidden">
            <Leaf size={16} className="text-green-500" />
            <span className="font-bold gradient-text text-sm">SmartBin Admin</span>
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-green-300">
              {navItems.find((n) => n.href === pathname)?.label || "Admin Panel"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-green-600">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Sistem Online
            </div>
            <button className="p-2 text-green-600 hover:text-green-400 relative">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Mobile nav */}
        <nav className="lg:hidden flex border-b border-green-900/30 bg-[#0a0e0c] overflow-x-auto">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-all",
                  active
                    ? "border-green-500 text-green-400"
                    : "border-transparent text-green-700 hover:text-green-500"
                )}
              >
                <item.icon size={14} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
