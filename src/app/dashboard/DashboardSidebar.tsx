"use client";

import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function DashboardSidebar() {
  return (
    <aside className="w-64 border-r bg-white p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Property Admin</h2>
        <p className="text-sm text-gray-500">Dashboard</p>
      </div>

      <nav className="space-y-2">
        <Link
          href="/dashboard"
          className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100"
        >
          Dashboard
        </Link>

        <Link
          href="/dashboard/properties"
          className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100"
        >
          Properti
        </Link>

        <Link
          href="/dashboard/leads"
          className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100"
        >
          Leads
        </Link>

        <LogoutButton />
      </nav>
    </aside>
  );
}
