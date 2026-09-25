import { useContext } from 'react'
import { AccountContext } from '@/context/AccountContext'
import { CartContext } from '@/context/CartContext'
import { FavoritesContext } from '@/context/FavoritesContext'
import { ToastContext } from '@/context/ToastContext'

function required<T>(value: T | null, name: string): T {
  if (value === null) throw new Error(`${name} doit être utilisé à l'intérieur de <AppProviders>.`)
  return value
}

export const useCart = () => required(useContext(CartContext), 'useCart')
export const useFavorites = () => required(useContext(FavoritesContext), 'useFavorites')
export const useToast = () => required(useContext(ToastContext), 'useToast')
export const useAccount = () => required(useContext(AccountContext), 'useAccount')
