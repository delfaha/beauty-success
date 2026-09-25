import { cn } from '@/utils/cn'

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col gap-2', className)} aria-hidden="true">
      <div className="skeleton aspect-[4/5]" />
      <div className="skeleton mt-2 h-3 w-24" />
      <div className="skeleton h-5 w-40" />
      <div className="skeleton h-3 w-32" />
      <div className="skeleton h-4 w-16" />
    </div>
  )
}

export function ProductPageSkeleton() {
  return (
    <div className="container-page grid gap-10 py-10 lg:grid-cols-12" aria-busy="true" aria-label="Chargement du produit">
      <div className="lg:col-span-7">
        <div className="skeleton aspect-[4/5]" />
      </div>
      <div className="flex flex-col gap-4 lg:col-span-5">
        <div className="skeleton h-3 w-32" />
        <div className="skeleton h-16 w-4/5" />
        <div className="skeleton h-4 w-40" />
        <div className="skeleton h-8 w-28" />
        <div className="skeleton h-24 w-full" />
        <div className="skeleton h-14 w-full" />
      </div>
    </div>
  )
}
