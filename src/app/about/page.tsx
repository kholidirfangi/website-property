import Link from "next/link";
import Image from "next/image";

import { siteConfig } from "@/lib/site-config";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 2.25 3.75 4.125v4.5c0 3.3 2.213 5.625 5.25 6.75 3.037-1.125 5.25-3.45 5.25-6.75v-4.5L9 2.25Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HandshakeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.25 8.25 5.4 5.55a1.2 1.2 0 0 1 1.5-.075L9 7"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 7 6.6 9.3a1.05 1.05 0 0 0 1.5 1.5l1.575-1.5.9.9a1.2 1.2 0 0 0 1.8-1.575L9.9 6.15a1.5 1.5 0 0 0-2.025-.075L6.6 7"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M15.75 8.25 12.6 5.55a1.2 1.2 0 0 0-1.5-.075" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.25 9c0-3.107 3.02-5.625 6.75-5.625S15.75 5.893 15.75 9s-3.02 5.625-6.75 5.625c-.72 0-1.414-.094-2.066-.27L3.75 15.75l.878-2.633C3.397 12.113 2.25 10.66 2.25 9Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.36 2.25H4.5A2.25 2.25 0 0 0 2.25 4.5v3.86c0 .398.158.78.44 1.06l6.19 6.19a1.5 1.5 0 0 0 2.12 0l3.86-3.86a1.5 1.5 0 0 0 0-2.12L8.67 2.44a1.5 1.5 0 0 0-1.06-.44Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="5.85" cy="5.85" r="0.9" fill="currentColor" />
    </svg>
  );
}

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Memahami Kebutuhan",
    description:
      "Memahami kebutuhan, preferensi gaya hidup, dan tujuan keluarga Anda sebelum meninjau pilihan unit yang tersedia.",
  },
  {
    number: "02",
    title: "Menemukan Pilihan",
    description:
      "Menyediakan kurasi pilihan properti yang telah diverifikasi legalitas dan kualitas fisiknya, relevan dengan anggaran Anda.",
  },
  {
    number: "03",
    title: "Mendampingi Proses",
    description:
      "Mendampingi survei lokasi, memberi transparansi dokumen, dan menjawab setiap pertanyaan hingga seluruh proses selesai dengan tenang.",
  },
];

const VALUES = [
  {
    icon: ShieldIcon,
    title: "Transparansi",
    description:
      "Informasi properti disampaikan dengan jelas dan terbuka agar pelanggan dapat mempertimbangkan pilihan secara matang tanpa ada komisi tersembunyi.",
  },
  {
    icon: HandshakeIcon,
    title: "Kebutuhan Pelanggan",
    description:
      "Setiap pencarian properti memiliki karakter yang berbeda. Kami selalu menempatkan kebutuhan riil Anda sebagai titik awal setiap rekomendasi.",
  },
  {
    icon: ChatIcon,
    title: "Komunikasi Terbuka",
    description:
      "Komunikasi yang santun, responsif, dan mudah diakses menjadi prioritas kami sepanjang tahapan konsultasi hingga transaksi.",
  },
  {
    icon: TagIcon,
    title: "Kepercayaan Berkelanjutan",
    description:
      "Hubungan dengan pemilik dan pencari properti dibangun melalui dedikasi jangka panjang, kejujuran data, dan integritas kerja nyata.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gray-50">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Tentang Kami
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
              Membantu Anda Menemukan Properti yang Tepat
            </h1>

            <p className="mt-5 max-w-lg text-gray-600">
              Kami hadir untuk membantu Anda menemukan properti yang sesuai
              dengan kebutuhan, rencana, dan tujuan Anda.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`https://wa.me/${siteConfig.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xs bg-gray-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Hubungi Kami
              </Link>

              <Link
                href="/property"
                className="rounded-xs border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-950 transition hover:bg-gray-50"
              >
                Lihat Properti
              </Link>
            </div>
          </div>

          <div className="relative aspect-4/3 overflow-hidden rounded-xs bg-gray-200 lg:aspect-square">
            <Image
              src="/images/hero-image.jpg"
              alt="Rumah modern tropis"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Pendekatan Kami */}
      <section className="border-b border-gray-100">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-2 aspect-4/3 overflow-hidden rounded-xs bg-gray-200 lg:order-1">
            <Image
              src="/images/about-image2.jpg"
              alt="Ruang tamu terbuka dengan taman"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="order-1 lg:order-2">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Pendekatan Kami
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
              Properti bukan hanya tentang bangunan.
            </h2>

            <div className="mt-5 space-y-4 text-gray-600">
              <p className="leading-7">
                Setiap orang memiliki kebutuhan yang berbeda ketika mencari
                properti. Karena itu, kami percaya proses mencari properti
                seharusnya dimulai dengan memahami kebutuhan, bukan sekadar
                menawarkan pilihan.
              </p>

              <p className="leading-7">
                Memilih hunian atau ruang usaha adalah keputusan jangka
                panjang yang melibatkan kenyamanan hidup, kepastian
                lingkungan, serta perencanaan finansial yang matang.
              </p>

              <p className="leading-7">
                Kami berusaha menghadirkan informasi properti yang jelas,
                transparan, dan membantu calon pemilik mendapatkan gambaran
                yang utuh dan jujur sebelum mengambil keputusan terbaik.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Proses Kami */}
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Proses Kami
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
              Cara Kami Membantu
            </h2>

            <p className="mt-3 text-gray-600">
              Proses yang sederhana agar Anda dapat mencari dan memahami
              pilihan properti dengan lebih nyaman.
            </p>
          </div>

          <div className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {PROCESS_STEPS.map((step) => (
              <div key={step.number} className="border-t border-gray-200 pt-5">
                <span className="text-sm font-bold tracking-wide text-amber-600">
                  {step.number}
                </span>

                <h3 className="mt-3 text-lg font-semibold text-gray-950">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nilai Utama */}
      <section className="border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
              Prinsip yang Kami Pegang
            </h2>

            <p className="mt-3 text-gray-600">
              Komitmen kami dalam menjaga standar pelayanan yang terpercaya
              bagi setiap klien.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="rounded-xs border border-gray-100 bg-white p-6"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-950">
                    <Icon />
                  </div>

                  <h3 className="mt-4 font-semibold text-gray-950">
                    {value.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Image Banner */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="relative aspect-video overflow-hidden rounded-xs bg-gray-200 sm:aspect-21/9">
            <Image
              src="/images/about-image.jpg"
              alt="Villa dengan kolam renang"
              fill
              sizes="100vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-black/25" />

            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
              <p className="max-w-2xl text-xl font-semibold leading-snug sm:text-2xl lg:text-3xl">
                Temukan ruang yang sesuai dengan cerita hidup Anda.
              </p>

              <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-white/80">
                {siteConfig.name} • Hunian Pilihan dengan Nilai Abadi
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-950">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Sedang mencari properti?
          </h2>

          <p className="mt-4 text-gray-400">
            Jelajahi pilihan properti yang tersedia atau hubungi kami untuk
            mendiskusikan kebutuhan Anda secara personal.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/property"
              className="rounded-xs bg-white px-6 py-3 text-sm font-medium text-gray-950 transition hover:bg-gray-100"
            >
              Lihat Properti
            </Link>

            <Link
              href={`https://wa.me/${siteConfig.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xs border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}