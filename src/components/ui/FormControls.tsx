import { Check, ChevronDown, CircleAlert } from 'lucide-react'
import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface FieldShellProps {
  label: string
  inputId: string
  error?: string
  hint?: string
  required?: boolean
  className?: string
  children: ReactNode
}

function FieldShell({ label, inputId, error, hint, required, className, children }: FieldShellProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={inputId} className="label-caps font-semibold">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-caption text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${inputId}-error`} className="flex items-center gap-1.5 text-caption font-semibold">
          <CircleAlert className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}

const describedBy = (id: string, error?: string, hint?: string) =>
  [error ? `${id}-error` : null, hint && !error ? `${id}-hint` : null].filter(Boolean).join(' ') || undefined

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  wrapperClassName?: string
}

export function TextField({ label, error, hint, id, wrapperClassName, className, required, ...rest }: TextFieldProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  return (
    <FieldShell label={label} inputId={inputId} error={error} hint={hint} required={required} className={wrapperClassName}>
      <input
        id={inputId}
        className={cn('field-input', className)}
        aria-invalid={error ? true : undefined}
        aria-required={required || undefined}
        aria-describedby={describedBy(inputId, error, hint)}
        {...rest}
      />
    </FieldShell>
  )
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  wrapperClassName?: string
  options: readonly string[]
}

export function SelectField({ label, error, id, wrapperClassName, options, required, ...rest }: SelectFieldProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  return (
    <FieldShell label={label} inputId={inputId} error={error} required={required} className={wrapperClassName}>
      <div className="relative">
        <select
          id={inputId}
          className="field-input appearance-none pr-10"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(inputId, error)}
          {...rest}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2" strokeWidth={1.5} aria-hidden="true" />
      </div>
    </FieldShell>
  )
}

interface CheckboxProps {
  label: ReactNode
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  count?: number
  className?: string
  name?: string
  invalid?: boolean
}

export function Checkbox({ label, checked, onChange, disabled, count, className, name, invalid }: CheckboxProps) {
  return (
    <label
      className={cn(
        'group flex items-center gap-3 py-1.5',
        disabled ? 'cursor-not-allowed text-muted' : 'cursor-pointer',
        className,
      )}
    >
      <input
        type="checkbox"
        className="sr-only"
        name={name}
        checked={checked}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="check-box" aria-hidden="true">
        <Check className="size-3" strokeWidth={2.5} />
      </span>
      <span className={cn('flex-1 text-body-sm', !disabled && 'transition-transform duration-300 group-hover:translate-x-0.5')}>
        {label}
      </span>
      {count !== undefined && <span className="text-caption text-muted tabular">{count}</span>}
    </label>
  )
}

interface RadioCardProps {
  name: string
  value: string
  checked: boolean
  onChange: (value: string) => void
  title: ReactNode
  description?: ReactNode
  aside?: ReactNode
}

export function RadioCard({ name, value, checked, onChange, title, description, aside }: RadioCardProps) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-start gap-4 border p-4 transition-colors duration-300',
        checked ? 'border-ink bg-paper' : 'border-ink/25 hover:border-ink',
      )}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} className="sr-only" />
      <span className="radio-dot mt-0.5" aria-hidden="true" />
      <span className="flex-1">
        <span className="block font-semibold">{title}</span>
        {description && <span className="mt-0.5 block text-body-sm text-muted">{description}</span>}
      </span>
      {aside && <span className="text-body-sm font-semibold tabular">{aside}</span>}
    </label>
  )
}
