"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

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
  const primaryImage = images.find((image) => image.isPrimary) ?? images[0];

  const [selectedImageId, setSelectedImageId] = useState(
    primaryImage?.id ?? "",
  );

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const selectedImage =
    images.find((image) => image.id === selectedImageId) ?? primaryImage;

  useEffect(() => {
    if (!isLightboxOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsLightboxOpen(false);
        return;
      }

      if (images.length <= 1) {
        return;
      }

      const currentIndex = images.findIndex(
        (image) => image.id === selectedImage?.id,
      );

      if (currentIndex === -1) {
        return;
      }

      if (event.key === "ArrowLeft") {
        const previousIndex =
          currentIndex === 0 ? images.length - 1 : currentIndex - 1;

        setSelectedImageId(images[previousIndex].id);
      }

      if (event.key === "ArrowRight") {
        const nextIndex =
          currentIndex === images.length - 1 ? 0 : currentIndex + 1;

        setSelectedImageId(images[nextIndex].id);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen, images, selectedImage?.id]);

  if (!selectedImage) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-2xl bg-gray-200 text-gray-500">
        Belum ada gambar
      </div>
    );
  }

  function showPreviousImage() {
    const currentIndex = images.findIndex(
      (image) => image.id === selectedImage.id,
    );

    const previousIndex =
      currentIndex === 0 ? images.length - 1 : currentIndex - 1;

    setSelectedImageId(images[previousIndex].id);
  }

  function showNextImage() {
    const currentIndex = images.findIndex(
      (image) => image.id === selectedImage.id,
    );

    const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;

    setSelectedImageId(images[nextIndex].id);
  }

  return (
    <div>
      {/* Main Image */}
      <button
        type="button"
        onClick={() => setIsLightboxOpen(true)}
        className="relative block aspect-video w-full overflow-hidden rounded-2xl bg-gray-200"
        aria-label="Buka gambar dalam ukuran penuh"
      >
        <Image
          src={selectedImage.url}
          alt={propertyTitle}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-cover"
        />
      </button>

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
                  isSelected ? "border-black" : "border-transparent"
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

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute right-10 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-xl text-white backdrop-blur-sm transition hover:bg-black/60"
            aria-label="Tutup gambar"
          >
            ×
          </button>

          {/* Previous */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={showPreviousImage}
              className="absolute left-10 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-2xl text-white backdrop-blur-sm transition hover:bg-black/60"
              aria-label="Foto sebelumnya"
            >
              <div className="mb-1">‹</div>
            </button>
          )}

          <div className="relative h-[80vh] w-full max-w-6xl">
            <Image
              src={selectedImage.url}
              alt={propertyTitle}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={showNextImage}
              className="absolute right-10 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-2xl text-white backdrop-blur-sm transition hover:bg-black/60"
              aria-label="Foto berikutnya"
            >
              <div className="mb-1">›</div>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
