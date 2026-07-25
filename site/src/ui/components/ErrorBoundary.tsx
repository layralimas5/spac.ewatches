import { Component, type ErrorInfo, type ReactNode } from 'react'
import { buttonStyles } from './Button'

interface Props {
  readonly children: ReactNode
}

interface State {
  readonly hasError: boolean
}

/**
 * Rede de segurança para erro de renderização.
 * Sem isso, uma exceção em qualquer componente deixa a página em branco —
 * e página em branco não converte nem explica o que houve.
 */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[Space Watches] Erro de renderização:', error, info.componentStack)
  }

  override render(): ReactNode {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="container-brand flex flex-col items-center py-28 text-center">
        <h1 className="font-display text-3xl text-cream">Algo saiu do lugar</h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
          Tivemos um erro inesperado ao montar esta página. Recarregar costuma resolver.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className={`${buttonStyles('primary', 'lg')} mt-8`}
        >
          Recarregar a página
        </button>
      </div>
    )
  }
}
