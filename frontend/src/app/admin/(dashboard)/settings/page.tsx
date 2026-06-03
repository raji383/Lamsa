"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { adminRequest } from "@/lib/admin-api";

interface Setting {
  key: string;
  value: string;
  group_name: string;
  description?: string;
}

export default function AdminSettingsPage() {
  const token = useAuthStore((s) => s.token)!;
  const [settings, setSettings] = useState<Setting[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminRequest<{ data: Setting[] }>("/admin/settings", token)
      .then((res) => {
        const list = res.data ?? [];
        setSettings(list);
        const map: Record<string, string> = {};
        list.forEach((s) => {
          map[s.key] = s.value;
        });
        setValues(map);
      })
      .catch(() => {});
  }, [token]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminRequest("/admin/settings", token, {
      method: "PUT",
      body: JSON.stringify(values),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const important = [
    "whatsapp_number",
    "hero_title",
    "hero_subtitle",
    "hero_image_1",
    "hero_image_2",
    "hero_image_3",
    "instagram_url",
    "facebook_url",
    "tiktok_url",
    "contact_email",
    "contact_phone",
    "contact_address",
    "about_story",
    "about_mission",
    "about_vision",
    "footer_text",
    "shipping_cost",
    "free_shipping_threshold",
  ];

  const display = settings.filter(
    (s) => important.includes(s.key) || s.group_name === "homepage"
  );

  return (
    <form onSubmit={save} className="max-w-2xl space-y-6">
      <p className="text-sm text-gray-500 mb-4">
        Configure WhatsApp number, hero content, social links, and more — no code
        changes required.
      </p>
      {display.map((s) => (
        <div key={s.key}>
          <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1">
            {s.key.replace(/_/g, " ")}
          </label>
          {s.value.length > 80 || s.key.includes("story") ? (
            <textarea
              rows={3}
              value={values[s.key] ?? ""}
              onChange={(e) =>
                setValues({ ...values, [s.key]: e.target.value })
              }
              className="w-full border px-4 py-2 text-sm"
            />
          ) : (
            <input
              value={values[s.key] ?? ""}
              onChange={(e) =>
                setValues({ ...values, [s.key]: e.target.value })
              }
              className="w-full border px-4 py-2 text-sm"
            />
          )}
          {s.description && (
            <p className="text-xs text-gray-400 mt-1">{s.description}</p>
          )}
        </div>
      ))}
      <button
        type="submit"
        className="bg-brand-dark text-white px-8 py-3 text-sm uppercase tracking-widest hover:bg-brand-gold"
      >
        Save Settings
      </button>
      {saved && (
        <p className="text-brand-gold text-sm">Settings saved successfully.</p>
      )}
    </form>
  );
}
