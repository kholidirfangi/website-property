"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

type PropertyImage = {
  id: string;
  url: string;
  publicId: string;
  isPrimary: boolean;
};

type PropertyImageGalleryProps = {
  propertyId: string;
  images: PropertyImage[];
  propertyTitle: string;
};

export default function PropertyImageGallery({
  propertyId,
  images,
  propertyTitle,
}: PropertyImageGalleryProps) {
  const router = useRouter();

  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  const primaryImage = images.find((image) => image.isPrimary) ?? images[0];

  const selectedImage =
    images.find((image) => image.id === selectedImageId) ?? primaryImage;

  const [loadingId, setLoadingId] = useState<string | null>(null);

  if (images.length === 0) {
    return (
      <div className="mt-6 rounded-xl bg-white p-6 shadow">
        <div className="flex aspect-video items-center justify-center rounded-lg bg-gray-100">
          <p className="text-sm text-gray-500">Belum ada foto properti</p>
        </div>
      </div>
    );
  }

  async function handleSetPrimary(imageId: string) {
    setLoadingId(imageId);

    try {
      const response = await fetch(
        `/api/properties/${propertyId}/images/${imageId}/primary`,
        {
          method: "PATCH",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message ?? "Gagal mengubah gambar utama.");
        return;
      }

      setSelectedImageId(imageId);
      router.refresh();
    } catch {
      alert("Terjadi kesalahan.");
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDelete(imageId: string) {
    const confirmed = window.confirm("Yakin ingin menghapus gambar ini?");

    if (!confirmed) {
      return;
    }

    setLoadingId(imageId);

    try {
      const response = await fetch(
        `/api/properties/${propertyId}/images/${imageId}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message ?? "Gagal menghapus gambar.");
        return;
      }

      setSelectedImageId(null);
      router.refresh();
    } catch {
      alert("Terjadi kesalahan.");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="mt-6 rounded-xl bg-white p-6 shadow">
      <h2 className="text-lg font-semibold">Foto Properti</h2>

      {/* Main Image */}
      <div className="relative mt-4 aspect-video overflow-hidden rounded-xl bg-gray-100">
        <Image
          src={selectedImage.url}
          alt={propertyTitle}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
        />
      </div>

      {/* Thumbnails */}
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {images.map((image) => {
          const isSelected = selectedImage.id === image.id;
          const isLoading = loadingId === image.id;

          return (
            <div key={image.id}>
              <button
                type="button"
                onClick={() => setSelectedImageId(image.id)}
                className={`relative aspect-square w-full overflow-hidden rounded-lg border-2 ${
                  isSelected ? "border-black" : "border-transparent"
                }`}
              >
                <Image
                  src={image.url}
                  alt={propertyTitle}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                />

                {image.isPrimary && (
                  <span className="absolute bottom-2 left-2 rounded bg-black px-2 py-1 text-xs font-medium text-white">
                    Utama
                  </span>
                )}
              </button>

              <div className="mt-2 flex gap-2">
                {!image.isPrimary && (
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleSetPrimary(image.id)}
                    className="flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium hover:bg-gray-50 disabled:opacity-50"
                  >
                    {isLoading ? "Memproses..." : "Jadikan Utama"}
                  </button>
                )}

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleDelete(image.id)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  {isLoading ? "..." : "Hapus"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
