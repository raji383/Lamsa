"use client";

import { useEffect, useState } from "react";
import { Share2, Camera, MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { fetchPublicSettings, type PublicSettings } from "@/lib/api";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export default function ContactPage() {
  const [settings, setSettings] = useState<PublicSettings>({});
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetchPublicSettings().then(setSettings).catch(() => {});
  }, []);

  const wa = settings.whatsapp_number ?? "212600000000";
  const waLink = getWhatsAppUrl(
    wa,
    "Hello Lamsa, I would like to get in touch."
  );

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif text-brand-dark mb-4">Contact Us</h1>
          <div className="h-0.5 w-16 bg-brand-gold mx-auto" />
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="space-y-6"
          >
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2">
                Name
              </label>
              <input
                required
                className="w-full border border-brand-beige px-4 py-3 focus:border-brand-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full border border-brand-beige px-4 py-3 focus:border-brand-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2">
                Message
              </label>
              <textarea
                required
                rows={5}
                className="w-full border border-brand-beige px-4 py-3 focus:border-brand-gold focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-brand-dark text-white px-8 py-4 text-sm uppercase tracking-widest hover:bg-brand-gold transition-colors"
            >
              Send Message
            </button>
            {sent && (
              <p className="text-sm text-brand-gold">
                Thank you. For urgent inquiries, reach us on WhatsApp.
              </p>
            )}
          </form>

          <div className="space-y-8">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-6 border border-brand-beige hover:border-[#25D366] hover:bg-[#25D366]/5 transition-colors group"
            >
              <MessageCircle className="h-8 w-8 text-[#25D366]" />
              <div>
                <p className="font-serif text-lg">WhatsApp</p>
                <p className="text-sm text-brand-taupe group-hover:text-brand-dark">
                  Chat with our team
                </p>
              </div>
            </a>

            <ul className="space-y-4 text-brand-taupe">
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-brand-gold" />
                {settings.contact_email ?? "contact@lamsa.ma"}
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-brand-gold" />
                {settings.contact_phone ?? "+212 600 000 000"}
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-brand-gold flex-shrink-0" />
                {settings.contact_address ?? "Casablanca, Morocco"}
              </li>
            </ul>

            <div className="flex gap-6 pt-4">
              <a
                href={settings.instagram_url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-taupe hover:text-brand-gold"
              >
                <Camera className="h-6 w-6" />
              </a>
              <a
                href={settings.facebook_url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-taupe hover:text-brand-gold"
              >
                <Share2 className="h-6 w-6" />
              </a>
              <a
                href={settings.tiktok_url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-taupe hover:text-brand-gold text-sm font-medium uppercase tracking-wider"
              >
                TikTok
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
