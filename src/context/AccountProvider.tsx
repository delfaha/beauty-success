import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { readStorage, removeStorage, writeStorage } from '@/utils/storage'
import { AccountContext, type AccountContextValue, type Customer } from './AccountContext'

const KEY = 'customer'

function isCustomer(value: unknown): value is Customer {
  return typeof value === 'object' && value !== null && typeof (value as Customer).email === 'string'
}

function nameFromEmail(email: string): string {
  const local = email.split('@')[0]?.split(/[._-]/)[0] ?? ''
  return local ? local.charAt(0).toUpperCase() + local.slice(1) : 'Client'
}

export function AccountProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(() => readStorage(KEY, null, isCustomer))

  useEffect(() => {
    if (customer) writeStorage(KEY, customer)
    else removeStorage(KEY)
  }, [customer])

  const signIn = useCallback((email: string) => {
    const next: Customer = {
      firstName: nameFromEmail(email),
      lastName: '',
      email: email.trim().toLowerCase(),
      memberSince: new Date().toISOString(),
    }
    setCustomer(next)
    return next
  }, [])

  const signUp = useCallback((details: Omit<Customer, 'memberSince'>) => {
    const next: Customer = { ...details, email: details.email.trim().toLowerCase(), memberSince: new Date().toISOString() }
    setCustomer(next)
    return next
  }, [])

  const value = useMemo<AccountContextValue>(
    () => ({ customer, signIn, signUp, signOut: () => setCustomer(null) }),
    [customer, signIn, signUp],
  )

  return <AccountContext value={value}>{children}</AccountContext>
}
