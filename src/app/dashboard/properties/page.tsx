import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import {
  formatListingType,
  formatPrice,
  formatPropertyStatus,
  formatPropertyType,
} from "@/lib/property-format";

export default async function PropertiesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/agent/login");
  }

  const properties = await prisma.property.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const isSuperAdmin = user.role === "SUPERADMIN";

  return (
    <section className="p-4 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Properti</h1>

          <p className="mt-2 text-gray-600">Kelola daftar properti.</p>
        </div>

        {isSuperAdmin && (
          <Link
            href="/dashboard/properties/create"
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Tambah Properti
          </Link>
        )}
      </div>

      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow">
        {properties.length === 0 ? (
          <div className="p-6">
            <p className="text-gray-500">Belum ada data properti.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-4 font-medium">Properti</th>

                  <th className="px-6 py-4 font-medium">Tipe</th>

                  <th className="px-6 py-4 font-medium">Status</th>

                  <th className="px-6 py-4 font-medium">Listing</th>

                  <th className="px-6 py-4 font-medium">Harga</th>
                </tr>
              </thead>

              <tbody>
                {properties.map((property) => (
                  <tr key={property.id} className="border-b last:border-0">
                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/properties/${property.id}`}
                        className="font-medium hover:underline"
                      >
                        {property.title}
                      </Link>

                      <p className="text-gray-500">{property.city || "-"}</p>
                    </td>

                    <td className="px-6 py-4">
                      {" "}
                      {formatPropertyType(property.type)}
                    </td>

                    <td className="px-6 py-4">
                      {formatPropertyStatus(property.status)}
                    </td>

                    <td className="px-6 py-4">
                      {formatListingType(property.listingType)}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 font-medium">
                      Rp {formatPrice(property.price.toString())}
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
