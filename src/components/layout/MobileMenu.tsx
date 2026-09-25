import { ArrowRight, Heart, LifeBuoy, Plus, User, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { Drawer } from '@/components/ui/Drawer'
import { mainNav, type NavItem } from '@/data/navigation'
import { useAccount, useFavorites } from '@/hooks/useStore'
import { cn } from '@/utils/cn'
import { Wordmark } from './Wordmark'

function MobileNavItem({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false)
  const panelId = `mobile-${item.to.replace(/\W+/g, '-')}`
  return (
    <li className="border-b border-ink/15">
      <div className="flex items-center justify-between">
        <Link to={item.to} className="flex flex-1 items-center gap-3 py-3.5 text-[2rem] font-extrabold leading-none tracking-[-0.05em]">
          {item.accent && <span className="size-2 bg-gold" aria-hidden="true" />}
          {item.label}
        </Link>
        {item.mega && (
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={`${open ? 'Masquer' : 'Afficher'} les catégories ${item.label}`}
            className="grid size-11 place-items-center"
          >
            <Plus className={cn('size-5 transition-transform duration-500 ease-expo', open && 'rotate-45')} strokeWidth={1.25} />
          </button>
        )}
      </div>
      {item.mega && (
        <div
          id={panelId}
          className={cn('grid transition-[grid-template-rows] duration-500 ease-expo', open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}
        >
          <div className="overflow-hidden" inert={!open}>
            <div className="grid grid-cols-2 gap-x-4 gap-y-5 pb-6 pt-1">
              {item.mega.columns.map((column) => (
                <div key={column.title}>
                  <p className="label-caps text-muted">{column.title}</p>
                  <ul className="mt-2 flex flex-col gap-1.5">
                    {column.links.map((link) => (
                      <li key={link.to}>
                        <Link to={link.to} className="text-body-sm">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </li>
  )
}

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { count } = useFavorites()
  const { customer } = useAccount()
  const shortcuts = [
    { to: '/compte', label: customer ? `Bonjour ${customer.firstName}` : 'Mon compte', icon: User },
    { to: '/favoris', label: `Favoris (${count})`, icon: Heart },
    { to: '/aide/faq', label: 'Aide & FAQ', icon: LifeBuoy },
  ]

  return (
    <Drawer open={open} onClose={onClose} label="Menu principal" side="left" className="sm:max-w-md">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-ink px-4">
        <Wordmark className="text-[1.2rem]" />
        <button type="button" onClick={onClose} className="grid size-10 place-items-center" aria-label="Fermer le menu">
          <X className="size-5" strokeWidth={1.25} />
        </button>
      </div>
      <nav aria-label="Navigation mobile" className="flex-1 overflow-y-auto px-4 pb-8 pt-2">
        <ul className="drawer-stagger">
          {mainNav.map((item) => (
            <MobileNavItem key={item.label} item={item} />
          ))}
          <li className="border-b border-ink/15">
            <Link to="/shop/meilleures-ventes" className="block py-3.5 text-[2rem] font-extrabold leading-none tracking-[-0.05em]">
              Meilleures ventes
            </Link>
          </li>
          <li>
            <Link to="/shop" className="group flex items-center gap-2 py-5 label-caps font-semibold">
              <span className="link-underline">Toute la boutique</span>
              <ArrowRight className="size-3.5" strokeWidth={1.5} />
            </Link>
          </li>
        </ul>
        <ul className="mt-6 grid grid-cols-3 gap-2.5">
          {shortcuts.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <Link to={to} className="flex h-full flex-col gap-3 border border-ink p-3 transition-colors hover:bg-ink hover:text-bone">
                <Icon className="size-5" strokeWidth={1.25} aria-hidden="true" />
                <span className="label-caps">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <p className="shrink-0 border-t border-ink px-4 py-3 label-caps">Livraison offerte dès 60 € · 2 échantillons offerts</p>
    </Drawer>
  )
}
