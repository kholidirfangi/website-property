"use client";

import { useRouter, useSearchParams } from "next/navigation";

const STATUS_OPTIONS = [
  { value: "", label: "Semua Status" },
  { value: "NEW", label: "Baru" },
  { value: "CONTACTED", label: "Sudah Dihubungi" },
  { value: "QUALIFIED", label: "Qualified" },
  { value: "CONVERTED", label: "Converted" },
  { value: "LOST", label: "Lost" },
];

export default function LeadStatusFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") ?? "";

  function handleChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    const status = event.target.value;

    const params = new URLSearchParams(
      searchParams.toString(),
    );

    if (status) {
      params.set("status", status);
    } else {
      params.delete("status");
    }

    const queryString = params.toString();

    router.push(
      queryString
        ? `/dashboard/leads?${queryString}`
        : "/dashboard/leads",
    );
  }

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-gray-900"
    >
      {STATUS_OPTIONS.map((option) => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}