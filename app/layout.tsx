import type { Metadata } from "next";
import { Syne, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-space",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SENTINEL — Global Emergency Operations Command Center",
  description:
    "SENTINEL: Real-time multi-theatre disaster response coordination. 54 active teams. 8 crisis zones. Lives protected.",
  keywords: "emergency operations, disaster response, command center, crisis coordination",
  openGraph: {
    title: "SENTINEL — Global Emergency Operations Command Center",
    description: "Real-time emergency operations and logistics coordination dashboard.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${syne.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} bg-[#0a0a0f] text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
