import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import { ProductImage } from '@/components/product/ProductImage'
import { Badge } from '@/components/ui/Badge'
import { Price } from '@/components/ui/Price'
import type { NavItem } from '@/data/navigation'
import { useProducts } from '@/hooks/useProducts'
import { productPath } from '@/utils/product'

interface MegaMenuProps {
  id: string
  item: NavItem
  open: boolean
  onPointerEnter: () => void
}

/** Panneau déroulant plein écran : colonnes de liens + produit à la une. */
export function MegaMenu({ id, item, open, onPointerEnter }: MegaMenuProps) {
  const { products } = useProducts()
  if (!item.mega) return null
  const featured = products.find((product) => product.id === item.mega?.featuredId)
  let order = 0
  const stagger = () => ({ '--i': order++ }) as CSSProperties

  return (
    <div
      id={id}
      className="mega-panel absolute inset-x-0 top-full border-b border-ink bg-bone"
      data-open={open}
      inert={!open}
      onPointerEnter={onPointerEnter}
    >
      <div className="container-page grid grid-cols-12 gap-8 py-10">
        {item.mega.columns.map((column) => (
          <div key={column.title} className="col-span-2">
            <p className="mega-item label-caps text-muted" style={stagger()}>
              {column.title}
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {column.links.map((link) => (
                <li key={link.to} className="mega-item" style={stagger()}>
                  <Link to={link.to} className="link-underline text-body">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="mega-item col-span-2 flex items-end" style={stagger()}>
          <Link to={item.to} className="group text-heading-sm font-extrabold">
            <span className="link-underline">Tout voir</span>
            <span className="ml-2 inline-block transition-transform duration-500 ease-expo group-hover:translate-x-1.5" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
        {featured && (
          <Link
            to={productPath(featured.id)}
            className="mega-item group/tile art-host col-span-4 grid grid-cols-2 gap-5"
            style={stagger()}
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-sand">
              <div className="card-main absolute inset-0">
                <ProductImage src={featured.images[1] ?? featured.image} alt={`${featured.name} — ${featured.brand}`} />
              </div>
            </div>
            <div className="flex flex-col items-start justify-end gap-2">
              <Badge>{item.mega.featuredLabel}</Badge>
              <p className="label-caps text-muted">{featured.brand}</p>
              <p className="text-heading-sm font-extrabold">{featured.name}</p>
              <Price price={featured.price} oldPrice={featured.oldPrice} discount={featured.discount} />
              <span className="label-caps font-semibold link-underline">Découvrir</span>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}
