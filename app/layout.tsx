import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prestige Properties — Find Your Perfect Home",
  description:
    "Expert real estate guidance from search to close. Prestige Properties helps buyers and sellers navigate the market with confidence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
