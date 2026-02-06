// Footer-only navigation with smooth scroll on same-page clicks.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/book/service", label: "Book" },
];

type Props = {
  className?: string;
  linkClassName?: string;
};

function normalisePath(path: string) {
  if (path.length > 1 && path.endsWith("/")) {
    return path.slice(0, -1);
  }
  return path;
}

export function FooterNav({ className, linkClassName }: Props) {
  const pathname = usePathname();
  const current = normalisePath(pathname ?? "/");

  return (
    <div className={className}>
      {links.map((link) => {
        const href = normalisePath(link.href);
        const isCurrent = href === current;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={linkClassName}
            onClick={(event) => {
              if (!isCurrent) return;
              event.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
