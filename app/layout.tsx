import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { siteConfig } from "@/lib/content";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: "%s | 0xThomas",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: "Thomas" }],
  creator: "Thomas",
  keywords: [
    "0xThomas",
    "Thomas",
    "AI",
    "finance",
    "crypto",
    "trading systems",
    "developer tools",
    "personal operating systems",
    "research notes",
  ],
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: "0xThomas personal website",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/og.svg"],
  },
  icons: {
    icon: "/mark.svg",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#FBFAF5",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
