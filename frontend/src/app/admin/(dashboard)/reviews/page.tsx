"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { adminRequest } from "@/lib/admin-api";

interface ReviewRow {
  id: number;
  product_name?: string;
  customer_name: string;
  rating: number;
  comment?: string;
  status: string;
}

export default function AdminReviewsPage() {
  const token = useAuthStore((s) => s.token)!;
  const [reviews, setReviews] = useState<ReviewRow[]>([]);

  const load = () => {
    adminRequest<{ data: ReviewRow[] }>("/admin/reviews", token)
      .then((res) => setReviews(res.data ?? []))
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, [token]);

  const setStatus = async (id: number, status: string) => {
    await adminRequest(`/admin/reviews/${id}/status`, token, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    load();
  };

  return (
    <div className="bg-white border overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 text-left">Product</th>
            <th className="p-4 text-left">Customer</th>
            <th className="p-4 text-left">Rating</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-4">{r.product_name ?? "—"}</td>
              <td className="p-4">{r.customer_name}</td>
              <td className="p-4">{r.rating}/5</td>
              <td className="p-4 capitalize">{r.status}</td>
              <td className="p-4 flex gap-2">
                {r.status === "pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() => setStatus(r.id, "approved")}
                      className="text-green-600 text-xs uppercase"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus(r.id, "rejected")}
                      className="text-red-600 text-xs uppercase"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
