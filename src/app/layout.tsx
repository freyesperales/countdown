import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "countdown — beautiful, embeddable countdowns",
  description:
    "Make a beautiful countdown to any date. No signup, no ads, no analytics. Share by URL, embed in any page.",
  openGraph: {
    title: "countdown",
    description: "Make a beautiful countdown to any date.",
    images: ["/og.png"],
  },
  referrer: "no-referrer",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <head>
        <meta name="referrer" content="no-referrer" />
      </head>
      <body>{children}</body>
    </html>
  );
}
