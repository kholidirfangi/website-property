"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout gagal");
      }

      router.push("/agent/login");
      router.refresh();
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="block rounded-lg px-3 py-2 text-red-500 text-sm font-medium disabled:opacity-50"
    >
      {loading ? "Keluar..." : "Logout"}
    </button>
  );
}
