import type { PropsWithChildren } from "react";

type CardProps = PropsWithChildren<{
  className?: string;
}>;

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`border border-line/45 bg-surface/62 ${className}`}
      data-motion="card"
    >
      {children}
    </div>
  );
}
