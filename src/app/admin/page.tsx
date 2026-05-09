"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Lock, Mail, Eye, EyeOff, Shield, Leaf } from "lucide-react";
import Link from "next/link";

// Demo admin credentials shown subtly for prototype
const DEMO_EMAIL = "admin@smartbin.com";
const DEMO_PASS = "admin1234";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Prototype: credential check + cookie flag (admin area is gated by middleware).
    if (form.email === DEMO_EMAIL && form.password === DEMO_PASS) {
      document.cookie = "admin_session=true; path=/; max-age=86400";
      router.push("/admin/dashboard");
      return;
    }
    setError("Kredensial admin tidak valid.");
    setLoading(false);
  }

  function fillDemo() {
    setForm({ email: DEMO_EMAIL, password: DEMO_PASS });
  }

  return (
    <div className="min-h-screen bg-[#0a0e0c] flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(20,83,45,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(20,83,45,0.04)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-green-900/50 border border-green-800/60 flex items-center justify-center mx-auto mb-4">
            <Shield size={26} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
          <p className="text-green-700 text-sm mt-1">SmartBin Management System</p>
        </div>

        <div className="glass rounded-3xl p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Admin"
              type="email"
              placeholder="admin@smartbin.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              icon={<Mail size={15} />}
              required
              autoComplete="email"
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPass ? "text" : "password"}
                placeholder="Password admin"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                icon={<Lock size={15} />}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-9 text-green-600 hover:text-green-400"
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-900/20 border border-red-800/40 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Masuk ke Dashboard
            </Button>
          </form>

          {/* Demo hint */}
          <div className="mt-5 rounded-xl bg-green-900/10 border border-green-900/40 p-3">
            <p className="text-xs text-green-600 mb-2 font-medium">Demo Prototype</p>
            <p className="text-xs text-green-700 font-mono">{DEMO_EMAIL}</p>
            <p className="text-xs text-green-700 font-mono">{DEMO_PASS}</p>
            <button
              type="button"
              onClick={fillDemo}
              className="mt-2 text-xs text-green-500 hover:text-green-400 underline"
            >
              Isi otomatis
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-green-800 hover:text-green-600 transition-colors">
            <Leaf size={11} />
            Kembali ke SmartBin
          </Link>
        </div>
      </div>
    </div>
  );
}
