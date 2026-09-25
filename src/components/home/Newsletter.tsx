import { ArrowRight, LoaderCircle } from 'lucide-react'
import { useId, useState, type FormEvent } from 'react'
import { Checkbox } from '@/components/ui/FormControls'
import { SplitText } from '@/components/ui/SplitText'
import { subscribeToNewsletter } from '@/services/api'
import { isEmail } from '@/utils/validation'

type Status = 'idle' | 'loading' | 'success'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const inputId = useId()

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!isEmail(email)) {
      setError('Saisissez une adresse e-mail valide (ex. prenom@domaine.fr).')
      return
    }
    if (!consent) {
      setError('Merci de cocher la case pour recevoir nos e-mails.')
      return
    }
    setError(null)
    setStatus('loading')
    const result = await subscribeToNewsletter(email)
    setCode(result.code)
    setStatus('success')
  }

  return (
    <section className="py-16 md:py-24" aria-labelledby="newsletter-title">
      <div className="container-page grid gap-10 border-t border-ink pt-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="label-caps">Newsletter</p>
          <h2 id="newsletter-title" className="mt-4 text-display font-extrabold">
            <SplitText text={'Restez dans\nle sillage.'} />
          </h2>
        </div>
        <div className="flex flex-col justify-end lg:col-span-5">
          {status === 'success' ? (
            <div role="status" className="animate-fade-up">
              <p className="text-heading-sm font-extrabold">Bienvenue parmi nous.</p>
              <p className="mt-3 text-body">
                Votre code de bienvenue{' '}
                <strong className="border border-ink px-2 py-0.5 font-extrabold tracking-caps">{code}</strong> vous offre −10 % sur votre
                prochaine commande.
              </p>
            </div>
          ) : (
            <form noValidate onSubmit={submit}>
              <p className="text-body text-muted">
                Avant-premières, ventes privées et conseils de nos experts, une à deux fois par mois. En cadeau : −10 % sur votre prochaine
                commande.
              </p>
              <div className="mt-6 flex items-center border-b border-ink">
                <label htmlFor={inputId} className="sr-only">
                  Adresse e-mail
                </label>
                <input
                  id={inputId}
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    setError(null)
                  }}
                  placeholder="Votre adresse e-mail"
                  className="h-14 min-w-0 flex-1 bg-transparent text-subheading outline-none"
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? `${inputId}-error` : undefined}
                />
                <button type="submit" disabled={status === 'loading'} className="group flex h-14 items-center gap-2 pl-4 label-caps font-semibold">
                  {status === 'loading' ? (
                    <>
                      <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                      Inscription…
                    </>
                  ) : (
                    <>
                      <span className="link-underline">S’inscrire</span>
                      <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1.5} aria-hidden="true" />
                    </>
                  )}
                </button>
              </div>
              <Checkbox
                className="mt-4"
                label="J’accepte de recevoir les e-mails de Beauty Success. Désinscription en un clic."
                checked={consent}
                onChange={(value) => {
                  setConsent(value)
                  setError(null)
                }}
              />
              {error && (
                <p id={`${inputId}-error`} role="alert" className="mt-3 text-body-sm font-semibold">
                  {error}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
