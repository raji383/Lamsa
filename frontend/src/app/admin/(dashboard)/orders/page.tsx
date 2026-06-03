"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { adminRequest } from "@/lib/admin-api";
import { formatPrice } from "@/lib/utils";

interface OrderRow {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  total: number;
  status: string;
  created_at: string;
}

const STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrdersPage() {
  const token = useAuthStore((s) => s.token)!;
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [filter, setFilter] = useState("");

  const load = () => {
    const q = filter ? `?status=${filter}` : "";
    adminRequest<{ data: OrderRow[] }>(`/admin/orders${q}`, token)
      .then((res) => setOrders(res.data ?? []))
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, [token, filter]);

  const updateStatus = async (id: string, status: string) => {
    await adminRequest(`/admin/orders/${id}/status`, token, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    load();
  };

  return (
    <div>
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-6 border px-4 py-2 text-sm"
      >
        <option value="">All statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <div className="bg-white border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Order</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="p-4 font-medium">{o.order_number}</td>
                <td className="p-4">{o.customer_name}</td>
                <td className="p-4">{o.customer_phone}</td>
                <td className="p-4">{formatPrice(o.total)}</td>
                <td className="p-4 capitalize">{o.status}</td>
                <td className="p-4">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="border px-2 py-1 text-xs"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
