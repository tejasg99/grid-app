import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grid Clash - Real-time Multiplayer Grid Game",
  description: "Claim cells and compete with others in real-time!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 antialiased">{children}</body>
    </html>
  );
}
