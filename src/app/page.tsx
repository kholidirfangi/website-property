import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  formatListingType,
  formatPrice,
  formatPropertyType,
} from "@/lib/property-format";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

const APPROACH_ITEMS = [
  {
    title: "Pilihan Properti Terkurasi",
    description:
      "Setiap unit diperiksa legalitas, kualitas bangunan, serta potensi lingkungan sekitarnya sebelum dihadirkan kepada calon pemilik.",
  },
  {
    title: "Informasi Transparan",
    description:
      "Spesifikasi riil, denah jelas, serta estimasi biaya yang terbuka sejak awal tanpa komisi tersembunyi ataupun klaim berlebih.",
  },
  {
    title: "Pendampingan Personal",
    description:
      "Konsultasi berfokus pada kebutuhan hunian Anda, bukan target penjualan semata. Kami hadir menjaga ketenangan proses transaksi.",
  },
];

const PRINCIPLES = [
  {
    number: "01",
    title: "Informasi Properti yang Jelas",
    description:
      "Kami menyajikan data fisik, sertifikat tanah, serta foto riil tanpa manipulasi berlebih agar ekspektasi Anda sesuai kenyataan saat inspeksi langsung.",
  },
  {
    number: "02",
    title: "Pilihan Properti yang Relevan",
    description:
      "Fokus kami adalah menyaring properti yang memiliki nilai arsitektural baik, lingkungan ramah keluarga, serta aksesibilitas prima untuk kehidupan jangka panjang.",
  },
  {
    number: "03",
    title: "Proses Konsultasi yang Mudah",
    description:
      "Mulai dari survey lokasi terjadwal hingga pengurusan notaris dan perbankan, tim kami mendampingi dengan santun, terbuka, dan profesional.",
  },
];

function IconPin() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path
        d="M7 13S11.5 8.75 11.5 5.5a4.5 4.5 0 0 0-9 0C2.5 8.75 7 13 7 13Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="7" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

// NOTE: `buildingArea`, `bedrooms` and `bathrooms` are assumed field names —
// rename these to match whatever your Prisma `Property` model actually calls
// them (or remove the ones that don't exist).
function getSpecs(property: {
  buildingArea?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
}) {
  return [
    property.buildingArea ? `${property.buildingArea} m²` : null,
    property.bedrooms ? `${property.bedrooms} Kamar` : null,
    property.bathrooms ? `${property.bathrooms} KM` : null,
  ].filter((spec): spec is string => Boolean(spec));
}

export default async function HomePage() {
  const properties = await prisma.property.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
    include: {
      images: {
        orderBy: [
          {
            isPrimary: "desc",
          },
          {
            createdAt: "asc",
          },
        ],
        take: 1,
      },
    },
  });

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#F7F5F1]">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 sm:py-28 lg:grid-cols-2">
          <div>
            <p className="font-medium text-gray-500">
              Temukan properti yang tepat
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-[1.1] tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
              Temukan Properti yang Sesuai dengan Kebutuhan Anda
            </h1>

            <p className="mt-6 max-w-xl leading-7 text-gray-600 text-lg">
              Kami mengkurasi pilihan hunian dan properti residensial
              berkualitas dengan pendekatan personal, informasi transparan, dan
              kenyamanan jangka panjang bagi keluarga Anda.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/property"
                className="rounded-xs bg-gray-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Lihat Properti
              </Link>
              <Link
                href={`https://wa.me/${siteConfig.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xs border border-gray-300 px-6 py-3 text-sm font-medium text-gray-950 transition hover:bg-white"
              >
                Hubungi Kami
              </Link>
            </div>
          </div>

          {/* Replace with your own hero photo at /public/images/hero.jpg */}
          <div className="relative aspect-4/3 overflow-hidden rounded-xs bg-gray-200 lg:aspect-square">
            <Image
              src="/images/hero-image.jpg"
              alt="Properti pilihan Griya Lestari"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-md font-medium text-[#B08D3E]">
                Tentang pendekatan kami
              </p>

              <h2 className="mt-2 text-4xl font-bold leading-tight tracking-tight text-gray-950">
                Dedikasi kurasi properti dengan integritas dan ketenangan.
              </h2>

              <p className="mt-4 leading-7 text-gray-600 text-md">
                Memilih rumah atau investasi properti adalah keputusan hidup
                yang penting. Griya Lestari hadir sebagai partner terpercaya
                yang mendampingi setiap tahap dengan data yang akurat dan
                pendampingan personal.
              </p>
            </div>

            <div className="divide-y divide-gray-100">
              {APPROACH_ITEMS.map((item) => (
                <div key={item.title} className="py-6 first:pt-0 last:pb-0">
                  <h3 className="font-semibold text-gray-950">{item.title}</h3>
                  <p className="mt-2 leading-6 text-gray-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="bg-[#F7F5F1]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
              Properti Pilihan
            </h2>
            <p className="mt-2 max-w-xl text-gray-600">
              Temukan pilihan properti yang tersedia dan sesuai dengan kebutuhan
              Anda.
            </p>
          </div>

          {properties.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => {
                const primaryImage = property.images[0];
                const specs = getSpecs(property);

                return (
                  <Link
                    key={property.id}
                    href={`/property/${property.slug}`}
                    className="group overflow-hidden rounded-xs border border-gray-100 bg-white transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                      {primaryImage ? (
                        <Image
                          src={primaryImage.url}
                          alt={property.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-gray-500">
                          Belum ada gambar
                        </div>
                      )}

                      <span className="absolute left-4 top-4 rounded-xs bg-gray-950 px-3 py-1 text-xs font-medium text-white">
                        {formatListingType(property.listingType)}
                      </span>
                    </div>

                    <div className="p-5">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        {formatPropertyType(property.type)}
                      </p>

                      <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-gray-950">
                        {property.title}
                      </h3>

                      <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                        <IconPin />
                        {property.city || "-"}
                      </p>

                      <p className="mt-4 text-xl font-bold text-gray-950">
                        Rp {formatPrice(property.price.toString())}
                      </p>

                      {specs.length > 0 && (
                        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-gray-100 pt-4 text-sm text-gray-500">
                          {specs.map((spec, i) => (
                            <span
                              key={spec}
                              className="flex items-center gap-2"
                            >
                              {i > 0 && <span aria-hidden>•</span>}
                              {spec}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="mt-4 text-sm font-medium text-gray-950 underline-offset-4 group-hover:underline">
                        Lihat Detail →
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl bg-white p-10 text-center">
              <p className="text-sm text-gray-500">
                Belum ada properti tersedia.
              </p>
            </div>
          )}

          {properties.length > 0 && (
            <div className="mt-10 flex justify-center">
              <Link
                href="/property"
                className="text-sm font-medium text-gray-950 underline underline-offset-4"
              >
                Lihat Semua Properti →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Principles */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="mt-2 max-w-2xl text-2xl font-bold leading-tight tracking-tight text-gray-950 sm:text-3xl">
            Prinsip Kerja Kami dalam Menemukan Hunian Anda
          </h2>

          <div className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {PRINCIPLES.map((principle) => (
              <div key={principle.number}>
                <p className="text-3xl font-bold text-[#B08D3E]">
                  {principle.number}
                </p>
                <h3 className="mt-3 font-semibold text-gray-950">
                  {principle.title}
                </h3>
                <p className="mt-2 leading-6 text-gray-600">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-950">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Sedang mencari properti?
          </h2>
          <p className="mt-4 leading-7 text-gray-300">
            Kami siap membantu Anda menemukan properti yang sesuai dengan
            kebutuhan, anggaran, dan visi keluarga Anda.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href={`https://wa.me/${siteConfig.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xs bg-white px-6 py-3 text-sm font-medium text-gray-950 transition hover:bg-gray-100"
            >
              Hubungi Kami
            </Link>
            <Link
              href="/property"
              className="rounded-xs border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Lihat Properti
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
