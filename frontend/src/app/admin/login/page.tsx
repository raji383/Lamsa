"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

export default function AdminLoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState("admin@lamsa.ma");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await adminLogin(email, password);
      const user = data.user as {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        role: string;
      };
      setAuth(
        {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
        },
        data.access_token
      );
      router.push("/admin");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light px-4">
      <div className="w-full max-w-md bg-white p-10 shadow-sm border border-brand-beige/50">
        <h1 className="font-serif text-3xl text-brand-dark text-center mb-2">
          Lamsa Admin
        </h1>
        <p className="text-center text-sm text-brand-taupe mb-8">
          Sign in to manage your boutique
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-brand-beige px-4 py-3 focus:border-brand-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-brand-beige px-4 py-3 focus:border-brand-gold focus:outline-none"
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-dark text-white py-4 text-sm uppercase tracking-widest hover:bg-brand-gold transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="text-xs text-center text-brand-taupe mt-6">
          Default: admin@lamsa.ma / LamsaAdmin2024!
        </p>
      </div>
    </div>
  );
}
