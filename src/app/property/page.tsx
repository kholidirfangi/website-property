import Link from "next/link";
import Image from "next/image";

import { prisma } from "@/lib/prisma";
import {
  formatListingType,
  formatPrice,
  formatPropertyStatus,
  formatPropertyType,
} from "@/lib/property-format";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { siteConfig } from "@/lib/site-config";

type PropertyPageProps = {
  searchParams?: Promise<{ type?: string }> | { type?: string };
};

function MapPinIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path
        d="M7 12.833S11.083 9.1 11.083 5.833a4.083 4.083 0 1 0-8.166 0C2.917 9.1 7 12.833 7 12.833Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="7" cy="5.75" r="1.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <rect x="2.5" y="6" width="8" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4.25 6V4.25a2.25 2.25 0 0 1 4.5 0V6" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path d="M2 4h6M10.5 4h1.5M2 10h1.5M6 10h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="8.25" cy="4" r="1.4" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="3.75" cy="10" r="1.4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export default async function PropertyPage({ searchParams }: PropertyPageProps) {
  const resolvedParams = (await searchParams) ?? {};
  const activeType = resolvedParams.type;

  const properties = await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      images: {
        orderBy: { createdAt: "asc" },
        take: 1,
      },
    },
  });

  // Tab dibangun dari tipe properti yang benar-benar ada di data,
  // supaya selalu cocok dengan enum Prisma kamu tanpa perlu di-hardcode.
  const typeTabs = Array.from(new Set(properties.map((p) => String(p.type)))).map((value) => ({
    value,
    label: formatPropertyType(value as (typeof properties)[number]["type"]),
  }));

  const filteredProperties = activeType
    ? properties.filter((property) => String(property.type) === activeType)
    : properties;

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mt-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Properti <span className="mx-1 text-gray-300">/</span> Koleksi Terkurasi
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              Temukan Properti yang Sesuai
            </h1>

            <p className="mt-3 max-w-2xl text-gray-600">
              Jelajahi pilihan properti yang tersedia dan temukan ruang yang sesuai dengan
              kebutuhan Anda melalui kurasi arsitektur berkualitas di Jawa Tengah.
            </p>
          </div>

          <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-xs border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 md:self-auto">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-950" />
            Menampilkan {filteredProperties.length} Properti
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="mt-8 flex items-center justify-between gap-4 overflow-x-auto rounded-xs bg-gray-100 p-1.5">
          <div className="flex items-center gap-1">
            <Link
              href="/property"
              className={`whitespace-nowrap rounded-xs px-4 py-2 text-sm font-medium transition ${
                !activeType ? "bg-gray-950 text-white" : "text-gray-600 hover:text-gray-950"
              }`}
            >
              Semua Properti
            </Link>

            {typeTabs.map((tab) => (
              <Link
                key={tab.value}
                href={`/property?type=${encodeURIComponent(tab.value)}`}
                className={`whitespace-nowrap rounded-xs px-4 py-2 text-sm font-medium transition ${
                  activeType === tab.value
                    ? "bg-gray-950 text-white"
                    : "text-gray-600 hover:text-gray-950"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          <span className="hidden shrink-0 items-center gap-1.5 pr-3 text-xs font-medium uppercase tracking-wider text-gray-400 sm:flex">
            <SlidersIcon />
            Kurasi Khusus
          </span>
        </div>

        {/* Property Grid */}
        {filteredProperties.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {filteredProperties.map((property, index) => {
              const primaryImage = property.images[0];
              const isSold = property.status !== "AVAILABLE";
              const isRent = property.listingType === "RENT";
              // Opsional: tambahkan field `featured Boolean` di model Property
              // kalau mau badge "Unggulan" ini benar-benar dikontrol dari data.
              const isFeatured = Boolean((property as unknown as { featured?: boolean }).featured);
              const refCode = `GL-${String(index + 1).padStart(2, "0")}`;

              return (
                <Link
                  key={property.id}
                  href={`/property/${property.slug}`}
                  className="group overflow-hidden rounded-xs border border-gray-100 bg-white transition hover:-translate-y-1 hover:shadow-md"
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

                    {/* Badges */}
                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      <span
                        className={`rounded-xs px-3 py-1 text-xs font-medium text-white ${
                          isSold ? "bg-red-600" : "bg-gray-950"
                        }`}
                      >
                        {isSold ? formatPropertyStatus(property.status) : formatListingType(property.listingType)}
                      </span>

                      {isFeatured && (
                        <span className="rounded-full border border-amber-200 bg-white px-3 py-1 text-xs font-medium text-amber-700">
                          Unggulan
                        </span>
                      )}
                    </div>

                    {/* Location chip */}
                    {property.city && (
                      <span className="absolute bottom-4 right-4 rounded-xs bg-black/50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-white backdrop-blur-sm">
                        {property.city}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      {formatPropertyType(property.type)}
                    </span>

                    <h2 className="mt-2 line-clamp-2 text-lg font-semibold text-gray-900">
                      {property.title}
                    </h2>

                    <p className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                      <MapPinIcon />
                      {property.city || "-"}
                      {property.district ? `, ${property.district}` : ""}
                    </p>

                    <p className="mt-4 text-xl font-bold text-gray-900">
                      Rp {formatPrice(property.price.toString())}
                      {isRent && <span className="text-sm font-normal text-gray-500"> / tahun</span>}
                    </p>

                    {(property.landArea ||
                      property.buildingArea ||
                      property.bedrooms ||
                      property.bathrooms) && (
                      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-500">
                        {property.landArea && <span>LT {property.landArea} m²</span>}
                        {property.buildingArea && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span>LB {property.buildingArea} m²</span>
                          </>
                        )}
                        {property.bedrooms && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span>{property.bedrooms} Kamar</span>
                          </>
                        )}
                        {property.bathrooms && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span>{property.bathrooms} KM</span>
                          </>
                        )}
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                      {isSold ? (
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400">
                          <LockIcon />
                          Arsip Properti
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-900">
                          Lihat Detail
                          <span className="transition group-hover:translate-x-0.5">→</span>
                        </span>
                      )}

                      <span className="text-xs font-medium tracking-wide text-gray-400">REF: {refCode}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 rounded-xs border border-gray-100 bg-white p-10 text-center">
            <p className="text-gray-500">Belum ada properti tersedia.</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 rounded-xs border border-gray-100 bg-white p-8 sm:p-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Layanan Pencarian Terarah
              </p>

              <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                Belum menemukan properti yang sesuai?
              </h2>

              <p className="mt-3 text-gray-600">
                Beri tahu kami preferensi hunian idaman Anda. Tim kurator Griya Lestari siap
                membantu mencari properti yang sesuai dengan kriteria dan anggaran Anda.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link
                href={`https://wa.me/${siteConfig.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xs bg-gray-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Konsultasi Kebutuhan
                <span>→</span>
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-xs bg-gray-100 px-6 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-200"
              >
                Pelajari Pendekatan Kami
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}