"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  Users,
  MessageSquare,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, token, user, logout } = useAuthStore();

  useEffect(() => {
    if (pathname === "/admin/login") return;
    if (!isAuthenticated || !token) {
      router.replace("/admin/login");
    }
  }, [isAuthenticated, token, pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!token) return null;

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-brand-dark text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="font-serif text-2xl">
            Lamsa
          </Link>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
            Admin
          </p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 text-sm rounded transition-colors ${
                pathname === href
                  ? "bg-brand-gold text-brand-dark"
                  : "hover:bg-white/10"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-gray-400 mb-2 truncate">{user?.email}</p>
          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/admin/login");
            }}
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center">
          <h1 className="font-serif text-xl text-brand-dark capitalize">
            {pathname.split("/").pop()?.replace("-", " ") ?? "Dashboard"}
          </h1>
          <Link href="/" className="text-sm text-brand-taupe hover:text-brand-gold">
            View Store →
          </Link>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
