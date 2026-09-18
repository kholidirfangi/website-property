import { notFound, redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

import LeadStatusSelect from "@/components/leads/LeadStatusSelect";
import {
  formatLeadSource,
  formatPrice,
} from "@/lib/property-format";

type LeadDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LeadDetailPage({
  params,
}: LeadDetailPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/agent/login");
  }

  const { id } = await params;

  const lead = await prisma.lead.findUnique({
    where: {
      id,
    },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          slug: true,
          price: true,
        },
      },
    },
  });

  if (!lead) {
    notFound();
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <a
          href="/dashboard/leads"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Kembali ke Leads
        </a>

        <h1 className="mt-3 text-2xl font-semibold text-gray-900">
          Detail Lead
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Informasi Lead */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-2">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            Informasi Lead
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Nama</p>
              <p className="mt-1 font-medium text-gray-900">
                {lead.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">WhatsApp</p>

              <a
                href={`https://wa.me/${lead.phone
                  .replace(/\D/g, "")
                  .replace(/^0/, "62")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block font-medium text-green-600 hover:underline"
              >
                {lead.phone}
              </a>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="mt-1 font-medium text-gray-900">
                {lead.email || "Tidak ada"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Source</p>
              <p className="mt-1 font-medium text-gray-900">
                {formatLeadSource(lead.source)}
              </p>
            </div>
          </div>

          {/* Pesan */}
          <div className="mt-8 border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-500">Pesan Inquiry</p>

            <div className="mt-2 rounded-lg bg-gray-50 p-4">
              {lead.message ? (
                <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                  {lead.message}
                </p>
              ) : (
                <p className="text-sm text-gray-400">
                  Tidak ada pesan.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Status & Property */}
        <div className="space-y-6">
          {/* Status */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-5 text-lg font-semibold text-gray-900">
              Status
            </h2>

            <LeadStatusSelect
              leadId={lead.id}
              status={lead.status}
            />
          </div>

          {/* Property */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-5 text-lg font-semibold text-gray-900">
              Property
            </h2>

            {lead.property ? (
              <div>
                <p className="font-medium text-gray-900">
                  {lead.property.title}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Rp {formatPrice(lead.property.price.toString())}
                </p>

                <a
                  href={`/dashboard/properties/${lead.property.id}`}
                  className="mt-4 inline-block text-sm font-medium text-gray-900 hover:underline"
                >
                  Lihat Property →
                </a>
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                General Inquiry
              </p>
            )}
          </div>

          {/* Tanggal */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              Tanggal
            </h2>

            <p className="text-sm text-gray-600">
              {new Intl.DateTimeFormat("id-ID", {
                dateStyle: "full",
                timeStyle: "short",
              }).format(lead.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}