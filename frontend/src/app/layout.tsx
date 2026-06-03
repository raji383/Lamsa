import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Lamsa | Elegance in Every Touch",
    template: "%s | Lamsa",
  },
  description:
    "Premium Moroccan women's fashion. Home dresses, elegant lounge wear, modest dresses, and luxury pyjamas.",
  openGraph: {
    type: "website",
    locale: "en_MA",
    siteName: "Lamsa",
    title: "Lamsa | Elegance in Every Touch",
    description:
      "Premium Moroccan women's fashion — luxury home dresses and loungewear.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
