import { Check, CreditCard, LoaderCircle, Lock, Smartphone, Wallet } from 'lucide-react'
import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { OrderSummary } from '@/components/cart/OrderSummary'
import { PromoCodeForm } from '@/components/cart/PromoCodeForm'
import { ProductImage } from '@/components/product/ProductImage'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Button, ButtonLink } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Checkbox, RadioCard, SelectField, TextField } from '@/components/ui/FormControls'
import { GhostButton, GhostLink } from '@/components/ui/GhostLink'
import { SplitText } from '@/components/ui/SplitText'
import { COUNTRIES, SHIPPING_METHODS, type ShippingMethodId } from '@/config/shop'
import type { Customer } from '@/context/AccountContext'
import { useSeo } from '@/hooks/useSeo'
import { useAccount, useCart } from '@/hooks/useStore'
import { submitOrder } from '@/services/api'
import type { Order, PaymentMethod } from '@/types/order'
import { cn } from '@/utils/cn'
import { formatDate, formatPrice } from '@/utils/format'
import { computeTotals, getShippingMethod, shippingCost } from '@/utils/pricing'
import {
  formatCardNumber,
  formatExpiry,
  isCardNumber,
  isCvc,
  isEmail,
  isExpiry,
  isPhone,
  isPostalCode,
} from '@/utils/validation'

type Step = 1 | 2 | 3

interface CheckoutForm {
  email: string
  firstName: string
  lastName: string
  phone: string
  address: string
  address2: string
  postalCode: string
  city: string
  country: string
  shipping: ShippingMethodId
  payment: PaymentMethod
  cardName: string
  cardNumber: string
  cardExpiry: string
  cardCvc: string
  acceptTerms: boolean
  newsletter: boolean
}

type Errors = Partial<Record<keyof CheckoutForm, string>>

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; description: string; icon: typeof CreditCard }[] = [
  { value: 'card', label: 'Carte bancaire', description: 'CB, Visa, Mastercard', icon: CreditCard },
  { value: 'paypal', label: 'PayPal', description: 'Vous serez redirigé vers PayPal (simulation)', icon: Wallet },
  { value: 'applepay', label: 'Apple Pay', description: 'Validation sur votre appareil (simulation)', icon: Smartphone },
]

const PAYMENT_LABELS: Record<PaymentMethod, string> = { card: 'Carte bancaire', paypal: 'PayPal', applepay: 'Apple Pay' }

function initialForm(customer: Customer | null): CheckoutForm {
  return {
    email: customer?.email ?? '',
    firstName: customer?.firstName ?? '',
    lastName: customer?.lastName ?? '',
    phone: '',
    address: '',
    address2: '',
    postalCode: '',
    city: '',
    country: COUNTRIES[0],
    shipping: 'standard',
    payment: 'card',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    acceptTerms: false,
    newsletter: false,
  }
}

function validateStep(step: Step, form: CheckoutForm): Errors {
  const errors: Errors = {}
  if (step === 1) {
    if (!isEmail(form.email)) errors.email = 'Saisissez une adresse e-mail valide.'
    if (!form.firstName.trim()) errors.firstName = 'Le prénom est requis.'
    if (!form.lastName.trim()) errors.lastName = 'Le nom est requis.'
    if (!isPhone(form.phone)) errors.phone = 'Saisissez un numéro de téléphone valide.'
  }
  if (step === 2) {
    if (!form.address.trim()) errors.address = 'L’adresse est requise.'
    if (!isPostalCode(form.postalCode)) errors.postalCode = 'Code postal invalide (4 ou 5 chiffres).'
    if (!form.city.trim()) errors.city = 'La ville est requise.'
  }
  if (step === 3) {
    if (form.payment === 'card') {
      if (!form.cardName.trim()) errors.cardName = 'Le nom du titulaire est requis.'
      if (!isCardNumber(form.cardNumber)) errors.cardNumber = 'Numéro de carte invalide.'
      if (!isExpiry(form.cardExpiry)) errors.cardExpiry = 'Date invalide ou dépassée (MM/AA).'
      if (!isCvc(form.cardCvc)) errors.cardCvc = '3 ou 4 chiffres.'
    }
    if (!form.acceptTerms) errors.acceptTerms = 'Veuillez accepter les conditions générales de vente.'
  }
  return errors
}

interface StepSectionProps {
  step: Step
  current: Step
  title: string
  summary: ReactNode
  onEdit: () => void
  children: ReactNode
}

function StepSection({ step, current, title, summary, onEdit, children }: StepSectionProps) {
  const done = current > step
  const active = current === step
  return (
    <section className="border-t border-ink py-6" aria-labelledby={`step-${step}-title`}>
      <div className="flex items-center justify-between gap-4">
        <h2 id={`step-${step}-title`} className={cn('flex items-center gap-3 text-heading-sm font-extrabold', !active && !done && 'text-muted')}>
          <span
            className={cn(
              'grid size-8 shrink-0 place-items-center border text-body-sm',
              done || active ? 'border-ink bg-ink text-bone' : 'border-ink/30',
            )}
            aria-hidden="true"
          >
            {done ? <Check className="size-4" strokeWidth={2} /> : step}
          </span>
          {title}
          <span className="sr-only">{done ? '(terminé)' : active ? '(étape en cours)' : '(à venir)'}</span>
        </h2>
        {done && (
          <GhostButton onClick={onEdit} aria-label={`Modifier : ${title}`}>
            Modifier
          </GhostButton>
        )}
      </div>
      {done && <div className="mt-3 pl-11 text-body-sm text-muted">{summary}</div>}
      {active && <div className="mt-6 animate-fade-up">{children}</div>}
    </section>
  )
}

function OrderConfirmation({ order }: { order: Order }) {
  const method = getShippingMethod(order.shippingMethod)
  return (
    <div className="container-page pb-24 pt-10">
      <p className="label-caps">Commande confirmée · {formatDate(order.createdAt)}</p>
      <h1 className="mt-6 text-display font-extrabold">
        <SplitText text={`Merci,\n${order.address.firstName}.`} trigger="mount" />
      </h1>
      <p className="mt-8 max-w-2xl text-subheading">
        Votre commande <strong className="font-extrabold">{order.id}</strong> est confirmée. Un récapitulatif vient d’être envoyé à{' '}
        {order.email} (simulation — aucun e-mail n’est réellement envoyé).
      </p>

      <div className="mt-12 grid gap-10 border-t border-ink pt-10 md:grid-cols-3">
        <div>
          <p className="label-caps text-muted">Livraison</p>
          <p className="mt-3 font-semibold">{method.label}</p>
          <p className="text-body-sm text-muted">{method.description}</p>
          <address className="mt-3 text-body-sm not-italic">
            {order.address.firstName} {order.address.lastName}
            <br />
            {order.address.address}
            {order.address.address2 && (
              <>
                <br />
                {order.address.address2}
              </>
            )}
            <br />
            {order.address.postalCode} {order.address.city}, {order.address.country}
          </address>
        </div>
        <div>
          <p className="label-caps text-muted">Paiement</p>
          <p className="mt-3 font-semibold">{PAYMENT_LABELS[order.paymentMethod]}</p>
          <p className="text-body-sm text-muted">Paiement simulé — aucun débit n’a été effectué.</p>
        </div>
        <div>
          <p className="label-caps text-muted">Récapitulatif</p>
          <ul className="mt-3 flex flex-col gap-2 text-body-sm">
            {order.items.map((item) => (
              <li key={item.productId} className="flex justify-between gap-3">
                <span>
                  {item.quantity} × {item.name}
                </span>
                <span className="tabular">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <OrderSummary totals={order.totals} promoCode={order.promoCode} className="mt-5" />
        </div>
      </div>

      <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
        <ButtonLink to="/shop" size="lg">
          Continuer mes achats
        </ButtonLink>
        <GhostLink to="/compte">Suivre mes commandes</GhostLink>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  useSeo({ title: 'Commande sécurisée', noindex: true })
  const { items, promoCode, clearCart } = useCart()
  const { customer } = useAccount()
  const [form, setForm] = useState<CheckoutForm>(() => initialForm(customer))
  const [errors, setErrors] = useState<Errors>({})
  const [step, setStep] = useState<Step>(1)
  const [status, setStatus] = useState<'editing' | 'processing' | 'done'>('editing')
  const [order, setOrder] = useState<Order | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const totals = computeTotals(items, { promoCode, shippingMethod: form.shipping })
  const method = getShippingMethod(form.shipping)

  if (status === 'done' && order) return <OrderConfirmation order={order} />

  if (items.length === 0) {
    return (
      <div className="container-page pb-24 pt-6">
        <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Commande' }]} />
        <EmptyState className="mt-10" headingLevel="h1" title="Votre panier est vide." description="Ajoutez des produits à votre panier pour passer commande.">
          <ButtonLink to="/shop">Découvrir la boutique</ButtonLink>
        </EmptyState>
      </div>
    )
  }

  const update = <K extends keyof CheckoutForm>(key: K, value: CheckoutForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  const focusFirstError = (found: Errors) => {
    const key = Object.keys(found)[0]
    if (!key) return
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`[name="${key}"]`)?.focus())
  }

  const goNext = (current: Step) => {
    const found = validateStep(current, form)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      focusFirstError(found)
      return
    }
    setStep((current + 1) as Step)
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (step < 3) {
      goNext(step)
      return
    }
    for (const candidate of [1, 2, 3] as Step[]) {
      const found = validateStep(candidate, form)
      if (Object.keys(found).length > 0) {
        setErrors(found)
        setStep(candidate)
        focusFirstError(found)
        return
      }
    }
    setStatus('processing')
    const placed = await submitOrder({
      email: form.email.trim(),
      address: {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        address: form.address.trim(),
        address2: form.address2.trim(),
        postalCode: form.postalCode.trim(),
        city: form.city.trim(),
        country: form.country,
        phone: form.phone.trim(),
      },
      shippingMethod: form.shipping,
      paymentMethod: form.payment,
      items,
      promoCode,
      totals,
    })
    setOrder(placed)
    setStatus('done')
    clearCart()
    window.scrollTo({ top: 0 })
  }

  const field = <K extends keyof CheckoutForm>(key: K) => ({
    name: key,
    value: form[key] as string,
    error: errors[key],
    onChange: (event: { target: { value: string } }) => update(key, event.target.value as CheckoutForm[K]),
  })

  return (
    <div className="container-page pb-24 pt-6">
      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Panier', to: '/cart' }, { label: 'Commande' }]} />
      <h1 className="mt-8 text-display font-extrabold lg:mt-12">
        <SplitText text="Commande" trigger="mount" />
      </h1>
      <p className="mt-4 flex items-center gap-2 label-caps text-muted">
        <Lock className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
        Paiement sécurisé — démonstration, aucun débit réel
      </p>

      <div className="mt-10 grid gap-12 lg:grid-cols-12">
        <form ref={formRef} noValidate onSubmit={submit} className="lg:col-span-7" aria-label="Formulaire de commande">
          <StepSection
            step={1}
            current={step}
            title="Vos coordonnées"
            onEdit={() => setStep(1)}
            summary={
              <>
                {form.firstName} {form.lastName} · {form.email} · {form.phone}
              </>
            }
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Adresse e-mail" type="email" autoComplete="email" required wrapperClassName="sm:col-span-2" {...field('email')} />
              <TextField label="Prénom" autoComplete="given-name" required {...field('firstName')} />
              <TextField label="Nom" autoComplete="family-name" required {...field('lastName')} />
              <TextField
                label="Téléphone"
                type="tel"
                autoComplete="tel"
                required
                hint="Pour le suivi de votre livraison."
                wrapperClassName="sm:col-span-2"
                {...field('phone')}
              />
            </div>
            <Button type="submit" size="lg" className="mt-8">
              Continuer vers la livraison
            </Button>
          </StepSection>

          <StepSection
            step={2}
            current={step}
            title="Livraison"
            onEdit={() => setStep(2)}
            summary={
              <>
                {form.address}, {form.postalCode} {form.city} — {method.label}
              </>
            }
          >
            <div className="grid gap-5 sm:grid-cols-6">
              <TextField label="Adresse" autoComplete="address-line1" required wrapperClassName="sm:col-span-6" {...field('address')} />
              <TextField
                label="Complément d’adresse"
                autoComplete="address-line2"
                wrapperClassName="sm:col-span-6"
                {...field('address2')}
              />
              <TextField label="Code postal" autoComplete="postal-code" inputMode="numeric" required wrapperClassName="sm:col-span-2" {...field('postalCode')} />
              <TextField label="Ville" autoComplete="address-level2" required wrapperClassName="sm:col-span-4" {...field('city')} />
              <SelectField
                label="Pays"
                name="country"
                autoComplete="country-name"
                options={COUNTRIES}
                value={form.country}
                onChange={(event) => update('country', event.target.value)}
                wrapperClassName="sm:col-span-6"
              />
            </div>
            <fieldset className="mt-8">
              <legend className="label-caps font-semibold">Mode de livraison</legend>
              <div className="mt-3 grid gap-2.5">
                {SHIPPING_METHODS.map((option) => {
                  const cost = shippingCost(option, totals.subtotal)
                  return (
                    <RadioCard
                      key={option.id}
                      name="shipping"
                      value={option.id}
                      checked={form.shipping === option.id}
                      onChange={(value) => update('shipping', value as ShippingMethodId)}
                      title={option.label}
                      description={option.description}
                      aside={cost === 0 ? 'Offert' : formatPrice(cost)}
                    />
                  )
                })}
              </div>
            </fieldset>
            <Button type="submit" size="lg" className="mt-8">
              Continuer vers le paiement
            </Button>
          </StepSection>

          <StepSection step={3} current={step} title="Paiement" onEdit={() => setStep(3)} summary={PAYMENT_LABELS[form.payment]}>
            <fieldset>
              <legend className="label-caps font-semibold">Moyen de paiement</legend>
              <div className="mt-3 grid gap-2.5">
                {PAYMENT_OPTIONS.map((option) => (
                  <RadioCard
                    key={option.value}
                    name="payment"
                    value={option.value}
                    checked={form.payment === option.value}
                    onChange={(value) => update('payment', value as PaymentMethod)}
                    title={
                      <span className="flex items-center gap-2">
                        <option.icon className="size-4" strokeWidth={1.5} aria-hidden="true" />
                        {option.label}
                      </span>
                    }
                    description={option.description}
                  />
                ))}
              </div>
            </fieldset>

            {form.payment === 'card' && (
              <div className="mt-6 grid animate-fade-up gap-5 border border-ink/25 bg-paper p-4 sm:grid-cols-4 md:p-5">
                <p className="text-caption text-muted sm:col-span-4">
                  Paiement simulé : n’utilisez pas de vraie carte. Numéro de test accepté : 4242 4242 4242 4242, date future, 3 chiffres.
                </p>
                <TextField label="Titulaire de la carte" autoComplete="off" required wrapperClassName="sm:col-span-4" {...field('cardName')} />
                <TextField
                  label="Numéro de carte"
                  inputMode="numeric"
                  autoComplete="off"
                  required
                  wrapperClassName="sm:col-span-4"
                  placeholder="0000 0000 0000 0000"
                  {...field('cardNumber')}
                  onChange={(event) => update('cardNumber', formatCardNumber(event.target.value))}
                />
                <TextField
                  label="Expiration"
                  inputMode="numeric"
                  autoComplete="off"
                  required
                  placeholder="MM/AA"
                  wrapperClassName="sm:col-span-2"
                  {...field('cardExpiry')}
                  onChange={(event) => update('cardExpiry', formatExpiry(event.target.value))}
                />
                <TextField
                  label="Cryptogramme"
                  inputMode="numeric"
                  autoComplete="off"
                  required
                  maxLength={4}
                  placeholder="123"
                  wrapperClassName="sm:col-span-2"
                  {...field('cardCvc')}
                  onChange={(event) => update('cardCvc', event.target.value.replace(/\D/g, ''))}
                />
              </div>
            )}

            <div className="mt-6 flex flex-col gap-1">
              <Checkbox
                label={
                  <>
                    J’accepte les <a href="/aide/cgv" target="_blank" className="link-swipe">conditions générales de vente</a>.
                  </>
                }
                name="acceptTerms"
                invalid={Boolean(errors.acceptTerms)}
                checked={form.acceptTerms}
                onChange={(value) => update('acceptTerms', value)}
              />
              {errors.acceptTerms && (
                <p className="text-caption font-semibold" role="alert">
                  {errors.acceptTerms}
                </p>
              )}
              <Checkbox label="Recevoir les offres et nouveautés par e-mail" checked={form.newsletter} onChange={(value) => update('newsletter', value)} />
            </div>

            <Button
              type="submit"
              size="lg"
              fullWidth
              className="mt-8"
              disabled={status === 'processing'}
              icon={
                status === 'processing' ? (
                  <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Lock className="size-4" strokeWidth={1.5} aria-hidden="true" />
                )
              }
            >
              {status === 'processing' ? 'Paiement en cours…' : `Payer ${formatPrice(totals.total)}`}
            </Button>
          </StepSection>
          <div className="border-t border-ink" />
        </form>

        <aside className="lg:col-span-5" aria-labelledby="checkout-summary">
          <div className="flex flex-col gap-6 border border-ink p-5 md:p-6 lg:sticky lg:top-[calc(var(--header-h,0px)_+_2rem)]">
            <h2 id="checkout-summary" className="label-caps font-semibold">
              Votre commande
            </h2>
            <ul className="flex max-h-80 flex-col gap-4 overflow-y-auto">
              {items.map((item) => (
                <li key={item.productId} className="flex items-center gap-4">
                  <div className="relative h-20 w-16 shrink-0 bg-sand">
                    <div className="absolute inset-0 overflow-hidden">
                      <ProductImage src={item.image} alt="" />
                    </div>
                    <span className="absolute -right-2 -top-2 grid size-5 place-items-center bg-ink text-caption font-semibold text-bone">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="label-caps text-muted">{item.brand}</p>
                    <p className="truncate text-body-sm font-extrabold">{item.name}</p>
                    <p className="text-caption text-muted">{item.volume}</p>
                  </div>
                  <p className="text-body-sm font-semibold tabular">{formatPrice(item.price * item.quantity)}</p>
                </li>
              ))}
            </ul>
            <PromoCodeForm />
            <OrderSummary totals={totals} promoCode={promoCode} shippingLabel={method.label.toLowerCase()} />
          </div>
        </aside>
      </div>
    </div>
  )
}
