import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const EXPLORE_LINKS = [
  { href: "/property", label: "Cari Properti" },
  { href: "/property?listingType=jual", label: "Rumah Dijual" },
  { href: "/property?listingType=sewa", label: "Rumah Disewa" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "Tentang Kami" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="text-xl font-bold tracking-tight text-gray-950">
              Griya Lestari
            </p>
            <p className="mt-3 max-w-sm text-md leading-6 text-gray-600">
              Partner terpercaya untuk menemukan rumah, tanah, dan properti
              residensial dengan informasi yang jelas dan pendampingan
              personal di setiap tahap.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-950">Jelajahi</p>
            <ul className="mt-4 space-y-3">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition hover:text-gray-950"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-950">Perusahaan</p>
            <ul className="mt-4 space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition hover:text-gray-950"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={`https://wa.me/${siteConfig.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 transition hover:text-gray-950"
                >
                  WhatsApp
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-gray-100 pt-8 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Griya Lestari. Seluruh hak cipta dilindungi.</p>
          <div className="flex gap-6">
            <Link href="/privasi" className="hover:text-gray-950">
              Kebijakan Privasi
            </Link>
            <Link href="/syarat" className="hover:text-gray-950">
              Syarat &amp; Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}