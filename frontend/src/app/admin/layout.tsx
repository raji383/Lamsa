export const metadata = {
  title: "Admin | Lamsa",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-gray-50 font-sans">{children}</div>;
}
