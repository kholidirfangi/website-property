import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div className="lg:pr-10">
            <Link href="/" className="text-xl font-bold tracking-tight">
              {siteConfig.name}
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
              {siteConfig.description}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-white">Navigasi</h3>

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

              <Link
                href="/about"
                className="w-fit text-sm text-gray-400 transition hover:text-white"
              >
                Tentang Kami
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white">Hubungi Kami</h3>

            <p className="mt-4 max-w-xs text-sm leading-6 text-gray-400">
              Tertarik dengan salah satu properti? Hubungi kami untuk
              mendapatkan informasi lebih lanjut.
            </p>

            <a
              href={`https://wa.me/${siteConfig.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-gray-950 transition hover:bg-gray-200"
            >
              Hubungi via WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>

          <p className="text-sm text-gray-500">
            Properti terpercaya untuk kebutuhan Anda.
          </p>
        </div>
      </div>
    </footer>
  );
}
