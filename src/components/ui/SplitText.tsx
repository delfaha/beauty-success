import { Fragment, type CSSProperties, type ElementType } from 'react'
import { useInView } from '@/hooks/useInView'
import { cn } from '@/utils/cn'

interface SplitTextProps {
  text: string
  as?: ElementType
  className?: string
  /** 'view' : à l'entrée dans l'écran ; 'mount' : dès l'affichage. */
  trigger?: 'view' | 'mount'
  delay?: number
  stagger?: number
  id?: string
}

/**
 * Titre révélé mot à mot (chaque mot glisse depuis un masque).
 * `\n` force un retour à la ligne. Le texte reste lisible par les lecteurs d'écran.
 */
export function SplitText({ text, as: Tag = 'span', className, trigger = 'view', delay = 0, stagger = 70, id }: SplitTextProps) {
  const { ref, inView } = useInView<HTMLElement>()
  const visible = trigger === 'mount' || inView
  let index = 0

  return (
    <Tag
      ref={ref}
      id={id}
      className={cn('split', visible && 'is-visible', className)}
      style={{ '--split-delay': `${delay}ms`, '--split-stagger': `${stagger}ms` } as CSSProperties}
    >
      {text.split('\n').map((line, lineIndex, lines) => (
        <Fragment key={lineIndex}>
          {line.split(' ').map((word, wordIndex, words) => {
            const current = index++
            return (
              <Fragment key={wordIndex}>
                <span className="split-word">
                  <span style={{ '--i': current } as CSSProperties}>{word}</span>
                </span>
                {wordIndex < words.length - 1 && ' '}
              </Fragment>
            )
          })}
          {lineIndex < lines.length - 1 && (
            <>
              {' '}
              <br />
            </>
          )}
        </Fragment>
      ))}
    </Tag>
  )
}
