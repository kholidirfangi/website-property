"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_IMAGE_SIZE = 2000;
const JPEG_QUALITY = 0.82;

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

  const [uploadProgress, setUploadProgress] = useState({
    current: 0,
    total: 0,
  });

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

      let width = image.naturalWidth;
      let height = image.naturalHeight;

      if (width > MAX_IMAGE_SIZE || height > MAX_IMAGE_SIZE) {
        if (width > height) {
          height = Math.round((height * MAX_IMAGE_SIZE) / width);

          width = MAX_IMAGE_SIZE;
        } else {
          width = Math.round((width * MAX_IMAGE_SIZE) / height);

          height = MAX_IMAGE_SIZE;
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
        canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY);
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

  async function uploadImage(file: File) {
    const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      throw new Error(`"${file.name}" harus berupa JPG, PNG, atau WebP.`);
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`"${file.name}" terlalu besar. Maksimal 10 MB.`);
    }

    const compressedFile = await compressImage(file);

    console.log(
      `${file.name} - Original:`,
      (file.size / 1024 / 1024).toFixed(2),
      "MB",
    );

    console.log(
      `${file.name} - Compressed:`,
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
      throw new Error(data.message ?? "Gagal mengupload gambar.");
    }
  }

  async function handleUpload() {
    const files = inputRef.current?.files;

    setMessage("");
    setError("");

    if (!files || files.length === 0) {
      setError("Pilih gambar terlebih dahulu.");
      return;
    }

    setLoading(true);

    setUploadProgress({
      current: 0,
      total: files.length,
    });

    let successCount = 0;
    const failedFiles: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        setUploadProgress({
          current: i + 1,
          total: files.length,
        });

        try {
          await uploadImage(file);

          successCount++;
        } catch (error) {
          console.error(`UPLOAD ERROR: ${file.name}`, error);

          failedFiles.push(error instanceof Error ? error.message : file.name);
        }
      }

      if (successCount > 0) {
        setMessage(
          `${successCount} dari ${files.length} gambar berhasil diupload.`,
        );

        if (inputRef.current) {
          inputRef.current.value = "";
        }

        router.refresh();
      }

      if (failedFiles.length > 0) {
        setError(
          `${failedFiles.length} gambar gagal diupload: ${failedFiles.join(
            " | ",
          )}`,
        );
      }
    } catch (error) {
      console.error("MULTIPLE IMAGE UPLOAD ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat upload gambar.",
      );
    } finally {
      setLoading(false);

      setUploadProgress({
        current: 0,
        total: 0,
      });
    }
  }

  const isUploading = loading && uploadProgress.total > 0;

  return (
    <div className="mt-6 rounded-xl bg-white p-6 shadow">
      {" "}
      <h2 className="text-lg font-semibold">Foto Properti </h2>
      <p className="mt-1 text-sm text-gray-500">
        Pilih satu atau beberapa foto untuk diupload.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
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
        Format gambar yang didukung. Maksimal 10 MB per gambar.
      </p>
      {isUploading && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Mengupload gambar...</span>

            <span className="font-medium">
              {uploadProgress.current} / {uploadProgress.total}
            </span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-black transition-all duration-300"
              style={{
                width: `${
                  (uploadProgress.current / uploadProgress.total) * 100
                }%`,
              }}
            />
          </div>
        </div>
      )}
      {message && <p className="mt-3 text-sm text-green-600">{message}</p>}
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
