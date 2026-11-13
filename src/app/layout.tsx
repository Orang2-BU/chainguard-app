import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Link from "next/link";
import { House, ListOrdered } from "lucide-react";
import Logo from "@/components/Logo";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ChainGuard",
  description: "Pantau kondisi cabai dan bawang merah dari panen sampai pasar.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <header className="site-header">
          <div className="wrap header-in">
            <Link href="/" className="brand">
              <Logo />
            </Link>
            <span className="badge-demo">Data contoh</span>
            <nav className="nav">
              <Link href="/">
                <House size={15} strokeWidth={2.1} aria-hidden="true" />
                Beranda
              </Link>
              <Link href="/prioritas">
                <ListOrdered size={15} strokeWidth={2.1} aria-hidden="true" />
                Urutan Jual
              </Link>
            </nav>
          </div>
        </header>
        <main className="wrap">{children}</main>
        <footer className="site-footer">
          <div className="wrap">
            <p>
              Halaman ini menampilkan data contoh untuk pengujian perangkat lunak, bukan data
              lapangan. Batas aman dan ambang peringatan adalah parameter contoh yang akan dikunci
              dari literatur dan kesepakatan pelaku sebelum uji lapangan.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
