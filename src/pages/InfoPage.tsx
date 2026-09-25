import { NavLink, useParams } from 'react-router'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Reveal } from '@/components/ui/Reveal'
import { SplitText } from '@/components/ui/SplitText'
import { infoPages } from '@/data/content'
import { useSeo } from '@/hooks/useSeo'
import { cn } from '@/utils/cn'
import NotFoundPage from './NotFoundPage'

/** Pages d'aide et d'informations légales : /aide/livraison, /aide/faq, /aide/cgv… */
export default function InfoPage() {
  const { slug = '' } = useParams()
  const page = infoPages[slug]

  useSeo({ title: page?.title ?? 'Page introuvable', description: page?.intro, noindex: !page })

  if (!page) return <NotFoundPage />

  return (
    <div className="container-page pb-24 pt-6">
      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Aide', to: '/aide/faq' }, { label: page.title }]} />
      <div className="mt-8 grid gap-12 lg:mt-12 lg:grid-cols-12">
        <aside className="lg:col-span-3" aria-label="Pages d’aide">
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
            {Object.entries(infoPages).map(([key, item]) => (
              <li key={key}>
                <NavLink
                  to={`/aide/${key}`}
                  className={({ isActive }) =>
                    cn('block py-1 label-caps transition-colors', isActive ? 'font-semibold text-ink' : 'text-muted hover:text-ink')
                  }
                >
                  {item.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </aside>
        <article className="lg:col-span-9">
          <p className="label-caps">{page.eyebrow}</p>
          <h1 className="mt-4 text-display font-extrabold">
            <SplitText text={page.title} trigger="mount" />
          </h1>
          <p className="mt-8 max-w-2xl text-subheading">{page.intro}</p>
          <div className="mt-12 border-b border-ink">
            {page.sections.map((section, index) => (
              <Reveal key={section.heading} delay={index * 80} className="grid gap-4 border-t border-ink py-8 md:grid-cols-12">
                <h2 className="text-heading-sm font-extrabold md:col-span-5">{section.heading}</h2>
                <div className="flex flex-col gap-3 text-body md:col-span-7">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </article>
      </div>
    </div>
  )
}
