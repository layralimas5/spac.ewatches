import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

const fieldClass =
  'h-11 w-full rounded-lg border border-paper-line bg-paper px-3 text-sm text-ink-950 ' +
  'transition-colors placeholder:text-ink-400 focus:border-ink-950'

function Label({ htmlFor, children }: { readonly htmlFor: string; readonly children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-medium text-ink-500">
      {children}
    </label>
  )
}

function Error({ id, message }: { readonly id: string; readonly message: string | undefined }) {
  if (message === undefined) return null
  return (
    <p id={id} className="mt-1 text-xs text-negative">
      {message}
    </p>
  )
}

interface BaseFieldProps {
  readonly id: string
  readonly label: string
  readonly error?: string
  readonly hint?: string
  readonly className?: string
}

export function TextField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  className,
  type = 'text',
  placeholder,
  inputMode,
}: BaseFieldProps & {
  readonly value: string
  readonly onChange: (value: string) => void
  readonly type?: 'text' | 'email' | 'date' | 'number'
  readonly placeholder?: string
  readonly inputMode?: 'text' | 'numeric' | 'decimal' | 'tel'
}) {
  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error !== undefined}
        aria-describedby={error !== undefined ? `${id}-erro` : undefined}
        className={cn(fieldClass, 'mt-1.5', error !== undefined && 'border-negative')}
      />
      {hint !== undefined && error === undefined && (
        <p className="mt-1 text-xs text-ink-400">{hint}</p>
      )}
      <Error id={`${id}-erro`} message={error} />
    </div>
  )
}

export function SelectField<T extends string>({
  id,
  label,
  value,
  options,
  onChange,
  error,
  className,
}: BaseFieldProps & {
  readonly value: T
  readonly options: ReadonlyArray<{ readonly value: T; readonly label: string }>
  readonly onChange: (value: T) => void
}) {
  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className={cn(fieldClass, 'mt-1.5')}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Error id={`${id}-erro`} message={error} />
    </div>
  )
}

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  className,
  rows = 3,
  placeholder,
}: BaseFieldProps & {
  readonly value: string
  readonly onChange: (value: string) => void
  readonly rows?: number
  readonly placeholder?: string
}) {
  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          'mt-1.5 w-full rounded-lg border border-paper-line bg-paper px-3 py-2.5 text-sm',
          'text-ink-950 transition-colors placeholder:text-ink-400 focus:border-ink-950',
        )}
      />
    </div>
  )
}

/** Grade padrão dos formulários: uma coluna no celular, duas no desktop. */
export function FormGrid({ children }: { readonly children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>
}
