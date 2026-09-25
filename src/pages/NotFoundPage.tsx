import { ButtonLink } from '@/components/ui/Button'
import { GhostLink } from '@/components/ui/GhostLink'
import { SplitText } from '@/components/ui/SplitText'
import { useSeo } from '@/hooks/useSeo'

export default function NotFoundPage() {
  useSeo({ title: 'Page introuvable', noindex: true })
  return (
    <section className="container-page flex min-h-[70vh] flex-col justify-center py-16" aria-labelledby="not-found-title">
      <p className="label-caps">Erreur 404</p>
      <h1 id="not-found-title" className="mt-6 text-display font-extrabold">
        <SplitText text={'Cette page\ns’est évaporée.'} trigger="mount" />
      </h1>
      <p className="mt-8 max-w-xl text-subheading text-muted">
        Comme un sillage trop léger, la page que vous cherchez a disparu. Elle a peut-être été déplacée ou n’a jamais existé.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
        <ButtonLink to="/" size="lg">
          Retour à l’accueil
        </ButtonLink>
        <GhostLink to="/shop">Voir la boutique</GhostLink>
        <GhostLink to="/shop/nouveautes">Nouveautés</GhostLink>
      </div>
    </section>
  )
}
