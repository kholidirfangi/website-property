import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

import LeadStatusSelect from "@/components/leads/LeadStatusSelect";
import { formatLeadSource } from "@/lib/property-format";
import LeadStatusFilter from "@/components/leads/LeadStatusFilter";
import LeadSearch from "@/components/leads/LeadSearch";

type LeadsPageProps = {
  searchParams: Promise<{
    status?: string;
    search?: string;
  }>;
};

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const user = await getCurrentUser();

  const { status, search } = await searchParams;

  if (!user) {
    redirect("/agent/login");
  }

  const leads = await prisma.lead.findMany({
    where: {
      ...(status
        ? {
            status: status as
              | "NEW"
              | "CONTACTED"
              | "QUALIFIED"
              | "CONVERTED"
              | "LOST",
          }
        : {}),

      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                phone: {
                  contains: search,
                },
              },
            ],
          }
        : {}),
    },

    orderBy: {
      createdAt: "desc",
    },

    include: {
      property: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return (
    <section className="p-4 md:p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leads</h1>

        <p className="mt-2 text-gray-600">
          Kelola calon pembeli atau penyewa property.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <LeadSearch />

          <LeadStatusFilter />
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow">
        {leads.length === 0 ? (
          <div className="p-6">
            <p className="text-gray-500">Belum ada lead.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-275 text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-4 font-medium">Nama</th>
                  <th className="px-6 py-4 font-medium">Property</th>
                  <th className="px-6 py-4 font-medium">WhatsApp</th>
                  <th className="px-6 py-4 font-medium">Pesan</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Sumber</th>
                  <th className="px-6 py-4 font-medium">Tanggal</th>
                  <th className="px-6 py-4 text-left">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b last:border-0">
                    {/* Nama */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <a
                        href={`/dashboard/leads/${lead.id}`}
                        className="font-medium text-gray-900 hover:underline"
                      >
                        {lead.name}
                      </a>

                      {lead.email && (
                        <p className="mt-1 text-xs text-gray-500">
                          {lead.email}
                        </p>
                      )}
                    </td>

                    {/* Property */}
                    <td className="whitespace-nowrap px-6 py-4">
                      {lead.property ? (
                        lead.property.title
                      ) : (
                        <span className="text-gray-400">General Inquiry</span>
                      )}
                    </td>

                    {/* WhatsApp */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <a
                        href={`https://wa.me/${lead.phone
                          .replace(/\D/g, "")
                          .replace(/^0/, "62")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-green-600 hover:underline"
                      >
                        {lead.phone}
                      </a>
                    </td>

                    {/* Pesan */}
                    <td className="max-w-xs px-6 py-4">
                      {lead.message ? (
                        <p
                          className="truncate text-gray-600"
                          title={lead.message}
                        >
                          {lead.message}
                        </p>
                      ) : (
                        <span className="text-gray-400">Tidak ada pesan</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <LeadStatusSelect leadId={lead.id} status={lead.status} />
                    </td>

                    {/* Source */}
                    <td className="whitespace-nowrap px-6 py-4">
                      {formatLeadSource(lead.source)}
                    </td>

                    {/* Tanggal */}
                    <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                      {lead.createdAt.toLocaleDateString("id-ID")}
                    </td>

                    {/* Aksi */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <a
                        href={`/dashboard/leads/${lead.id}`}
                        className="text-sm font-medium text-gray-900 hover:underline"
                      >
                        Detail
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
