"use client";

import Image from "next/image";
import { useState } from "react";

type PropertyImage = {
  id: string;
  url: string;
  isPrimary: boolean;
};

type PropertyGalleryProps = {
  images: PropertyImage[];
  propertyTitle: string;
};

export default function PropertyGallery({
  images,
  propertyTitle,
}: PropertyGalleryProps) {
  const primaryImage =
    images.find((image) => image.isPrimary) ?? images[0];

  const [selectedImageId, setSelectedImageId] = useState(
    primaryImage?.id ?? "",
  );

  const selectedImage =
    images.find((image) => image.id === selectedImageId) ??
    primaryImage;

  if (!selectedImage) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-2xl bg-gray-200 text-gray-500">
        Belum ada gambar
      </div>
    );
  }

  return (
    <div>
      {/* Main Image */}
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-gray-200">
        <Image
          src={selectedImage.url}
          alt={propertyTitle}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-cover"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6">
          {images.map((image) => {
            const isSelected = image.id === selectedImage.id;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setSelectedImageId(image.id)}
                aria-label={`Lihat foto ${propertyTitle}`}
                className={`relative aspect-square overflow-hidden rounded-lg border-2 ${
                  isSelected
                    ? "border-black"
                    : "border-transparent"
                }`}
              >
                <Image
                  src={image.url}
                  alt={propertyTitle}
                  fill
                  sizes="(max-width: 640px) 25vw, 16vw"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
