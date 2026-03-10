import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CuratorChat } from "@/components/ui/CuratorChat";
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
  title: "Self-Museum Oracle",
  description: "Descubre tu propia exposición de arte generativo con ayuda del Curador IA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        {children}
        <CuratorChat />
      </body>
    </html>
  );
}
