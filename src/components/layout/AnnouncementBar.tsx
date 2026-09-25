import { Marquee } from '@/components/ui/Marquee'

const MESSAGES = [
  'Livraison offerte dès 60 € d’achat',
  '2 échantillons offerts à chaque commande',
  '−10 % sur votre commande avec le code BIENVENUE10',
  'Emballage cadeau offert sur tous les coffrets',
  'Retours gratuits sous 30 jours',
]

export function AnnouncementBar() {
  return (
    <aside aria-label="Informations et offres" className="border-b border-ink bg-bone">
      <p className="sr-only">{MESSAGES.join(' — ')}</p>
      <div aria-hidden="true">
        <Marquee duration={55} className="py-2.5">
          {MESSAGES.map((message) => (
            <span key={message} className="flex items-center label-caps">
              <span className="px-8">{message}</span>
              <span className="size-1.5 bg-gold" />
            </span>
          ))}
        </Marquee>
      </div>
    </aside>
  )
}
