import { useCallback, useEffect, useState } from 'react'
import { fetchProducts } from '@/services/api'
import type { Product } from '@/types/product'

/**
 * Chargement du catalogue avec cache mémoire partagé : le premier appel simule
 * une latence réseau (squelettes visibles), les suivants sont instantanés.
 */
let cache: Product[] | null = null
let inflight: Promise<Product[]> | null = null

function loadProducts(): Promise<Product[]> {
  inflight ??= fetchProducts()
    .then((products) => {
      cache = products
      return products
    })
    .catch((error: unknown) => {
      inflight = null
      throw error
    })
  return inflight
}

const EMPTY: Product[] = []

export function useProducts() {
  const [products, setProducts] = useState<Product[] | null>(cache)
  const [error, setError] = useState<Error | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (products) return
    let active = true
    loadProducts().then(
      (result) => {
        if (active) setProducts(result)
      },
      (reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason : new Error('Chargement impossible'))
      },
    )
    return () => {
      active = false
    }
  }, [products, attempt])

  const retry = useCallback(() => {
    setError(null)
    setAttempt((value) => value + 1)
  }, [])

  return {
    products: products ?? EMPTY,
    isLoading: products === null && error === null,
    error,
    retry,
  }
}

/** Produit unique (null si introuvable une fois le catalogue chargé). */
export function useProduct(id: string | undefined) {
  const { products, isLoading, error, retry } = useProducts()
  const product = id ? (products.find((candidate) => candidate.id === id) ?? null) : null
  return { product, products, isLoading, error, retry }
}
