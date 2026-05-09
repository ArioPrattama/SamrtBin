"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, Leaf, LogOut, LayoutDashboard } from "lucide-react";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import Button from "@/components/ui/Button";
import { useCurrentUser } from "@/lib/use-current-user";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const user = useCurrentUser();

  async function handleSignOut() {
    await signOut();
    setOpen(false);
    // Stay on landing — user can browse marketing freely after logout.
    router.refresh();
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[#84a98c]/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#2f5d3f] border border-[#84a98c]/25 flex items-center justify-center group-hover:border-[#84a98c]/45 transition-colors">
            <Leaf size={16} className="text-[#b3cdb6]" />
          </div>
          <span className="text-lg font-semibold text-[#e7eee9] tracking-tight">SmartBin</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7 text-sm text-[#97a89d]">
          <a href="#features" className="hover:text-[#b3cdb6] transition-colors">Fitur</a>
          <a href="#how-it-works" className="hover:text-[#b3cdb6] transition-colors">Cara Kerja</a>
          <a href="#rewards" className="hover:text-[#b3cdb6] transition-colors">Reward</a>
        </div>

        {/* CTA — varies by auth state */}
        <div className="hidden md:flex items-center gap-3">
          {isLoading ? (
            // loading skeleton — keeps layout stable
            <div className="h-8 w-28 rounded-lg bg-[#1c2620] animate-pulse" />
          ) : isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 text-sm text-[#97a89d]">
                <div className="w-7 h-7 rounded-full bg-[#2f5d3f] border border-[#84a98c]/25 flex items-center justify-center text-xs font-semibold text-[#b3cdb6]">
                  {user?.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                <span className="hidden lg:inline truncate max-w-[8rem]">
                  {user?.name?.split(" ")[0] ?? "Pengguna"}
                </span>
              </div>
              <Link href="/dashboard">
                <Button size="sm">
                  <LayoutDashboard size={14} /> Buka Dashboard
                </Button>
              </Link>
              <button
                onClick={handleSignOut}
                title="Keluar"
                className="p-2 rounded-lg text-[#97a89d] hover:text-red-300 hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Masuk</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Daftar Gratis</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-[#b3cdb6] hover:text-[#e7eee9]"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[#84a98c]/10 bg-[#161c17]/95 backdrop-blur px-4 py-4 flex flex-col gap-3">
          <a href="#features" className="text-[#97a89d] py-2" onClick={() => setOpen(false)}>Fitur</a>
          <a href="#how-it-works" className="text-[#97a89d] py-2" onClick={() => setOpen(false)}>Cara Kerja</a>
          <a href="#rewards" className="text-[#97a89d] py-2" onClick={() => setOpen(false)}>Reward</a>
          <hr className="border-[#84a98c]/15" />

          {isLoading ? (
            <div className="h-10 rounded-lg bg-[#1c2620] animate-pulse" />
          ) : isAuthenticated ? (
            <>
              <div className="flex items-center gap-2.5 px-2 py-1.5 text-sm text-[#97a89d]">
                <div className="w-8 h-8 rounded-full bg-[#2f5d3f] border border-[#84a98c]/25 flex items-center justify-center text-xs font-semibold text-[#b3cdb6]">
                  {user?.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                <div className="min-w-0">
                  <div className="text-[#e7eee9] truncate">{user?.name ?? "Pengguna"}</div>
                  <div className="text-[11px] text-[#5e6e64] truncate">{user?.email ?? ""}</div>
                </div>
              </div>
              <Link href="/dashboard" onClick={() => setOpen(false)}>
                <Button size="sm" className="w-full">
                  <LayoutDashboard size={14} /> Buka Dashboard
                </Button>
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm text-[#97a89d] hover:text-red-300 py-2 flex items-center gap-2"
              >
                <LogOut size={14} /> Keluar
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button variant="secondary" size="sm" className="w-full">Masuk</Button>
              </Link>
              <Link href="/register" onClick={() => setOpen(false)}>
                <Button size="sm" className="w-full">Daftar Gratis</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
