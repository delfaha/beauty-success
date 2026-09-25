import { Plus } from 'lucide-react'
import { useId, useState, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: ReactNode
  children: ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()
  const triggerId = `${id}-trigger`
  const panelId = `${id}-panel`

  return (
    <div className="border-b border-ink">
      <h3>
        <button
          type="button"
          id={triggerId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="group flex w-full items-center justify-between gap-4 py-5 text-left label-caps font-semibold"
        >
          <span className="link-underline">{title}</span>
          <Plus
            aria-hidden="true"
            className={cn('size-4 shrink-0 transition-transform duration-500 ease-expo', open && 'rotate-45')}
            strokeWidth={1.5}
          />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className={cn(
          'grid transition-[grid-template-rows] duration-500 ease-expo',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden" inert={!open}>
          <div className="pb-6 text-body-sm">{children}</div>
        </div>
      </div>
    </div>
  )
}
