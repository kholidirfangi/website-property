import { notFound } from "next/navigation";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import {
  formatListingType,
  formatPrice,
  formatPropertyStatus,
  formatPropertyType,
} from "@/lib/property-format";
import PropertyInquiryForm from "@/components/property/PropertyInquiryForm";
import PropertyGallery from "@/components/property/PropertyGallery";

type PropertyPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params;

  const property = await prisma.property.findUnique({
    where: {
      slug,
    },
    include: {
      images: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!property) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
          ← Kembali ke Home
        </Link>

        {/* Gallery */}
        <div className="mt-6">
          <PropertyGallery
            images={property.images}
            propertyTitle={property.title}
          />
        </div>

        {/* Header */}
        <div className="mt-8">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
              {formatListingType(property.listingType)}
            </span>

            <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
              {formatPropertyStatus(property.status)}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {property.title}
          </h1>

          <p className="mt-2 text-gray-600">
            {property.city || "-"}
            {property.district ? `, ${property.district}` : ""}
          </p>

          <p className="mt-5 text-2xl font-bold">
            Rp {formatPrice(property.price.toString())}
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-8">
            {/* Spesifikasi */}
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Spesifikasi</h2>

              <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-gray-500">Tipe</p>
                  <p className="mt-1 font-medium">
                    {formatPropertyType(property.type)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Luas Tanah</p>
                  <p className="mt-1 font-medium">
                    {property.landArea ? `${property.landArea} m²` : "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Luas Bangunan</p>
                  <p className="mt-1 font-medium">
                    {property.buildingArea
                      ? `${property.buildingArea} m²`
                      : "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Kamar Tidur</p>
                  <p className="mt-1 font-medium">{property.bedrooms ?? "-"}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Kamar Mandi</p>
                  <p className="mt-1 font-medium">
                    {property.bathrooms ?? "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Lantai</p>
                  <p className="mt-1 font-medium">{property.floors ?? "-"}</p>
                </div>
              </div>
            </section>

            {/* Lokasi */}
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Lokasi</h2>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Alamat</p>
                  <p className="mt-1 font-medium">{property.address || "-"}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-sm text-gray-500">Kecamatan</p>
                    <p className="mt-1 font-medium">
                      {property.district || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Kota</p>
                    <p className="mt-1 font-medium">{property.city || "-"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Provinsi</p>
                    <p className="mt-1 font-medium">
                      {property.province || "-"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Kode Pos</p>
                  <p className="mt-1 font-medium">
                    {property.postalCode || "-"}
                  </p>
                </div>
              </div>
            </section>

            {/* Deskripsi */}
            {property.description && (
              <section className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Deskripsi</h2>

                <p className="mt-4 whitespace-pre-line leading-7 text-gray-600">
                  {property.description}
                </p>
              </section>
            )}
          </div>

          {/* Inquiry */}
          <aside>
            <div className="lg:sticky lg:top-6">
              <PropertyInquiryForm propertyId={property.id} />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
