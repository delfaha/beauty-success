import type { ComponentType } from 'react'
import { createBrowserRouter } from 'react-router'
import { PageLoader } from '@/components/layout/GlobalUi'
import RootLayout from '@/components/layout/RootLayout'
import ErrorPage from '@/pages/ErrorPage'
import NotFoundPage from '@/pages/NotFoundPage'

/** Chargement différé : chaque page devient un fichier JavaScript séparé. */
const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
})

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    HydrateFallback: PageLoader,
    ErrorBoundary: ErrorPage,
    children: [
      {
        // Les erreurs d'une page s'affichent dans la mise en page (en-tête et pied conservés).
        ErrorBoundary: ErrorPage,
        children: [
          { index: true, lazy: page(() => import('@/pages/HomePage')) },
          { path: 'shop', lazy: page(() => import('@/pages/ShopPage')) },
          { path: 'shop/:slug', lazy: page(() => import('@/pages/CategoryPage')) },
          { path: 'product/:id', lazy: page(() => import('@/pages/ProductPage')) },
          { path: 'search', lazy: page(() => import('@/pages/SearchPage')) },
          { path: 'cart', lazy: page(() => import('@/pages/CartPage')) },
          { path: 'checkout', lazy: page(() => import('@/pages/CheckoutPage')) },
          { path: 'favoris', lazy: page(() => import('@/pages/FavoritesPage')) },
          { path: 'compte', lazy: page(() => import('@/pages/AccountPage')) },
          { path: 'aide/:slug', lazy: page(() => import('@/pages/InfoPage')) },
          { path: '*', Component: NotFoundPage },
        ],
      },
    ],
  },
])
