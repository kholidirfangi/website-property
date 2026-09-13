import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import DeletePropertyButton from "./DeletePropertyButton";
import PropertyImageUpload from "./PropertyImageUpload";
import PropertyImageGallery from "./PropertyImageGallery";

type PropertyDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/agent/login");
  }

  const { id } = await params;

  const property = await prisma.property.findUnique({
    where: {
      id,
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
    <section className="p-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/dashboard/properties"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Kembali ke Properti
        </Link>

        <div className="mt-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{property.title}</h1>

            <p className="mt-2 text-gray-600">{property.city || "-"}</p>
          </div>

          {user.role === "SUPERADMIN" && (
            <div className="flex items-center gap-2">
              <Link
                href={`/dashboard/properties/${property.id}/edit`}
                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Edit
              </Link>

              <DeletePropertyButton propertyId={property.id} />
            </div>
          )}
        </div>

        <PropertyImageGallery
          propertyId={property.id}
          images={property.images}
          propertyTitle={property.title}
        />

        <div className="mt-6 rounded-xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold">Informasi Properti</h2>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Tipe Properti</p>
              <p className="mt-1 font-medium">{property.type}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="mt-1 font-medium">{property.status}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Listing</p>
              <p className="mt-1 font-medium">{property.listingType}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Harga</p>
              <p className="mt-1 font-medium">Rp {property.price.toString()}</p>
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
                {property.buildingArea ? `${property.buildingArea} m²` : "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Kamar Tidur</p>
              <p className="mt-1 font-medium">{property.bedrooms ?? "-"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Kamar Mandi</p>
              <p className="mt-1 font-medium">{property.bathrooms ?? "-"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Jumlah Lantai</p>
              <p className="mt-1 font-medium">{property.floors ?? "-"}</p>
            </div>
          </div>

          <div className="mt-8 border-t pt-6">
            <h3 className="text-base font-semibold">Lokasi</h3>

            <div className="mt-4 space-y-3">
              <div>
                <p className="text-sm text-gray-500">Alamat</p>
                <p className="mt-1 font-medium">{property.address || "-"}</p>
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-gray-500">Kecamatan</p>
                  <p className="mt-1 font-medium">{property.district || "-"}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Kota</p>
                  <p className="mt-1 font-medium">{property.city || "-"}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Provinsi</p>
                  <p className="mt-1 font-medium">{property.province || "-"}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Kode Pos</p>
                <p className="mt-1 font-medium">{property.postalCode || "-"}</p>
              </div>
            </div>
          </div>
        </div>

        {user.role === "SUPERADMIN" && (
          <PropertyImageUpload propertyId={property.id} />
        )}
      </div>
    </section>
  );
}
