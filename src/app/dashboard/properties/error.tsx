"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="p-4 md:p-8">
      <div className="rounded-xl border border-red-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Gagal memuat property
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          Terjadi kesalahan saat mengambil data property. Silakan coba lagi.
        </p>

        <button
          onClick={() => reset()}
          className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Coba Lagi
        </button>
      </div>
    </section>
  );
}