import type { Metadata } from "next";
import { Geist } from "next/font/google";
import localFont from "next/font/local";
import Providers from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const yekanBakh = localFont({
  src: [
    { path: "./fonts/YekanBakhRegular.otf", weight: "400", style: "normal" },
    { path: "./fonts/YekanBakhBold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-yekan-bakh",
  // This 2019 YekanBakh build draws glyphs ~28% smaller in the em square than
  // modern Persian fonts (cap height 555 vs ~711/1000) — scale to compensate.
  declarations: [{ prop: "size-adjust", value: "128%" }],
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
    <html lang="en" className={`${geistSans.variable} ${yekanBakh.variable} h-full antialiased`}>
      <body className="min-h-full bg-black">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

