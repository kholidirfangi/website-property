"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import LogoutButton from "./LogoutButton";

export default function DashboardSidebar() {
  const pathname = usePathname();

  const isDashboardActive = pathname === "/dashboard";
  const isPropertiesActive = pathname.startsWith("/dashboard/properties");
  const isLeadsActive = pathname.startsWith("/dashboard/leads");

  return (
    <aside className="w-full border-b bg-white p-4 md:w-64 md:shrink-0 md:border-b-0 md:border-r">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Property Admin</h2>
        <p className="text-sm text-gray-500">Dashboard</p>
      </div>

      <nav className="space-y-2">
        <Link
          href="/dashboard"
          className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
            isDashboardActive
              ? "bg-gray-900 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          Dashboard
        </Link>

        <Link
          href="/dashboard/properties"
          className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
            isPropertiesActive
              ? "bg-gray-900 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          Properti
        </Link>

        <Link
          href="/dashboard/leads"
          className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
            isLeadsActive
              ? "bg-gray-900 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          Leads
        </Link>

        <LogoutButton />
      </nav>
    </aside>
  );
}
