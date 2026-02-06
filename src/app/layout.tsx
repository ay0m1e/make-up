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
                <p className={styles.footerTitle}>GLEEMAKEOVERS</p>
                <p className={styles.footerText}>
                  Soft, timeless makeup for modern brides and refined events.
                </p>
              </div>
              <div>
                <p className={styles.footerLabel}>Navigation</p>
                <div className={styles.footerLinks}>
                  <Link href="/" className={styles.footerLink}>
                    Home
                  </Link>
                  <Link href="/services" className={styles.footerLink}>
                    Services
                  </Link>
                  <Link href="/work" className={styles.footerLink}>
                    Work
                  </Link>
                  <Link href="/about" className={styles.footerLink}>
                    About
                  </Link>
                  <Link href="/book/service" className={styles.footerLink}>
                    Book
                  </Link>
                </div>
              </div>
              <div>
                <p className={styles.footerLabel}>Contact</p>
                <p className={styles.footerText}>+44 7438 972867</p>
                <p className={styles.footerText}>gleemakeovers@gmail.com</p>
                <p className={styles.footerText}>United Kingdom</p>
              </div>
              <div>
                <p className={styles.footerLabel}>Social</p>
                <div className={styles.footerLinks}>
                  <a
                    href="https://www.instagram.com"
                    className={styles.footerLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://wa.me/"
                    className={styles.footerLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
            <div className={styles.footerNote}>
              A 50% non-refundable deposit is required to secure all bookings.
            </div>
            <div className={styles.footerBottom}>
              © GLEEMAKEOVERS. All rights reserved.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
