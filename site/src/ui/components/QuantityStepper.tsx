interface QuantityStepperProps {
  readonly value: number
  readonly max: number
  readonly onChange: (quantity: number) => void
  /** Nome da peça, para o leitor de tela saber de qual quantidade se trata. */
  readonly label: string
}

export function QuantityStepper({ value, max, onChange, label }: QuantityStepperProps) {
  return (
    <div className="inline-flex h-10 items-center rounded-md border border-paper-line">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label={`Diminuir quantidade de ${label}`}
        className="h-full w-9 text-lg text-ink-500 transition-colors hover:text-ink-950 disabled:opacity-40 disabled:hover:text-ink-500"
      >
        −
      </button>

      {/* `aria-live` para a mudança ser anunciada sem precisar mover o foco. */}
      <span className="w-8 text-center text-sm font-medium text-ink-950" aria-live="polite">
        {value}
      </span>

      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Aumentar quantidade de ${label}`}
        className="h-full w-9 text-lg text-ink-500 transition-colors hover:text-ink-950 disabled:opacity-40 disabled:hover:text-ink-500"
      >
        +
      </button>
    </div>
  )
}
