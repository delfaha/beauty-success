import { ChevronDown, Heart, Menu, Search, ShoppingBag, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { RollText } from '@/components/ui/RollText'
import { SearchOverlay } from '@/components/search/SearchOverlay'
import { mainNav } from '@/data/navigation'
import { useScrolled } from '@/hooks/useScrolled'
import { useAccount, useCart, useFavorites } from '@/hooks/useStore'
import { cn } from '@/utils/cn'
import { MegaMenu } from './MegaMenu'
import { MobileMenu } from './MobileMenu'
import { Wordmark } from './Wordmark'

function CountBadge({ value, animateKey }: { value: number; animateKey?: number }) {
  if (value <= 0) return null
  return (
    <span
      key={animateKey}
      className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center bg-ink px-1 text-[0.6875rem] font-semibold leading-none text-bone tabular animate-bump"
      aria-hidden="true"
    >
      {value}
    </span>
  )
}

/** Fine barre de progression de lecture sous l'en-tête. */
function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0
      if (barRef.current) barRef.current.style.transform = `scaleX(${ratio})`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return <div ref={barRef} aria-hidden="true" className="absolute inset-x-0 -bottom-px h-0.5 origin-left scale-x-0 bg-ink" />
}

const iconButton = 'relative grid size-10 place-items-center transition-opacity hover:opacity-60'

export function Header() {
  const location = useLocation()
  const compact = useScrolled(40)
  const { itemCount, openCart, addCount } = useCart()
  const { count: favoriteCount } = useFavorites()
  const { customer } = useAccount()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeMega, setActiveMega] = useState<string | null>(null)
  const headerRef = useRef<HTMLElement>(null)
  const closeTimer = useRef(0)

  // Toute navigation referme les panneaux (ajustement d'état pendant le rendu).
  const routeKey = location.pathname + location.search
  const [previousRoute, setPreviousRoute] = useState(routeKey)
  if (previousRoute !== routeKey) {
    setPreviousRoute(routeKey)
    setMenuOpen(false)
    setSearchOpen(false)
    setActiveMega(null)
  }

  // Hauteur de l'en-tête exposée en CSS (barre d'outils collante du catalogue).
  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    const observer = new ResizeObserver(() => {
      document.documentElement.style.setProperty('--header-h', `${header.offsetHeight}px`)
    })
    observer.observe(header)
    return () => observer.disconnect()
  }, [])

  // Raccourci « / » pour ouvrir la recherche, Échap pour fermer le méga-menu.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveMega(null)
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target as HTMLElement | null
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return
      event.preventDefault()
      setSearchOpen(true)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => () => window.clearTimeout(closeTimer.current), [])

  const openMega = (label: string) => {
    window.clearTimeout(closeTimer.current)
    setActiveMega(label)
  }
  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setActiveMega(null), 160)
  }

  const cartLabel = `Ouvrir le panier, ${itemCount} article${itemCount > 1 ? 's' : ''}`

  return (
    <>
      <header ref={headerRef} className="sticky top-0 z-50 border-b border-ink bg-bone" onPointerLeave={scheduleClose}>
        <div className="container-page">
          <div
            className={cn(
              'grid grid-cols-[1fr_auto_1fr] items-center transition-[height] duration-500 ease-expo',
              compact ? 'h-14 lg:h-16' : 'h-14 lg:h-[5.25rem]',
            )}
          >
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className={cn(iconButton, '-ml-2 lg:hidden')}
                aria-label="Ouvrir le menu"
                aria-expanded={menuOpen}
              >
                <Menu className="size-5" strokeWidth={1.25} />
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="group hidden h-10 w-full max-w-xs items-center gap-3 border-b border-ink/30 text-left transition-colors hover:border-ink lg:flex"
                aria-label="Rechercher un produit (raccourci : touche /)"
              >
                <Search className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                <span className="flex-1 truncate text-body-sm text-muted">Rechercher un parfum, une marque…</span>
                <kbd className="border border-ink/30 px-1.5 text-caption text-muted" aria-hidden="true">
                  /
                </kbd>
              </button>
            </div>

            <Link to="/" className="wordmark-host flex flex-col items-center" aria-label="Beauty Success — retour à l’accueil">
              <Wordmark
                className={cn(
                  'transition-[font-size] duration-500 ease-expo',
                  compact ? 'text-[1.3rem] lg:text-[1.65rem]' : 'text-[1.3rem] lg:text-[2.15rem]',
                )}
              />
              <span
                className={cn(
                  'hidden overflow-hidden label-caps tracking-[0.3em] transition-all duration-500 ease-expo lg:block',
                  compact ? 'max-h-0 opacity-0' : 'mt-1.5 max-h-5 opacity-100',
                )}
                aria-hidden="true"
              >
                Parfumerie
              </span>
            </Link>

            <div className="flex items-center justify-end gap-0.5">
              <button type="button" onClick={() => setSearchOpen(true)} className={cn(iconButton, 'lg:hidden')} aria-label="Rechercher">
                <Search className="size-5" strokeWidth={1.25} />
              </button>
              <Link
                to="/compte"
                className={cn(iconButton, 'hidden sm:grid xl:flex xl:w-auto xl:gap-2 xl:px-2')}
                aria-label={customer ? `Mon compte (${customer.firstName})` : 'Mon compte'}
              >
                <User className="size-5" strokeWidth={1.25} aria-hidden="true" />
                <span className="hidden label-caps xl:inline">{customer ? customer.firstName : 'Compte'}</span>
              </Link>
              <Link to="/favoris" className={cn(iconButton, 'hidden sm:grid')} aria-label={`Mes favoris (${favoriteCount})`}>
                <Heart className="size-5" strokeWidth={1.25} aria-hidden="true" />
                <CountBadge value={favoriteCount} />
              </Link>
              <button
                type="button"
                onClick={openCart}
                className={cn(iconButton, '-mr-2 lg:mr-0 xl:flex xl:w-auto xl:gap-2 xl:px-2')}
                aria-label={cartLabel}
              >
                <span className="relative">
                  <ShoppingBag className="size-5" strokeWidth={1.25} aria-hidden="true" />
                  <CountBadge value={itemCount} animateKey={addCount} />
                </span>
                <span className="hidden label-caps xl:inline">Panier</span>
              </button>
            </div>
          </div>
        </div>

        <nav aria-label="Navigation principale" className="relative hidden border-t border-ink/15 lg:block">
          <ul className="container-page flex h-11 items-stretch justify-center gap-8 xl:gap-11">
            {mainNav.map((item) => {
              const menuId = `mega-${item.to.replace(/\W+/g, '-')}`
              const expanded = activeMega === item.label
              return (
                <li
                  key={item.label}
                  className="flex items-center gap-1"
                  onPointerEnter={() => (item.mega ? openMega(item.label) : scheduleClose())}
                >
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        'roll-host flex h-full items-center gap-2 text-[0.8125rem] uppercase tracking-caps',
                        isActive && 'font-bold',
                      )
                    }
                  >
                    {item.accent && <span className="size-1.5 bg-gold" aria-hidden="true" />}
                    <RollText>{item.label}</RollText>
                  </NavLink>
                  {item.mega && (
                    <button
                      type="button"
                      onClick={() => (expanded ? setActiveMega(null) : openMega(item.label))}
                      aria-expanded={expanded}
                      aria-controls={menuId}
                      aria-label={`Sous-menu ${item.label}`}
                      className="grid size-5 place-items-center"
                    >
                      <ChevronDown
                        className={cn('size-3.5 transition-transform duration-500 ease-expo', expanded && 'rotate-180')}
                        strokeWidth={1.5}
                      />
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
          {mainNav.map((item) =>
            item.mega ? (
              <MegaMenu
                key={item.label}
                id={`mega-${item.to.replace(/\W+/g, '-')}`}
                item={item}
                open={activeMega === item.label}
                onPointerEnter={() => openMega(item.label)}
              />
            ) : null,
          )}
        </nav>
        <ScrollProgress />
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
