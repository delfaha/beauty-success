import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import { cn } from '@/utils/cn'
import { RollText } from './RollText'

type Variant = 'primary' | 'outline' | 'light' | 'outline-light'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary: 'border border-ink bg-ink text-bone enabled:hover:text-ink [--sweep-color:var(--color-bone)] aria-disabled:opacity-40',
  outline: 'border border-ink text-ink enabled:hover:text-bone [--sweep-color:var(--color-ink)]',
  light: 'border border-bone bg-bone text-ink enabled:hover:text-bone [--sweep-color:var(--color-ink)]',
  'outline-light': 'border border-bone/70 text-bone enabled:hover:text-ink [--sweep-color:var(--color-bone)]',
}

const linkHover: Record<Variant, string> = {
  primary: 'hover:text-ink',
  outline: 'hover:text-bone',
  light: 'hover:text-bone',
  'outline-light': 'hover:text-ink',
}

const sizes: Record<Size, string> = {
  sm: 'h-10 px-5',
  md: 'h-12 px-7',
  lg: 'h-14 px-9',
}

const base =
  'btn-sweep roll-host inline-flex items-center justify-center gap-3 whitespace-nowrap label-caps font-semibold transition-colors duration-500 disabled:opacity-40 select-none'

interface CommonProps {
  variant?: Variant
  size?: Size
  icon?: ReactNode
  fullWidth?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth,
  className,
  children,
  type = 'button',
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      {...rest}
    >
      <RollText>{children}</RollText>
      {icon}
    </button>
  )
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth,
  className,
  children,
  ...rest
}: CommonProps & LinkProps) {
  return (
    <Link
      className={cn(base, variants[variant], linkHover[variant], sizes[size], fullWidth && 'w-full', className)}
      {...rest}
    >
      <RollText>{children}</RollText>
      {icon}
    </Link>
  )
}
