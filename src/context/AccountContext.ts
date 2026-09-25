import { createContext } from 'react'

export interface Customer {
  firstName: string
  lastName: string
  email: string
  memberSince: string
}

export interface AccountContextValue {
  customer: Customer | null
  /** Connexion simulée (aucun mot de passe n'est conservé). */
  signIn: (email: string) => Customer
  signUp: (details: Omit<Customer, 'memberSince'>) => Customer
  signOut: () => void
}

export const AccountContext = createContext<AccountContextValue | null>(null)
