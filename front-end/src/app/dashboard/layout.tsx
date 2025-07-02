// src/app/(dashboard)/layout.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

import { cn } from "@/lib/utils"; // optional
import { HeaderComponent } from "./_components/header_2";
import { useRouter } from "next/navigation";

const navItems = [
  { label: "Home", href: "/dashboard/home" },
  { label: "Explore", href: "/dashboard/explore" },
  { label: "View page", href: "/dashboard/page" },
  { label: "Account settings", href: "/dashboard/account" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col pl-15">
      {/* Header */}
      <HeaderComponent />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-[250px] border-r border-gray-200 px-6 py-10 bg-white">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-base font-medium rounded-md px-3 py-2 transition-colors",
                  pathname === item.href
                    ? "text-black bg-gray-100"
                    : "text-gray-500 hover:text-black hover:bg-gray-100"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Page content */}
        <main className="flex-1 px-10 py-10 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
