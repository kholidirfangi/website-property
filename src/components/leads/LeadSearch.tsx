"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LeadSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") ?? "";

  const [search, setSearch] = useState(currentSearch);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams(
      searchParams.toString(),
    );

    const value = search.trim();

    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    const queryString = params.toString();

    router.push(
      queryString
        ? `/dashboard/leads?${queryString}`
        : "/dashboard/leads",
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1">
      <div className="relative">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari nama atau WhatsApp..."
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-gray-900"
        />
      </div>
    </form>
  );
}