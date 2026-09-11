import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/agent/login");
  }

  return (
    <main className="flex min-h-screen bg-gray-100">
      <section className="flex-1 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>

            <p className="mt-2 text-gray-600">Selamat datang, {user.name}</p>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-white p-6 shadow">
          <p>
            <strong>Email:</strong> {user.email}
          </p>

          <p className="mt-2">
            <strong>Role:</strong> {user.role}
          </p>
        </div>
      </section>
    </main>
  );
}
