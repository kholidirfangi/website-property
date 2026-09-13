"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "CONVERTED"
  | "LOST";

type LeadStatusSelectProps = {
  leadId: string;
  status: LeadStatus;
};

const STATUS_OPTIONS: {
  value: LeadStatus;
  label: string;
}[] = [
  {
    value: "NEW",
    label: "Baru",
  },
  {
    value: "CONTACTED",
    label: "Sudah Dihubungi",
  },
  {
    value: "QUALIFIED",
    label: "Qualified",
  },
  {
    value: "CONVERTED",
    label: "Converted",
  },
  {
    value: "LOST",
    label: "Lost",
  },
];

export default function LeadStatusSelect({
  leadId,
  status,
}: LeadStatusSelectProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    const newStatus = event.target.value as LeadStatus;

    setLoading(true);

    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message ?? "Gagal mengubah status lead.");
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("UPDATE LEAD STATUS ERROR:", error);

      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={loading}
      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {STATUS_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}