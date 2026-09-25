import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { Toaster } from '@/components/ui/Toaster'
import { AppProviders } from '@/context/AppProviders'
import { AnnouncementBar } from './AnnouncementBar'
import { Footer } from './Footer'
import { BackToTop, CursorLabel, Preloader, RouteProgress } from './GlobalUi'
import { Header } from './Header'

export default function RootLayout() {
  const { pathname } = useLocation()

  return (
    <AppProviders>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[210] focus:bg-ink focus:px-4 focus:py-3 focus:text-bone"
      >
        Aller au contenu principal
      </a>
      <div className="flex min-h-dvh flex-col overflow-x-clip">
        <AnnouncementBar />
        <Header />
        <main id="contenu" key={pathname} tabIndex={-1} className="flex-1 animate-page-in outline-none">
          <Outlet />
        </main>
        <Footer />
      </div>
      <CartDrawer />
      <Toaster />
      <BackToTop />
      <RouteProgress />
      <CursorLabel />
      <Preloader />
      {/* Au chargement complet d'une URL, la clé d'historique vaut « default » : on indexe alors par URL
          pour ne pas réappliquer la position de défilement d'une autre page. */}
      <ScrollRestoration getKey={(location) => (location.key === 'default' ? location.pathname + location.search : location.key)} />
    </AppProviders>
  )
}
