"use client";

import { useState } from "react";

type PropertyInquiryFormProps = {
  propertyId: string;
};

export default function PropertyInquiryForm({
  propertyId,
}: PropertyInquiryFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId,
          name,
          phone,
          email,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? "Gagal mengirim inquiry.");
        return;
      }

      setSuccess("Inquiry berhasil dikirim. Kami akan segera menghubungi Anda.");

      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("SUBMIT LEAD ERROR:", error);
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xs bg-white p-6 shadow">
      <div>
        <h2 className="text-xl font-semibold">Tertarik dengan Property Ini?</h2>

        <p className="mt-2 text-sm text-gray-600">
          Isi form berikut dan kami akan menghubungi Anda.
        </p>
      </div>

      {success && (
        <div
          role="status"
          className="mt-4 rounded-lg bg-green-50 p-4 text-sm text-green-700"
        >
          {success}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-600"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Nama
          </label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 w-full rounded-xs border px-4 py-2"
            placeholder="Nama lengkap"
            disabled={loading}
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium">
            WhatsApp
          </label>

          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="mt-2 w-full rounded-xs border px-4 py-2"
            placeholder="08xxxxxxxxxx"
            disabled={loading}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
            <span className="ml-1 text-gray-400">(opsional)</span>
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-xs border px-4 py-2"
            placeholder="nama@email.com"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium">
            Pesan
            <span className="ml-1 text-gray-400">(opsional)</span>
          </label>

          <textarea
            id="message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="mt-2 w-full rounded-xs border px-4 py-2"
            placeholder="Contoh: Saya tertarik dengan property ini."
            rows={4}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xs bg-black px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Mengirim..." : "Kirim Inquiry"}
        </button>
      </form>
    </div>
  );
}