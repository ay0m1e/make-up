// Root layout for the editorial site.
import "./globals.css";
import type { ReactNode } from "react";
import Link from "next/link";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import styles from "./layout.module.css";
import { MobileMenu } from "../components/MobileMenu";

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
  title: "GLEEMAKEOVERS | Makeup Artistry",
  description:
    "Professional makeup, bridal hair styling, and semi-permanent brows.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} ${styles.body}`}>
        <div className={styles.shell}>
          <header className={styles.header}>
            <div className={styles.container}>
              <Link href="/" className={styles.brand}>
                GLEEMAKEOVERS
              </Link>
              <nav className={styles.nav}>
                <Link href="/" className={styles.navLink}>
                  Home
                </Link>
                <Link href="/work" className={styles.navLink}>
                  Work
                </Link>
                <Link href="/services" className={styles.navLink}>
                  Services
                </Link>
                <Link href="/about" className={styles.navLink}>
                  About
                </Link>
              </nav>
              <MobileMenu />
              <Link
                href="/book/service"
                className={styles.cta}
              >
                Book
              </Link>
            </div>
          </header>
          {children}
          <footer className={styles.footer}>
            <div className={styles.footerGrid}>
              <div>
                <p className={styles.footerLabel}>
                  Studio
                </p>
                <p className={styles.footerTitle}>
                  GLEEMAKEOVERS
                </p>
                <p className={styles.footerText}>
                  Based in New York. Available for destination weddings and
                  editorial travel worldwide.
                </p>
              </div>
              <div>
                <p className={styles.footerLabel}>
                  Inquiries
                </p>
                <p className={styles.footerText}>
                  hello@liora-atelier.com
                </p>
                <p className={styles.footerText}>
                  +1 (212) 555-0183
                </p>
              </div>
              <div>
                <p className={styles.footerLabel}>
                  Studio Hours
                </p>
                <p className={styles.footerText}>
                  Tuesday - Saturday
                </p>
                <p className={styles.footerText}>
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
