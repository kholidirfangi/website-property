import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import LeadStatusSelect from "@/components/leads/LeadStatusSelect";

export default async function LeadsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/agent/login");
  }

  const leads = await prisma.lead.findMany({
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
    <section className="p-8">
      <div>
        <h1 className="text-3xl font-bold">Leads</h1>

        <p className="mt-2 text-gray-600">
          Kelola calon pembeli atau penyewa property.
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow">
        {leads.length === 0 ? (
          <div className="p-6">
            <p className="text-gray-500">Belum ada lead.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-4 font-medium">Nama</th>

                  <th className="px-6 py-4 font-medium">Property</th>

                  <th className="px-6 py-4 font-medium">WhatsApp</th>

                  <th className="px-6 py-4 font-medium">Status</th>

                  <th className="px-6 py-4 font-medium">Sumber</th>

                  <th className="px-6 py-4 font-medium">Tanggal</th>
                </tr>
              </thead>

              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b last:border-0">
                    <td className="px-6 py-4">
                      <div className="font-medium">{lead.name}</div>

                      {lead.email && (
                        <div className="mt-1 text-gray-500">{lead.email}</div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {lead.property ? (
                        lead.property.title
                      ) : (
                        <span className="text-gray-400">General Inquiry</span>
                      )}
                    </td>

                    <td className="px-6 py-4">{lead.phone}</td>

                    <td className="px-6 py-4">
                      <LeadStatusSelect leadId={lead.id} status={lead.status} />
                    </td>

                    <td className="px-6 py-4">{lead.source}</td>

                    <td className="px-6 py-4 text-gray-500">
                      {lead.createdAt.toLocaleDateString("id-ID")}
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
