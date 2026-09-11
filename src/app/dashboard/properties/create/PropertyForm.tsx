"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PropertyForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");
  const [listingType, setListingType] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          type,
          city,
          price,
          status,
          listingType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? "Gagal membuat property");
        return;
      }

      router.push("/dashboard/properties");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Nama Properti
        </label>

        <input
          id="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="mt-2 w-full rounded-lg border px-4 py-2"
          placeholder="Contoh: Rumah Minimalis Kebumen"
          required
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium">
          Tipe Properti
        </label>

        <select
          id="type"
          value={type}
          onChange={(event) => setType(event.target.value)}
          className="mt-2 w-full rounded-lg border px-4 py-2"
          required
        >
          <option value="">Pilih tipe properti</option>
          <option value="HOUSE">Rumah</option>
          <option value="LAND">Tanah</option>
          <option value="SHOPHOUSE">Ruko</option>
          <option value="APARTMENT">Apartemen</option>
          <option value="VILLA">Villa</option>
          <option value="OFFICE">Kantor</option>
        </select>
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-medium">
          Kota
        </label>

        <input
          id="city"
          type="text"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          className="mt-2 w-full rounded-lg border px-4 py-2"
          placeholder="Contoh: Kebumen"
          required
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium">
          Harga
        </label>

        <input
          id="price"
          type="number"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          className="mt-2 w-full rounded-lg border px-4 py-2"
          placeholder="Contoh: 500000000"
          min="0"
          required
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium">
          Status
        </label>

        <select
          id="status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="mt-2 w-full rounded-lg border px-4 py-2"
          required
        >
          <option value="">Pilih status</option>
          <option value="AVAILABLE">Available</option>
          <option value="SOLD">Sold</option>
          <option value="RENTED">Rented</option>
        </select>
      </div>

      <div>
        <label htmlFor="listingType" className="block text-sm font-medium">
          Listing Type
        </label>

        <select
          id="listingType"
          value={listingType}
          onChange={(event) => setListingType(event.target.value)}
          className="mt-2 w-full rounded-lg border px-4 py-2"
          required
        >
          <option value="">Pilih listing</option>
          <option value="SALE">Sale</option>
          <option value="RENT">Rent</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Menyimpan..." : "Simpan Properti"}
      </button>
    </form>
  );
}
