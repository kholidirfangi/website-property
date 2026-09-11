"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function PropertyImageUpload({
  propertyId,
}: {
  propertyId: string;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function compressImage(file: File): Promise<File> {
    const image = new Image();

    const objectUrl = URL.createObjectURL(file);

    try {
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();

        image.onerror = () => {
          reject(new Error("Gagal membaca gambar."));
        };

        image.src = objectUrl;
      });

      const maxSize = 2000;

      let width = image.naturalWidth;
      let height = image.naturalHeight;

      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
      }

      const canvas = document.createElement("canvas");

      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Browser tidak mendukung image compression.");
      }

      context.drawImage(image, 0, 0, width, height);

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, "image/jpeg", 0.82);
      });

      if (!blob) {
        throw new Error("Gagal melakukan compression gambar.");
      }

      return new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
        type: "image/jpeg",
        lastModified: Date.now(),
      });
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  }

  async function handleUpload() {
    const file = inputRef.current?.files?.[0];

    setMessage("");
    setError("");

    if (!file) {
      setError("Pilih gambar terlebih dahulu.");
      return;
    }

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar.");
      return;
    }

    // Maksimal 10 MB sebelum compression
    const maxFileSize = 10 * 1024 * 1024;

    if (file.size > maxFileSize) {
      setError("Ukuran gambar terlalu besar. Maksimal 10 MB.");
      return;
    }

    setLoading(true);

    try {
      const compressedFile = await compressImage(file);

      console.log("Original:", (file.size / 1024 / 1024).toFixed(2), "MB");

      console.log(
        "Compressed:",
        (compressedFile.size / 1024 / 1024).toFixed(2),
        "MB",
      );

      const formData = new FormData();

      formData.append("file", compressedFile);

      const response = await fetch(`/api/properties/${propertyId}/images`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? "Gagal mengupload gambar.");
        return;
      }

      setMessage("Gambar berhasil diupload.");

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      router.refresh();
    } catch (error) {
      console.error("IMAGE UPLOAD ERROR:", error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Terjadi kesalahan saat upload gambar.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 rounded-xl bg-white p-6 shadow">
      {" "}
      <h2 className="text-lg font-semibold">Foto Properti </h2>
      <p className="mt-1 text-sm text-gray-500">
        Upload foto untuk properti ini.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          disabled={loading}
          className="block w-full rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        />

        <button
          type="button"
          onClick={handleUpload}
          disabled={loading}
          className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Mengupload..." : "Upload Foto"}
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-400">
        Format gambar yang didukung. Maksimal ukuran file 10 MB.
      </p>
      {message && <p className="mt-3 text-sm text-green-600">{message}</p>}
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
