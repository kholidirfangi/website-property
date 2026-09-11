"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeletePropertyButton({
  propertyId,
}: {
  propertyId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm("Yakin ingin menghapus properti ini?");

    if (!confirmed) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        window.alert(data.message ?? "Gagal menghapus property");
        return;
      }

      router.push("/dashboard/properties");
      router.refresh();
    } catch {
      window.alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? "Menghapus..." : "Hapus"}
    </button>
  );
}
