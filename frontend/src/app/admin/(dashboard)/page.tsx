"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { adminRequest } from "@/lib/admin-api";
import { formatPrice } from "@/lib/utils";

interface DashboardData {
  stats: {
    total_products: number;
    total_orders: number;
    total_revenue: number;
    monthly_revenue: number;
    pending_orders: number;
    delivered_orders: number;
    total_customers: number;
  };
  recent_orders: {
    order_number: string;
    customer_name: string;
    total: number;
    status: string;
    created_at: string;
  }[];
}

export default function AdminDashboardPage() {
  const token = useAuthStore((s) => s.token)!;
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    adminRequest<{ success: boolean; data: DashboardData }>(
      "/admin/dashboard/stats",
      token
    )
      .then((res) => setData(res.data))
      .catch(() => {});
  }, [token]);

  const s = data?.stats;

  const cards = [
    { label: "Products", value: s?.total_products ?? "—" },
    { label: "Orders", value: s?.total_orders ?? "—" },
    { label: "Revenue", value: s ? formatPrice(s.total_revenue) : "—" },
    { label: "This Month", value: s ? formatPrice(s.monthly_revenue) : "—" },
    { label: "Pending", value: s?.pending_orders ?? "—" },
    { label: "Delivered", value: s?.delivered_orders ?? "—" },
    { label: "Customers", value: s?.total_customers ?? "—" },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-white p-6 border border-gray-100 shadow-sm"
          >
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
              {c.label}
            </p>
            <p className="text-2xl font-serif text-brand-dark">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 shadow-sm">
        <h2 className="font-serif text-lg p-6 border-b">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-4">Order</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {(data?.recent_orders ?? []).map((o) => (
                <tr key={o.order_number} className="border-t">
                  <td className="p-4 font-medium">{o.order_number}</td>
                  <td className="p-4">{o.customer_name}</td>
                  <td className="p-4">{formatPrice(o.total)}</td>
                  <td className="p-4 capitalize">{o.status}</td>
                  <td className="p-4 text-gray-500">
                    {new Date(o.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {!data?.recent_orders?.length && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
