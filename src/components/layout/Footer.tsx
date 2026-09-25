import { ArrowUpRight, Lock } from 'lucide-react'
import { Link } from 'react-router'
import { SplitText } from '@/components/ui/SplitText'
import { SITE } from '@/config/site'
import { footerColumns, legalLinks } from '@/data/content'

// Comptes génériques : à remplacer par les comptes officiels de l'enseigne.
const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/' },
  { label: 'TikTok', href: 'https://www.tiktok.com/' },
  { label: 'Pinterest', href: 'https://www.pinterest.fr/' },
  { label: 'YouTube', href: 'https://www.youtube.com/' },
]

const PAYMENTS = ['CB', 'Visa', 'Mastercard', 'PayPal', 'Apple Pay']

export function Footer() {
  return (
    <footer className="mt-auto bg-ink text-bone">
      <div className="container-page grid gap-12 pb-12 pt-16 md:grid-cols-12 md:pt-20">
        <div className="md:col-span-4">
          <p className="max-w-sm text-heading-sm font-extrabold">La parfumerie qui prend le temps de vous conseiller.</p>
          <p className="mt-4 max-w-sm text-body-sm text-bone/70">
            Parfums authentiques, échantillons offerts et emballages soignés à la main — de nos ateliers jusqu’à votre porte.
          </p>
          <div className="mt-8 flex flex-col items-start gap-2 text-body-sm">
            <a href={`mailto:${SITE.email}`} className="link-underline">
              {SITE.email}
            </a>
            <a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className="link-underline">
              {SITE.phone}
            </a>
            <p className="text-bone/60">Du lundi au samedi, 9 h – 19 h</p>
          </div>
        </div>

        {footerColumns.map((column) => (
          <nav key={column.title} aria-label={column.title} className="md:col-span-2">
            <p className="label-caps text-bone/60">{column.title}</p>
            <ul className="mt-5 flex flex-col gap-2.5">
              {column.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-body-sm link-underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="md:col-span-2">
          <p className="label-caps text-bone/60">Suivez-nous</p>
          <ul className="mt-5 flex flex-col gap-2.5">
            {SOCIALS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-body-sm"
                >
                  <span className="link-underline">{social.label}</span>
                  <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} aria-hidden="true" />
                  <span className="sr-only">(nouvelle fenêtre)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-page flex flex-col gap-4 border-t border-bone/20 py-6 md:flex-row md:items-center md:justify-between">
        <p className="flex items-center gap-2 label-caps text-bone/70">
          <Lock className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
          Paiement 100 % sécurisé
        </p>
        <ul className="flex flex-wrap gap-2" aria-label="Moyens de paiement acceptés">
          {PAYMENTS.map((payment) => (
            <li key={payment} className="border border-bone/30 px-2.5 py-1 label-caps">
              {payment}
            </li>
          ))}
        </ul>
      </div>

      <div className="overflow-hidden border-t border-bone/20 px-2 pt-8 md:px-4" aria-hidden="true">
        <SplitText
          as="p"
          text="BEAUTY SUCCESS"
          stagger={140}
          className="block whitespace-nowrap text-center text-mega font-extrabold uppercase"
        />
      </div>

      <div className="container-page flex flex-col gap-3 border-t border-bone/20 py-5 text-caption text-bone/60 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} {SITE.name} — Site de démonstration, marques et produits fictifs.</p>
        <ul className="flex flex-wrap gap-x-5 gap-y-1">
          {legalLinks.map((link) => (
            <li key={link.to}>
              <Link to={link.to} className="link-underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
