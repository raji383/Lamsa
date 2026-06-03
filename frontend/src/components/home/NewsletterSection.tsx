"use client";

import { useState } from "react";
import { subscribeNewsletter } from "@/lib/api";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await subscribeNewsletter(email);
      setStatus("ok");
      setEmail("");
    } catch {
      setStatus("err");
    }
  };

  return (
    <section className="py-24 bg-brand-beige/30">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-brand-dark mb-4">
          Join the Lamsa Circle
        </h2>
        <p className="text-brand-taupe mb-8">
          Be the first to discover new collections, exclusive offers, and styling
          inspiration.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 border border-brand-taupe/30 bg-white px-4 py-3 text-sm focus:outline-none focus:border-brand-gold"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-brand-dark text-white px-8 py-3 text-sm uppercase tracking-widest hover:bg-brand-gold transition-colors disabled:opacity-60"
          >
            Subscribe
          </button>
        </form>
        {status === "ok" && (
          <p className="mt-4 text-sm text-brand-gold">Thank you for subscribing.</p>
        )}
        {status === "err" && (
          <p className="mt-4 text-sm text-red-600">Something went wrong. Please try again.</p>
        )}
      </div>
    </section>
  );
}
