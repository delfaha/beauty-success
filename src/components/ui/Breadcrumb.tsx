import { Link } from 'react-router'
import { breadcrumbJsonLd, type BreadcrumbItem } from '@/utils/seo'
import { cn } from '@/utils/cn'
import { JsonLd } from './JsonLd'

export function Breadcrumb({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav aria-label="Fil d’Ariane" className={cn('label-caps text-muted', className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, index) => {
          const last = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.to && !last ? (
                <Link to={item.to} className="link-underline transition-colors hover:text-ink">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? 'page' : undefined} className={cn(last && 'text-ink')}>
                  {item.label}
                </span>
              )}
              {!last && <span aria-hidden="true">/</span>}
            </li>
          )
        })}
      </ol>
      <JsonLd data={breadcrumbJsonLd(items)} />
    </nav>
  )
}
