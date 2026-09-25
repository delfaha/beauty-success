import { Check, X } from 'lucide-react'
import { useId, useState, type FormEvent } from 'react'
import { useCart } from '@/hooks/useStore'
import { findPromoCode } from '@/utils/pricing'

export function PromoCodeForm() {
  const { promoCode, applyPromoCode, removePromoCode, subtotal } = useCart()
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const inputId = useId()
  const active = findPromoCode(promoCode)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!code.trim()) {
      setError('Saisissez un code.')
      return
    }
    const result = applyPromoCode(code)
    if (result.ok) {
      setCode('')
      setError(null)
    } else {
      setError(result.reason)
    }
  }

  if (active) {
    const eligible = !active.minSubtotal || subtotal >= active.minSubtotal
    return (
      <div className="flex items-start justify-between gap-3 border border-ink px-3 py-2.5">
        <p className="flex items-start gap-2 text-body-sm">
          <Check className="mt-0.5 size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
          <span>
            <strong className="font-extrabold">{active.code}</strong> — {active.label}
            {!eligible && <span className="block text-caption text-muted">Montant minimum non atteint : le code sera appliqué dès {active.minSubtotal} €.</span>}
          </span>
        </p>
        <button type="button" onClick={removePromoCode} className="grid size-6 place-items-center" aria-label={`Retirer le code ${active.code}`}>
          <X className="size-4" strokeWidth={1.5} />
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="label-caps font-semibold">
        Code promo
      </label>
      <div className="flex">
        <input
          id={inputId}
          value={code}
          onChange={(event) => {
            setCode(event.target.value.toUpperCase())
            setError(null)
          }}
          placeholder="Ex. BIENVENUE10"
          className="field-input h-11 flex-1 uppercase"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          autoComplete="off"
        />
        <button type="submit" className="h-11 border border-l-0 border-ink px-4 label-caps font-semibold transition-colors hover:bg-ink hover:text-bone">
          Appliquer
        </button>
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-caption font-semibold" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
