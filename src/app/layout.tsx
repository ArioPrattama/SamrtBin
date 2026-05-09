import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartBin — Tempat Sampah Pintar",
  description:
    "SmartBin adalah solusi pengelolaan sampah pintar berbasis IoT dengan sensor volume, dashboard real-time, dan sistem reward eco-points.",
  keywords: ["smartbin", "IoT", "sampah", "eco-points", "smart waste"],
  authors: [{ name: "SmartBin Team" }],
  openGraph: {
    title: "SmartBin — Tempat Sampah Pintar",
    description: "Buang sampah, dapat reward. Kelola sampah lebih efisien.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html
        lang="id"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-[#0e1411] text-green-50">
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
