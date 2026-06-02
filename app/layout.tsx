import type { Metadata } from "next";
import { Geist, Vazirmatn } from "next/font/google";
import Providers from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "Patch",
  description: "Find padel and tennis matches, leagues, and courts near you",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${vazirmatn.variable} h-full antialiased`}>
      <body className="min-h-full bg-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

