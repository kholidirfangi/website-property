import Link from "next/link";

import { prisma } from "@/lib/prisma";
import {
  formatListingType,
  formatPrice,
  formatPropertyStatus,
  formatPropertyType,
} from "@/lib/property-format";
import Image from "next/image";

export default async function PropertyPage() {
  const properties = await prisma.property.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      images: {
        orderBy: {
          createdAt: "asc",
        },
        take: 1,
      },
    },
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <div>
          <p className="text-sm font-medium text-gray-500">Properti</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Temukan Properti Impian Anda
          </h1>

          <p className="mt-3 max-w-2xl text-gray-600">
            Pilih properti yang sesuai dengan kebutuhan dan budget Anda.
          </p>
        </div>

        {/* Property Grid */}
        {properties.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => {
              const primaryImage = property.images[0];

              return (
                <Link
                  key={property.id}
                  href={`/property/${property.slug}`}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  {/* Image */}
                  <div className="relative aspect-4/3 overflow-hidden bg-gray-200">
                    {primaryImage ? (
                      <Image
                        src={primaryImage.url}
                        alt={property.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-500">
                        Belum ada gambar
                      </div>
                    )}

                    {/* Listing Type */}
                    <span className="absolute left-4 top-4 rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
                      {formatListingType(property.listingType)}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-gray-500">
                        {formatPropertyType(property.type)}
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          property.status === "AVAILABLE"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {formatPropertyStatus(property.status)}
                      </span>
                    </div>

                    <h2 className="mt-3 line-clamp-2 text-lg font-semibold text-gray-900">
                      {property.title}
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                      {property.city || "-"}
                      {property.district ? `, ${property.district}` : ""}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                      {property.landArea && (
                        <span>LT {property.landArea} m²</span>
                      )}

                      {property.buildingArea && (
                        <span>LB {property.buildingArea} m²</span>
                      )}

                      {property.bedrooms && <span>{property.bedrooms} KT</span>}

                      {property.bathrooms && (
                        <span>{property.bathrooms} KM</span>
                      )}
                    </div>

                    <p className="mt-4 text-xl font-bold text-gray-900">
                      Rp {formatPrice(property.price.toString())}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-500">Belum ada properti tersedia.</p>
          </div>
        )}
      </div>
    </main>
  );
}
