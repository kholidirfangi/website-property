import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/agent/login");
  }

  const [
    totalProperties,
    availableProperties,
    totalLeads,
    newLeads,
    recentLeads,
  ] = await Promise.all([
    prisma.property.count(),

    prisma.property.count({
      where: {
        status: "AVAILABLE",
      },
    }),

    prisma.lead.count(),

    prisma.lead.count({
      where: {
        status: "NEW",
      },
    }),

    prisma.lead.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        property: {
          select: {
            title: true,
          },
        },
      },
    }),
  ]);

  return (
    <section className="p-6 md:p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

        <p className="mt-2 text-gray-600">Selamat datang, {user.name}</p>
      </div>

      {/* Statistics */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Property */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">Total Property</p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {totalProperties}
          </p>
        </div>

        {/* Property Tersedia */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">Property Tersedia</p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {availableProperties}
          </p>
        </div>

        {/* Total Leads */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">Total Leads</p>

          <p className="mt-2 text-3xl font-bold text-gray-900">{totalLeads}</p>
        </div>

        {/* Lead Baru */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">Lead Baru</p>

          <p className="mt-2 text-3xl font-bold text-gray-900">{newLeads}</p>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Lead Terbaru</h2>

          <Link
            href="/dashboard/leads"
            className="text-sm font-medium text-gray-900 hover:underline"
          >
            Lihat Semua
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-gray-500">
            Belum ada lead.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentLeads.map((lead) => (
              <a
                key={lead.id}
                href={`/dashboard/leads/${lead.id}`}
                className="block px-6 py-4 transition hover:bg-gray-50"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{lead.name}</p>

                    <p className="text-sm text-gray-500">
                      {lead.property?.title ?? "General Inquiry"}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-sm text-gray-500">{lead.phone}</p>

                    <p className="mt-1 text-xs text-gray-400">
                      {new Intl.DateTimeFormat("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(lead.createdAt)}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

    </section>
  );
}
