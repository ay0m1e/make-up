// Reusable button styling for editorial UI.
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "ghost";
};

export function Button({
  children,
  className,
  variant = "primary",
  type = "button",
  ...rest
}: Props) {
  const base =
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-xs uppercase tracking-[0.3em] transition";
  const styles = {
    primary: "bg-stone-900 text-stone-50 hover:bg-stone-800",
    ghost: "border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-stone-50",
  } as const;

  const combined = [base, styles[variant], className]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={combined} {...rest}>
      {children}
    </button>
  );
}
