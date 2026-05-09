"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Leaf, Mail, Lock, User, Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const ensureProfile = useMutation(api.users.ensureProfile);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function validate() {
    if (form.password.length < 8) return "Password minimal 8 karakter.";
    if (form.password !== form.confirm) return "Password dan konfirmasi tidak cocok.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setLoading(true);
    try {
      await signIn("password", {
        email: form.email,
        password: form.password,
        name: form.name,
        flow: "signUp",
      });
      // Make sure a profile row exists for this newly-created user.
      await ensureProfile({ name: form.name });
      router.push("/dashboard");
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message.includes("InvalidAccountId")
            ? "Email sudah terdaftar. Coba masuk."
            : "Pendaftaran gagal. Silakan coba lagi."
          : "Pendaftaran gagal. Silakan coba lagi.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const passwordStrength =
    form.password.length === 0 ? 0 : form.password.length < 8 ? 1 : form.password.length < 12 ? 2 : 3;
  const strengthLabel = ["", "Lemah", "Cukup", "Kuat"];
  const strengthColor = ["", "bg-red-500", "bg-yellow-500", "bg-green-500"];

  return (
    <div className="min-h-screen bg-[#0e1411] flex items-center justify-center px-4 py-10">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-green-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center glow-green-sm group-hover:scale-110 transition-transform">
              <Leaf size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">SmartBin</span>
          </Link>
          <p className="text-green-600 text-sm mt-2">Buat akun dan mulai dapatkan eco-points</p>
        </div>

        <div className="glass rounded-3xl p-7 sm:p-8">
          <h1 className="text-2xl font-bold text-white mb-2">Buat Akun Baru</h1>
          <p className="text-sm text-green-600 mb-6">Gratis selamanya. Mulai kumpulkan eco-points hari ini.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nama Lengkap"
              type="text"
              placeholder="Nama kamu"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              icon={<User size={16} />}
              required
              autoComplete="name"
            />
            <Input
              label="Email"
              type="email"
              placeholder="kamu@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              icon={<Mail size={16} />}
              required
              autoComplete="email"
            />

            <div>
              <div className="relative">
                <Input
                  label="Password"
                  type={showPass ? "text" : "password"}
                  placeholder="Min. 8 karakter"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  icon={<Lock size={16} />}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-9 text-green-600 hover:text-green-400 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-green-900/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${strengthColor[passwordStrength]}`}
                      style={{ width: `${(passwordStrength / 3) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-green-600">{strengthLabel[passwordStrength]}</span>
                </div>
              )}
            </div>

            <Input
              label="Konfirmasi Password"
              type={showPass ? "text" : "password"}
              placeholder="Ulangi password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              icon={<Lock size={16} />}
              required
              autoComplete="new-password"
              error={form.confirm && form.confirm !== form.password ? "Password tidak cocok" : undefined}
            />

            {error && (
              <div className="text-sm text-red-400 bg-red-900/20 border border-red-800/40 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <div className="flex items-start gap-2 text-xs text-green-600">
              <CheckCircle2 size={13} className="text-green-700 shrink-0 mt-0.5" />
              Dengan mendaftar, kamu menyetujui kebijakan privasi SmartBin.
            </div>

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Buat Akun
            </Button>
          </form>

          <p className="text-center text-sm text-green-600 mt-5">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-green-400 hover:text-green-300 font-medium transition-colors">
              Masuk sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
