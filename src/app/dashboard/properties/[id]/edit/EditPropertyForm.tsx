"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type EditPropertyFormProps = {
  property: {
    id: string;
    title: string;
    type: string;
    city: string | null;
    price: string;
    status: string;
    listingType: string;
    address: string | null;
    district: string | null;
    province: string | null;
    postalCode: string | null;
    landArea: number | null;
    buildingArea: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
    floors: number | null;
  };
};

export default function EditPropertyForm({ property }: EditPropertyFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(property.title);
  const [type, setType] = useState(property.type);
  const [city, setCity] = useState(property.city ?? "");
  const [price, setPrice] = useState(property.price);
  const [status, setStatus] = useState(property.status);
  const [listingType, setListingType] = useState(property.listingType);

  const [address, setAddress] = useState(property.address ?? "");
  const [district, setDistrict] = useState(property.district ?? "");
  const [province, setProvince] = useState(property.province ?? "");
  const [postalCode, setPostalCode] = useState(property.postalCode ?? "");

  const [landArea, setLandArea] = useState(property.landArea?.toString() ?? "");
  const [buildingArea, setBuildingArea] = useState(
    property.buildingArea?.toString() ?? "",
  );
  const [bedrooms, setBedrooms] = useState(property.bedrooms?.toString() ?? "");
  const [bathrooms, setBathrooms] = useState(
    property.bathrooms?.toString() ?? "",
  );
  const [floors, setFloors] = useState(property.floors?.toString() ?? "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const trimmedTitle = title.trim();
    const trimmedCity = city.trim();
    const numericPrice = Number(price);

    if (!trimmedTitle) {
      setError("Nama properti wajib diisi.");
      setLoading(false);
      return;
    }

    if (trimmedTitle.length < 3) {
      setError("Nama properti minimal 3 karakter.");
      setLoading(false);
      return;
    }

    if (!trimmedCity) {
      setError("Kota wajib diisi.");
      setLoading(false);
      return;
    }

    if (!price || !Number.isFinite(numericPrice) || numericPrice <= 0) {
      setError("Harga harus lebih dari 0.");
      setLoading(false);
      return;
    }

    if (!type) {
      setError("Pilih tipe properti.");
      setLoading(false);
      return;
    }

    if (!status) {
      setError("Pilih status properti.");
      setLoading(false);
      return;
    }

    if (!listingType) {
      setError("Pilih jenis listing.");
      setLoading(false);
      return;
    }

    const numericFields = [
      {
        value: landArea,
        label: "Luas tanah",
        min: 0,
        integer: false,
      },
      {
        value: buildingArea,
        label: "Luas bangunan",
        min: 0,
        integer: false,
      },
      {
        value: bedrooms,
        label: "Kamar tidur",
        min: 0,
        integer: true,
      },
      {
        value: bathrooms,
        label: "Kamar mandi",
        min: 0,
        integer: true,
      },
      {
        value: floors,
        label: "Jumlah lantai",
        min: 1,
        integer: true,
      },
    ];

    for (const field of numericFields) {
      if (field.value.trim() === "") {
        continue;
      }

      const value = Number(field.value);

      if (!Number.isFinite(value)) {
        setError(`${field.label} harus berupa angka yang valid.`);
        setLoading(false);
        return;
      }

      if (value < field.min) {
        setError(
          field.min === 0
            ? `${field.label} tidak boleh kurang dari 0.`
            : `${field.label} harus minimal ${field.min}.`,
        );
        setLoading(false);
        return;
      }

      if (field.integer && !Number.isInteger(value)) {
        setError(`${field.label} harus berupa bilangan bulat.`);
        setLoading(false);
        return;
      }
    }

    const parseOptionalNumber = (value: string) => {
      return value.trim() === "" ? null : Number(value);
    };

    try {
      const response = await fetch(`/api/properties/${property.id}`, {
        method: "PUT",
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

          landArea: parseOptionalNumber(landArea),
          buildingArea: parseOptionalNumber(buildingArea),
          bedrooms: parseOptionalNumber(bedrooms),
          bathrooms: parseOptionalNumber(bathrooms),
          floors: parseOptionalNumber(floors),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? "Gagal mengupdate property");
        return;
      }

      router.push(`/dashboard/properties/${property.id}`);
      router.refresh();
    } catch (error) {
      console.error("UPDATE PROPERTY ERROR:", error);
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
          {error}
        </div>
      )}

      {/* Informasi Utama */}
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
          <option value="SALE">Sale</option>
          <option value="RENT">Rent</option>
        </select>
      </div>

      {/* Lokasi */}
      <div className="border-t pt-6">
        <h2 className="text-lg font-semibold">Lokasi</h2>

        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="address" className="block text-sm font-medium">
              Alamat
            </label>

            <textarea
              id="address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className="mt-2 w-full rounded-lg border px-4 py-2"
              rows={3}
              disabled={loading}
              placeholder="Contoh: Jl. Pemuda No. 10"
            />
          </div>

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
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium">
              Kode Pos
            </label>

            <input
              id="postalCode"
              type="text"
              value={postalCode}
              onChange={(event) => setPostalCode(event.target.value)}
              className="mt-2 w-full rounded-lg border px-4 py-2"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Detail Properti */}
      <div className="border-t pt-6">
        <h2 className="text-lg font-semibold">Detail Properti</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
              min="0"
              step="any"
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
              min="0"
              step="1"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="floors" className="block text-sm font-medium">
              Jumlah Lantai
            </label>

            <input
              id="floors"
              type="number"
              value={floors}
              onChange={(event) => setFloors(event.target.value)}
              className="mt-2 w-full rounded-lg border px-4 py-2"
              min="1"
              step="1"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </form>
  );
}
