import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import NotFoundPage from './NotFoundPage'

/** Affiché si une page plante ou si un module ne peut pas être chargé. */
export default function ErrorPage() {
  const error = useRouteError()

  if (isRouteErrorResponse(error) && error.status === 404) return <NotFoundPage />

  const message = error instanceof Error ? error.message : 'Erreur inconnue'

  return (
    <section className="container-page flex min-h-[70vh] flex-col justify-center py-16" role="alert">
      <p className="label-caps">Oups</p>
      <h1 className="mt-6 text-display font-extrabold">Une erreur est survenue.</h1>
      <p className="mt-8 max-w-xl text-subheading text-muted">
        Nous n’avons pas pu afficher cette page. Réessayez dans un instant ; si le problème persiste, contactez notre service client.
      </p>
      {import.meta.env.DEV && <pre className="mt-6 max-w-2xl overflow-auto border border-ink p-4 text-caption">{message}</pre>}
      <div className="mt-10 flex flex-wrap items-center gap-6">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="h-12 bg-ink px-7 label-caps font-semibold text-bone"
        >
          Recharger la page
        </button>
        <Link to="/" className="label-caps font-semibold link-swipe">
          Retour à l’accueil
        </Link>
      </div>
    </section>
  )
}
