import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import localFont from "next/font/local";
import Providers from "./providers";
import AppScroll from "./_components/AppScroll";
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

// Pinned so Safari tints its bars with this instead of sampling the page edge
// (which gave a black bar on one screen and a blue one on the next).
export const viewport: Viewport = {
  themeColor: "#F5F7FA",
  // Lets env(safe-area-inset-*) report real numbers — without it they're all 0
  // and the fixed bottom bars sit inside Safari's toolbar tap strip.
  viewportFit: "cover",
  // No zooming: the layout is already sized for the phone, and pinching pushes
  // the fixed bars off-screen. `maximumScale` also stops iOS Safari
  // auto-zooming when you focus an input — every field here is 14px, under the
  // 16px threshold that triggers it. See also `touch-action` in globals.css
  // (double-tap) and AppScroll's gesture guard (pinch in a Safari tab).
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${yekanBakh.variable} h-full antialiased`}>
      <body className="h-full overflow-hidden">
        <Providers>
          <AppScroll>{children}</AppScroll>
        </Providers>
        {/* Covers every route when a phone turns sideways — see .portrait-only
            in globals.css for why this exists on top of the manifest lock. */}
        <div
          className="portrait-only fixed inset-0 z-[999] flex-col items-center justify-center gap-3 bg-surface px-8 text-center"
          dir="rtl"
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden className="text-primary">
            {/* A phone drawn portrait — the shape is the instruction. */}
            <rect x="7" y="2" width="10" height="20" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M10.5 5h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M12 19h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p className="text-base font-bold text-ink">گوشی را عمودی بگیرید</p>
          <p className="text-sm text-muted">پچ فقط در حالت عمودی نمایش داده می‌شود.</p>
        </div>
      </body>
    </html>
  );
}

