import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-gray-950"
          >
            {siteConfig.name}
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-gray-600 transition hover:text-gray-950"
            >
              Home
            </Link>

            <Link
              href="/property"
              className="text-sm font-medium text-gray-600 transition hover:text-gray-950"
            >
              Properti
            </Link>

            <Link href="/about" className="text-sm font-medium text-gray-950">
              Tentang Kami
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-gray-500">Tentang Kami</p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">
              Membantu Anda menemukan properti yang tepat.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              {siteConfig.description} Kami menghadirkan informasi properti yang
              jelas, lengkap, dan mudah dipahami agar Anda dapat menentukan
              pilihan dengan lebih nyaman.
            </p>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Siapa kami</p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                Properti dengan informasi yang lebih transparan.
              </h2>
            </div>

            <div className="space-y-5 text-gray-600">
              <p className="leading-7">
                Kami menyediakan berbagai pilihan properti mulai dari rumah,
                tanah, villa, hingga jenis properti lainnya.
              </p>

              <p className="leading-7">
                Setiap properti ditampilkan dengan informasi seperti harga,
                lokasi, spesifikasi, dan foto agar calon pembeli dapat melihat
                gambaran properti sebelum menghubungi kami.
              </p>

              <p className="leading-7">
                Jika Anda membutuhkan informasi lebih lanjut mengenai properti
                tertentu, tim kami siap membantu menjawab pertanyaan dan
                memberikan informasi yang diperlukan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-gray-500">Nilai kami</p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
              Sederhana, jelas, dan mudah dihubungi.
            </h2>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
              <h3 className="font-semibold text-gray-950">Informasi Jelas</h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Kami berusaha menampilkan informasi properti secara jelas agar
                lebih mudah dipertimbangkan.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
              <h3 className="font-semibold text-gray-950">Pilihan Properti</h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Berbagai jenis properti tersedia untuk membantu Anda menemukan
                pilihan yang sesuai kebutuhan.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
              <h3 className="font-semibold text-gray-950">Mudah Dihubungi</h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Kami terbuka untuk membantu memberikan informasi mengenai
                properti yang Anda minati.
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
                Temukan properti
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Siap menemukan properti yang sesuai?
              </h2>

              <p className="mt-4 leading-7 text-gray-300">
                Lihat pilihan properti yang tersedia atau hubungi kami untuk
                mendapatkan informasi lebih lanjut.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/property"
                  className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-gray-950 transition hover:bg-gray-100"
                >
                  Lihat Properti
                </Link>

                <a
                  href={`https://wa.me/${siteConfig.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-white/20 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Hubungi Kami
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link href="/" className="font-semibold tracking-tight">
                {siteConfig.name}
              </Link>

              <p className="mt-1 text-sm text-gray-400">
                {siteConfig.description}
              </p>
            </div>

            <nav className="flex gap-5">
              <Link
                href="/"
                className="text-sm text-gray-400 transition hover:text-white"
              >
                Home
              </Link>

              <Link
                href="/property"
                className="text-sm text-gray-400 transition hover:text-white"
              >
                Properti
              </Link>
            </nav>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} {siteConfig.name}. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
