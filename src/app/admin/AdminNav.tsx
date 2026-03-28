"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./admin.module.css";

const links = [
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/calendar", label: "Calendar" },
  { href: "/admin/services", label: "Services" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Admin navigation">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
