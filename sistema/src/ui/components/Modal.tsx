import { useEffect, useRef, type ReactNode } from 'react'
import { CloseIcon } from './icons'
import { IconButton } from './Button'

/**
 * Painel de formulário sobre a página.
 *
 * Diálogo modal de verdade: fecha no Esc, trava a rolagem de trás, leva o foco
 * para dentro e devolve para quem abriu. Sem isso, quem usa teclado continua
 * navegando na tabela atrás do formulário, sem perceber.
 */
export function Modal({
  title,
  description,
  onClose,
  children,
  footer,
}: {
  readonly title: string
  readonly description?: string
  readonly onClose: () => void
  readonly children: ReactNode
  readonly footer?: ReactNode
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab' || panelRef.current === null) return

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (first === undefined || last === undefined) return

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    panelRef.current?.querySelector<HTMLElement>('input, select, textarea, button')?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      previouslyFocused.current?.focus()
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-ink-950/50"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative flex max-h-[92dvh] w-full flex-col rounded-t-2xl bg-paper shadow-2xl sm:max-w-2xl sm:rounded-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-paper-line px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-ink-950">{title}</h2>
            {description !== undefined && (
              <p className="mt-0.5 text-xs text-ink-500">{description}</p>
            )}
          </div>
          <IconButton label="Fechar" onClick={onClose}>
            <CloseIcon className="h-5 w-5" />
          </IconButton>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>

        {footer !== undefined && (
          <footer className="flex flex-wrap justify-end gap-3 border-t border-paper-line px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {footer}
          </footer>
        )}
      </div>
    </div>
  )
}
