import { Gift, ShieldCheck, Star, Truck, type LucideIcon } from 'lucide-react'
import { CountUp } from '@/components/ui/Counters'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { promises } from '@/data/content'

const ICONS: LucideIcon[] = [ShieldCheck, Truck, Gift, Star]

export function WhyUs() {
  return (
    <section className="bg-dusty py-16 md:py-24" aria-labelledby="why-title">
      <div className="container-page">
        <SectionHeader id="why-title" eyebrow="Pourquoi nous choisir ?" title="La parfumerie, en mieux." />
        <ul className="grid border-l border-t border-ink sm:grid-cols-2 xl:grid-cols-4">
          {promises.map((promise, index) => {
            const Icon = ICONS[index % ICONS.length]
            return (
              <Reveal as="li" key={promise.title} delay={index * 90} className="flex flex-col gap-8 border-b border-r border-ink p-6 md:p-8">
                <div className="flex items-center justify-between">
                  <span className="label-caps tabular">{String(index + 1).padStart(2, '0')}</span>
                  <Icon className="size-6" strokeWidth={1.25} aria-hidden="true" />
                </div>
                <p className="whitespace-nowrap text-[clamp(2.75rem,1rem+4vw,5rem)] font-extrabold leading-[0.9] tracking-[-0.05em]">
                  <CountUp to={promise.value} decimals={promise.decimals} suffix={promise.suffix} />
                </p>
                <div>
                  <h3 className="text-subheading font-extrabold">{promise.title}</h3>
                  <p className="mt-2 text-body-sm text-ink/80">{promise.text}</p>
                </div>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
