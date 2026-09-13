import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import EditPropertyForm from "./EditPropertyForm";

type EditPropertyPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPropertyPage({
  params,
}: EditPropertyPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/agent/login");
  }

  if (user.role !== "SUPERADMIN") {
    redirect("/dashboard");
  }

  const { id } = await params;

  const property = await prisma.property.findUnique({
    where: {
      id,
    },
  });

  if (!property) {
    notFound();
  }

  return (
    <section className="p-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/dashboard/properties/${property.id}`}
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Kembali ke Detail
        </Link>

        <div className="mt-6">
          <h1 className="text-3xl font-bold">Edit Properti</h1>

          <p className="mt-2 text-gray-600">{property.title}</p>
        </div>

        <div className="mt-6 rounded-xl bg-white p-6 shadow">
          <EditPropertyForm
            property={{
              id: property.id,
              title: property.title,
              type: property.type,
              city: property.city,
              price: property.price.toString(),
              status: property.status,
              listingType: property.listingType,
              address: property.address,
              district: property.district,
              province: property.province,
              postalCode: property.postalCode,
              landArea: property.landArea,
              buildingArea: property.buildingArea,
              bedrooms: property.bedrooms,
              bathrooms: property.bathrooms,
              floors: property.floors,
            }}
          />
        </div>
      </div>
    </section>
  );
}
