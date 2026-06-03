"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { adminRequest } from "@/lib/admin-api";
import { formatPrice } from "@/lib/utils";

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  total_orders: number;
  total_spent: number;
}

export default function AdminCustomersPage() {
  const token = useAuthStore((s) => s.token)!;
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const q = search ? `?search=${encodeURIComponent(search)}` : "";
    adminRequest<{ data: Customer[] }>(`/admin/customers${q}`, token)
      .then((res) => setCustomers(res.data ?? []))
      .catch(() => {});
  }, [token, search]);

  return (
    <div>
      <input
        placeholder="Search by name or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 border px-4 py-2 w-full max-w-md"
      />
      <div className="bg-white border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Orders</th>
              <th className="p-4 text-left">Spent</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-4">
                  {c.first_name} {c.last_name}
                </td>
                <td className="p-4">{c.phone}</td>
                <td className="p-4">{c.total_orders}</td>
                <td className="p-4">{formatPrice(c.total_spent)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
