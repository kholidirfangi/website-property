import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import PropertyForm from "./PropertyForm";

export default async function CreatePropertyPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/agent/login");
  }

  if (user.role !== "SUPERADMIN") {
    redirect("/dashboard");
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

        <div className="mt-6">
          <h1 className="text-3xl font-bold">
            Tambah Properti
          </h1>

          <p className="mt-2 text-gray-600">
            Tambahkan properti baru.
          </p>
        </div>

        <div className="mt-6 rounded-xl bg-white p-6 shadow">
          <PropertyForm />
        </div>
      </div>
    </section>
  );
}