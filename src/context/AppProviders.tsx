import type { ReactNode } from 'react'
import { AccountProvider } from './AccountProvider'
import { CartProvider } from './CartProvider'
import { FavoritesProvider } from './FavoritesProvider'
import { ToastProvider } from './ToastProvider'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AccountProvider>
        <FavoritesProvider>
          <CartProvider>{children}</CartProvider>
        </FavoritesProvider>
      </AccountProvider>
    </ToastProvider>
  )
}
