// Root layout for the editorial site.
import "./globals.css";
import type { ReactNode } from "react";
import Link from "next/link";
import { Cormorant_Garamond, Manrope } from "next/font/google";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
});

export const metadata = {
  title: "Liora Atelier | Luxury Makeup Artistry",
  description:
    "Editorial makeup for weddings, campaigns, and private appointments with a calm, refined touch.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} font-sans`}>
        <div className="min-h-screen bg-stone-50">
          <header className="border-b border-stone-200/60">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 lg:px-12">
              <Link href="/" className="font-serif text-2xl tracking-tight">
                Liora Atelier
              </Link>
              <nav className="hidden items-center gap-8 text-sm uppercase tracking-[0.25em] text-stone-500 md:flex">
                <Link href="/work" className="transition hover:text-stone-900">
                  Work
                </Link>
                <Link
                  href="/services"
                  className="transition hover:text-stone-900"
                >
                  Services
                </Link>
                <Link href="/faq" className="transition hover:text-stone-900">
                  FAQ
                </Link>
              </nav>
              <Link
                href="/book/service"
                className="rounded-full border border-stone-900 px-5 py-2 text-sm uppercase tracking-[0.2em] text-stone-900 transition hover:bg-stone-900 hover:text-stone-50"
              >
                Book
              </Link>
            </div>
          </header>
          {children}
          <footer className="border-t border-stone-200/70">
            <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 lg:grid-cols-3 lg:px-12">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                  Studio
                </p>
                <p className="mt-3 text-lg font-serif text-stone-900">
                  Liora Atelier
                </p>
                <p className="mt-2 text-sm text-stone-600">
                  Based in New York. Available for destination weddings and
                  editorial travel worldwide.
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                  Inquiries
                </p>
                <p className="mt-3 text-sm text-stone-700">
                  hello@liora-atelier.com
                </p>
                <p className="mt-2 text-sm text-stone-700">
                  +1 (212) 555-0183
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                  Studio Hours
                </p>
                <p className="mt-3 text-sm text-stone-700">
                  Tuesday - Saturday
                </p>
                <p className="mt-2 text-sm text-stone-700">
                  9:00 AM - 6:00 PM
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
