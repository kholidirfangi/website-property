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

  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [landArea, setLandArea] = useState("");
  const [buildingArea, setBuildingArea] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [floors, setFloors] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const trimmedTitle = title.trim();
    const trimmedCity = city.trim();
    const numericPrice = Number(price);

    // Validasi nama property
    if (!trimmedTitle) {
      setError("Nama properti wajib diisi.");
      return;
    }

    if (trimmedTitle.length < 3) {
      setError("Nama properti minimal 3 karakter.");
      return;
    }

    // Validasi kota
    if (!trimmedCity) {
      setError("Kota wajib diisi.");
      return;
    }

    // Validasi harga
    if (!price) {
      setError("Harga wajib diisi.");
      return;
    }

    if (!Number.isFinite(numericPrice)) {
      setError("Harga tidak valid.");
      return;
    }

    if (numericPrice <= 0) {
      setError("Harga harus lebih dari 0.");
      return;
    }

    // Validasi select
    if (!type) {
      setError("Pilih tipe properti.");
      return;
    }

    if (!status) {
      setError("Pilih status properti.");
      return;
    }

    if (!listingType) {
      setError("Pilih jenis listing.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: trimmedTitle,
          type,
          city: trimmedCity,
          price: numericPrice,
          status,
          listingType,

          address: address.trim(),
          district: district.trim(),
          province: province.trim(),
          postalCode: postalCode.trim(),

          landArea: landArea ? Number(landArea) : null,
          buildingArea: buildingArea ? Number(buildingArea) : null,
          bedrooms: bedrooms ? Number(bedrooms) : null,
          bathrooms: bathrooms ? Number(bathrooms) : null,
          floors: floors ? Number(floors) : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? "Gagal membuat properti.");
        return;
      }

      router.push("/dashboard/properties");
      router.refresh();
    } catch (error) {
      console.error("CREATE PROPERTY ERROR:", error);

      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 p-4 text-sm text-red-600"
        >
          {error}{" "}
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
          disabled={loading}
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
          disabled={loading}
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
          disabled={loading}
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
          min="1"
          step="1"
          disabled={loading}
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
          disabled={loading}
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
          disabled={loading}
          required
        >
          <option value="">Pilih listing</option>

          <option value="SALE">Sale</option>

          <option value="RENT">Rent</option>
        </select>
      </div>

      <div className="space-y-6 rounded-xl border p-6">
        <div>
          <h2 className="text-lg font-semibold">Lokasi Properti</h2>
          <p className="mt-1 text-sm text-gray-500">
            Informasi lokasi properti.
          </p>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium">
            Alamat
          </label>

          <textarea
            id="address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            className="mt-2 w-full rounded-lg border px-4 py-2"
            placeholder="Contoh: Jl. Pahlawan No. 10"
            rows={3}
            disabled={loading}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="district" className="block text-sm font-medium">
              Kecamatan
            </label>

            <input
              id="district"
              type="text"
              value={district}
              onChange={(event) => setDistrict(event.target.value)}
              className="mt-2 w-full rounded-lg border px-4 py-2"
              placeholder="Contoh: Kebumen"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="province" className="block text-sm font-medium">
              Provinsi
            </label>

            <input
              id="province"
              type="text"
              value={province}
              onChange={(event) => setProvince(event.target.value)}
              className="mt-2 w-full rounded-lg border px-4 py-2"
              placeholder="Contoh: Jawa Tengah"
              disabled={loading}
            />
          </div>
        </div>

        <div className="max-w-sm">
          <label htmlFor="postalCode" className="block text-sm font-medium">
            Kode Pos
          </label>

          <input
            id="postalCode"
            type="text"
            value={postalCode}
            onChange={(event) => setPostalCode(event.target.value)}
            className="mt-2 w-full rounded-lg border px-4 py-2"
            placeholder="Contoh: 54311"
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-6 rounded-xl border p-6">
        <div>
          <h2 className="text-lg font-semibold">Detail Properti</h2>
          <p className="mt-1 text-sm text-gray-500">
            Informasi fisik properti.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="landArea" className="block text-sm font-medium">
              Luas Tanah (m²)
            </label>

            <input
              id="landArea"
              type="number"
              value={landArea}
              onChange={(event) => setLandArea(event.target.value)}
              className="mt-2 w-full rounded-lg border px-4 py-2"
              placeholder="Contoh: 120"
              min="0"
              step="0.01"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="buildingArea" className="block text-sm font-medium">
              Luas Bangunan (m²)
            </label>

            <input
              id="buildingArea"
              type="number"
              value={buildingArea}
              onChange={(event) => setBuildingArea(event.target.value)}
              className="mt-2 w-full rounded-lg border px-4 py-2"
              placeholder="Contoh: 80"
              min="0"
              step="0.01"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium">
              Kamar Tidur
            </label>

            <input
              id="bedrooms"
              type="number"
              value={bedrooms}
              onChange={(event) => setBedrooms(event.target.value)}
              className="mt-2 w-full rounded-lg border px-4 py-2"
              placeholder="Contoh: 3"
              min="0"
              step="1"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="bathrooms" className="block text-sm font-medium">
              Kamar Mandi
            </label>

            <input
              id="bathrooms"
              type="number"
              value={bathrooms}
              onChange={(event) => setBathrooms(event.target.value)}
              className="mt-2 w-full rounded-lg border px-4 py-2"
              placeholder="Contoh: 2"
              min="0"
              step="1"
              disabled={loading}
            />
          </div>
        </div>

        <div className="max-w-sm">
          <label htmlFor="floors" className="block text-sm font-medium">
            Jumlah Lantai
          </label>

          <input
            id="floors"
            type="number"
            value={floors}
            onChange={(event) => setFloors(event.target.value)}
            className="mt-2 w-full rounded-lg border px-4 py-2"
            placeholder="Contoh: 2"
            min="1"
            step="1"
            disabled={loading}
          />
        </div>
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
