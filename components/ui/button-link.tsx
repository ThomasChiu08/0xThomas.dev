import type { AnchorHTMLAttributes, ReactNode } from "react";

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
};

const variantClasses = {
  primary:
    "border-accent bg-accent text-text shadow-[0_16px_38px_rgba(202,255,0,0.22)] hover:bg-accent-strong",
  secondary:
    "border-line/70 bg-surface/70 text-text hover:border-text hover:bg-background",
};

export function ButtonLink({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  return (
    <a
      className={`group inline-flex h-12 items-center justify-center gap-4 rounded-[4px] border px-5 text-sm font-medium tracking-normal transition duration-200 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      <span>{children}</span>
      <svg
        aria-hidden="true"
        className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
        fill="none"
        viewBox="0 0 16 16"
      >
        <path
          d="M3.5 8h8m0 0-3-3m3 3-3 3"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </svg>
    </a>
  );
}
