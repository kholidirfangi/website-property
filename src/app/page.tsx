import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  formatListingType,
  formatPrice,
  formatPropertyType,
} from "@/lib/property-format";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";

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
      {/* Navbar */}
      <header className="border-b border-gray-100">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-lg font-bold tracking-tight">
            {siteConfig.name}
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-gray-950"
            >
              Home
            </Link>

            <Link
              href="/property"
              className="text-sm font-medium text-gray-700 hover:text-gray-950"
            >
              Properti
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-gray-500">
              Properti pilihan untuk Anda
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-950 sm:text-6xl">
              Temukan properti yang sesuai dengan kebutuhan Anda.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Temukan rumah, tanah, villa, dan properti lainnya dengan informasi
              yang jelas dan mudah dipahami.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/property"
                className="rounded-xl bg-gray-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Lihat Properti
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Featured Properties */}
      <section className="border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Properti pilihan
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                Temukan properti pilihan
              </h2>
            </div>

            <Link
              href="/property"
              className="hidden text-sm font-medium text-gray-600 hover:text-gray-950 sm:block"
            >
              Lihat semua →
            </Link>
          </div>

          {properties.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => {
                const primaryImage = property.images[0];

                return (
                  <Link
                    key={property.id}
                    href={`/property/${property.slug}`}
                    className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition hover:-translate-y-1 hover:shadow-md"
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

                      <span className="absolute left-4 top-4 rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
                        {formatListingType(property.listingType)}
                      </span>
                    </div>

                    <div className="p-5">
                      <p className="text-sm text-gray-500">
                        {formatPropertyType(property.type)}
                      </p>

                      <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-gray-950">
                        {property.title}
                      </h3>

                      <p className="mt-2 text-sm text-gray-500">
                        {property.city || "-"}
                      </p>

                      <p className="mt-4 text-xl font-bold text-gray-950">
                        Rp {formatPrice(property.price.toString())}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl bg-gray-50 p-10 text-center">
              <p className="text-sm text-gray-500">
                Belum ada properti tersedia.
              </p>
            </div>
          )}

          <div className="mt-6 sm:hidden">
            <Link
              href="/property"
              className="text-sm font-medium text-gray-600 hover:text-gray-950"
            >
              Lihat semua properti →
            </Link>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-gray-500">Mengapa kami</p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
              Membantu Anda menemukan properti dengan lebih mudah.
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Kami menyediakan informasi properti yang jelas agar Anda dapat
              mempertimbangkan pilihan sebelum menghubungi kami.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
              <h3 className="font-semibold text-gray-950">Informasi Jelas</h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Detail harga, lokasi, spesifikasi, dan gambar tersedia dalam
                satu halaman.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
              <h3 className="font-semibold text-gray-950">Properti Terpilih</h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Temukan berbagai pilihan properti yang dapat disesuaikan dengan
                kebutuhan Anda.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
              <h3 className="font-semibold text-gray-950">Mudah Dihubungi</h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Sampaikan pertanyaan atau ketertarikan Anda melalui formulir
                inquiry yang tersedia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="rounded-3xl bg-gray-950 px-6 py-12 text-white sm:px-12 sm:py-16">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-gray-400">
                Butuh bantuan?
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Belum menemukan properti yang sesuai?
              </h2>

              <p className="mt-4 leading-7 text-gray-300">
                Sampaikan kebutuhan Anda kepada kami. Kami siap membantu
                memberikan informasi mengenai properti yang tersedia.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/property"
                  className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-gray-950 transition hover:bg-gray-100"
                >
                  Lihat Properti
                </Link>

                <Link
                  href={`https://wa.me/${siteConfig.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-white/20 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Hubungi Kami
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {/* Brand */}
            <div className="lg:pr-10">
              <Link
                href="/"
                className="text-xl font-bold tracking-tight"
              >
                {siteConfig.name}
              </Link>

              <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
                {siteConfig.description}
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="text-sm font-semibold text-white">
                Navigasi
              </h3>

              <nav className="mt-4 flex flex-col gap-3">
                <Link
                  href="/"
                  className="w-fit text-sm text-gray-400 transition hover:text-white"
                >
                  Home
                </Link>

                <Link
                  href="/property"
                  className="w-fit text-sm text-gray-400 transition hover:text-white"
                >
                  Properti
                </Link>
              </nav>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-sm font-semibold text-white">
                Hubungi Kami
              </h3>

              <p className="mt-4 max-w-xs text-sm leading-6 text-gray-400">
                Tertarik dengan salah satu properti? Hubungi kami untuk
                mendapatkan informasi lebih lanjut.
              </p>

              <a
                href={`https://wa.me/${siteConfig.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-gray-950 transition hover:bg-gray-200"
              >
                Hubungi via WhatsApp
              </a>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} {siteConfig.name}. All rights
              reserved.
            </p>

            <p className="text-sm text-gray-500">
              Properti terpercaya untuk kebutuhan Anda.
            </p>
          </div>
        </div>
      </footer>

    </main>
  );
}
