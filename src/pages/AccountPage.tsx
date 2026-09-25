import { Heart, LogOut, Package, Sparkles } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Button, ButtonLink } from '@/components/ui/Button'
import { TextField } from '@/components/ui/FormControls'
import { GhostButton } from '@/components/ui/GhostLink'
import { SplitText } from '@/components/ui/SplitText'
import type { Customer } from '@/context/AccountContext'
import { useSeo } from '@/hooks/useSeo'
import { useAccount, useFavorites, useToast } from '@/hooks/useStore'
import { loadOrders } from '@/services/api'
import type { Order } from '@/types/order'
import { formatDate, formatPrice, pluralize } from '@/utils/format'
import { isEmail } from '@/utils/validation'

type Errors = Record<string, string>

function SignInForm() {
  const { signIn } = useAccount()
  const { push } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const found: Errors = {}
    if (!isEmail(email)) found.email = 'Adresse e-mail invalide.'
    if (password.length < 8) found.password = '8 caractères minimum.'
    setErrors(found)
    if (Object.keys(found).length) return
    const customer = signIn(email)
    push({ eyebrow: 'Connexion réussie', title: `Bonjour ${customer.firstName} !` })
  }

  return (
    <form noValidate onSubmit={submit} className="flex flex-col gap-5" aria-labelledby="signin-title">
      <h2 id="signin-title" className="text-heading-sm font-extrabold">
        Déjà client ?
      </h2>
      <TextField label="Adresse e-mail" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
      <TextField
        label="Mot de passe"
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />
      <Button type="submit" size="lg">
        Se connecter
      </Button>
    </form>
  )
}

function SignUpForm() {
  const { signUp } = useAccount()
  const { push } = useToast()
  const [details, setDetails] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [errors, setErrors] = useState<Errors>({})
  const set = (key: keyof typeof details) => (event: { target: { value: string } }) =>
    setDetails((current) => ({ ...current, [key]: event.target.value }))

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const found: Errors = {}
    if (!details.firstName.trim()) found.firstName = 'Prénom requis.'
    if (!details.lastName.trim()) found.lastName = 'Nom requis.'
    if (!isEmail(details.email)) found.email = 'Adresse e-mail invalide.'
    if (details.password.length < 8) found.password = '8 caractères minimum.'
    setErrors(found)
    if (Object.keys(found).length) return
    const customer = signUp({ firstName: details.firstName.trim(), lastName: details.lastName.trim(), email: details.email })
    push({ eyebrow: 'Compte créé', title: `Bienvenue ${customer.firstName} !`, description: 'Votre code BIENVENUE10 vous attend au panier.' })
  }

  return (
    <form noValidate onSubmit={submit} className="flex flex-col gap-5" aria-labelledby="signup-title">
      <h2 id="signup-title" className="text-heading-sm font-extrabold">
        Nouveau client
      </h2>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Prénom" autoComplete="given-name" required value={details.firstName} onChange={set('firstName')} error={errors.firstName} />
        <TextField label="Nom" autoComplete="family-name" required value={details.lastName} onChange={set('lastName')} error={errors.lastName} />
      </div>
      <TextField label="Adresse e-mail" type="email" autoComplete="email" required value={details.email} onChange={set('email')} error={errors.email} />
      <TextField
        label="Mot de passe"
        type="password"
        autoComplete="new-password"
        required
        hint="8 caractères minimum."
        value={details.password}
        onChange={set('password')}
        error={errors.password}
      />
      <Button type="submit" size="lg" variant="outline">
        Créer mon compte
      </Button>
    </form>
  )
}

function OrderList({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="border border-dashed border-ink/40 p-6">
        <p className="font-semibold">Aucune commande pour le moment.</p>
        <Link to="/shop" className="mt-2 inline-block label-caps link-swipe">
          Découvrir la boutique
        </Link>
      </div>
    )
  }
  return (
    <ul className="flex flex-col">
      {orders.map((order) => (
        <li key={order.id} className="grid gap-2 border-t border-ink py-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <p className="font-extrabold">{order.id}</p>
            <p className="text-body-sm text-muted">
              {formatDate(order.createdAt)} · {pluralize(order.totals.itemCount, 'article')} · {order.items.map((item) => item.name).join(', ')}
            </p>
          </div>
          <div className="flex items-center gap-4 sm:justify-end">
            <span className="bg-dusty px-2 py-0.5 label-caps">{order.status}</span>
            <span className="font-semibold tabular">{formatPrice(order.totals.total)}</span>
          </div>
        </li>
      ))}
    </ul>
  )
}

function Dashboard({ customer, orders }: { customer: Customer; orders: Order[] }) {
  const { signOut } = useAccount()
  const { count } = useFavorites()
  const points = Math.floor(orders.reduce((sum, order) => sum + order.totals.total, 0))

  return (
    <>
      <h1 className="mt-8 text-display font-extrabold lg:mt-12">
        <SplitText text={`Bonjour,\n${customer.firstName}.`} trigger="mount" />
      </h1>
      <p className="mt-6 text-body text-muted">
        Membre depuis le {formatDate(customer.memberSince)} · {customer.email}
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-12">
        <section className="lg:col-span-8" aria-labelledby="orders-title">
          <h2 id="orders-title" className="mb-5 flex items-center gap-3 text-heading-sm font-extrabold">
            <Package className="size-6" strokeWidth={1.25} aria-hidden="true" />
            Mes commandes
          </h2>
          <OrderList orders={orders} />
          <p className="mt-4 text-caption text-muted">Les commandes passées sur cet appareil sont conservées localement (démonstration).</p>
        </section>
        <aside className="flex flex-col gap-2.5 lg:col-span-4" aria-label="Raccourcis du compte">
          <Link to="/favoris" className="group flex items-center justify-between border border-ink p-5 transition-colors hover:bg-ink hover:text-bone">
            <span className="flex items-center gap-3">
              <Heart className="size-5" strokeWidth={1.25} aria-hidden="true" />
              <span className="font-semibold">Mes favoris</span>
            </span>
            <span className="label-caps">{count}</span>
          </Link>
          <div className="flex items-center justify-between border border-ink bg-dusty p-5">
            <span className="flex items-center gap-3">
              <Sparkles className="size-5" strokeWidth={1.25} aria-hidden="true" />
              <span className="font-semibold">Carte fidélité</span>
            </span>
            <span className="label-caps">{pluralize(points, 'point')}</span>
          </div>
          <GhostButton onClick={signOut} className="mt-4 self-start">
            <span className="flex items-center gap-2">
              <LogOut className="size-4" strokeWidth={1.5} aria-hidden="true" />
              Se déconnecter
            </span>
          </GhostButton>
        </aside>
      </div>
    </>
  )
}

export default function AccountPage() {
  useSeo({ title: 'Mon compte', noindex: true })
  const { customer } = useAccount()
  const [orders] = useState(loadOrders)

  return (
    <div className="container-page pb-24 pt-6">
      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Mon compte' }]} />
      {customer ? (
        <Dashboard customer={customer} orders={orders} />
      ) : (
        <>
          <h1 className="mt-8 text-display font-extrabold lg:mt-12">
            <SplitText text="Mon compte" trigger="mount" />
          </h1>
          <p className="mt-6 max-w-xl text-body text-muted">
            Suivez vos commandes, retrouvez vos favoris et cumulez des points fidélité. Espace de démonstration : aucune donnée n’est
            envoyée, le mot de passe n’est jamais conservé.
          </p>
          <div className="mt-12 grid gap-12 border-t border-ink pt-10 lg:grid-cols-2 lg:gap-20">
            <SignInForm />
            <SignUpForm />
          </div>
          {orders.length > 0 && (
            <section className="mt-16" aria-labelledby="guest-orders">
              <h2 id="guest-orders" className="mb-5 text-heading-sm font-extrabold">
                Commandes passées sur cet appareil
              </h2>
              <OrderList orders={orders} />
            </section>
          )}
          <div className="mt-16">
            <ButtonLink to="/shop" variant="outline">
              Continuer mes achats
            </ButtonLink>
          </div>
        </>
      )}
    </div>
  )
}
