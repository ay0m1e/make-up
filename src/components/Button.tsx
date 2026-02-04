// Reusable button styling for editorial UI.
import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

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
  const variantClass = variant === "ghost" ? styles.ghost : styles.primary;
  const combined = [styles.base, variantClass, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={combined} {...rest}>
      {children}
    </button>
  );
}
