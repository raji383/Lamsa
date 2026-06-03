export interface WhatsAppOrderLine {
  productName: string;
  size?: string;
  color?: string;
  quantity: number;
  price: number;
  currency?: string;
}

export function buildWhatsAppOrderMessage(
  lines: WhatsAppOrderLine[],
  notes?: string
): string {
  const parts = ["Hello Lamsa,", "", "I would like to order:", ""];

  lines.forEach((line, index) => {
    if (lines.length > 1) {
      parts.push(`Item ${index + 1}:`);
    }
    parts.push(`Product: ${line.productName}`);
    if (line.size) parts.push(`Size: ${line.size}`);
    if (line.color) parts.push(`Color: ${line.color}`);
    parts.push(`Quantity: ${line.quantity}`);
    parts.push(
      `Price: ${line.price.toLocaleString("fr-MA")} ${line.currency ?? "MAD"}`
    );
    parts.push("");
  });

  parts.push("Please confirm availability.");
  if (notes?.trim()) {
    parts.push("", `Notes: ${notes.trim()}`);
  }

  return parts.join("\n");
}

export function buildSingleProductMessage(line: WhatsAppOrderLine): string {
  return buildWhatsAppOrderMessage([line]);
}

/** Normalize phone for wa.me (digits only, no +) */
export function normalizeWhatsAppNumber(raw: string): string {
  return raw.replace(/\D/g, "");
}

export function getWhatsAppUrl(phone: string, message: string): string {
  const number = normalizeWhatsAppNumber(phone);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encoded}`;
}

export function openWhatsAppOrder(phone: string, message: string): void {
  const url = getWhatsAppUrl(phone, message);
  window.open(url, "_blank", "noopener,noreferrer");
}
