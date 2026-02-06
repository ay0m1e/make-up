// Mobile-only navigation overlay.
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./MobileMenu.module.css";

export function MobileMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
    document.body.style.overflow = "";
    return undefined;
  }, [menuOpen]);

  const overlay = (
    <>
      <div
        className={`${styles.menuBackdrop} ${
          menuOpen ? styles.menuBackdropOpen : ""
        }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={`${styles.menuPanel} ${
          menuOpen ? styles.menuPanelOpen : ""
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.menuBrand}>GLEEMAKEOVERS</div>
        <button
          type="button"
          className={styles.menuCloseButton}
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        >
          ×
        </button>
        <nav className={styles.menuList}>
          <Link
            href="/"
            className={styles.menuLink}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/services"
            className={styles.menuLink}
            onClick={() => setMenuOpen(false)}
          >
            Services
          </Link>
          <Link
            href="/work"
            className={styles.menuLink}
            onClick={() => setMenuOpen(false)}
          >
            Work
          </Link>
          <Link
            href="/about"
            className={styles.menuLink}
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/book/service"
            className={styles.menuCta}
            onClick={() => setMenuOpen(false)}
          >
            Book
          </Link>
        </nav>
      </aside>
    </>
  );

  return (
    <>
      <button
        type="button"
        className={styles.menuButton}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? (
          <span className={styles.menuGlyph} aria-hidden="true">
            ×
          </span>
        ) : (
          <span className={styles.menuIcon} />
        )}
      </button>
      {mounted ? createPortal(overlay, document.body) : null}
    </>
  );
}
