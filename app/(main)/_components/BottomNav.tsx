"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Discover", href: "/" },
  { label: "Matches", href: "/matches" },
  { label: "Leagues", href: "/leagues" },
  { label: "Tournaments", href: "/tournaments" },
  { label: "Courts", href: "/courts" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex border-t border-gray-200 bg-white">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex flex-1 flex-col items-center py-3 text-xs font-medium ${
            pathname === item.href ? "text-black" : "text-gray-400"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
