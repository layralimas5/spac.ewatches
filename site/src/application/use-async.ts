import { useEffect, useRef, useState } from 'react'

export type AsyncState<T> =
  | { readonly status: 'loading' }
  | { readonly status: 'error'; readonly error: Error }
  | { readonly status: 'success'; readonly data: T }

/**
 * Executa uma operação assíncrona e devolve um estado discriminado.
 *
 * O union força a UI a tratar loading e erro, não dá pra ler `data` sem antes
 * estreitar o status, então "esqueci o estado de erro" vira erro de compilação.
 *
 * `key` identifica a consulta: quando ela muda, a operação roda de novo. É uma
 * string em vez de um array de dependências porque a chave descreve o que está
 * sendo buscado, e não a identidade das variáveis que a montaram.
 */
export function useAsync<T>(operation: () => Promise<T>, key: string): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' })
  const latestOperation = useRef(operation)

  // Guarda a versão mais recente da operação sem colocá-la nas deps do efeito
  // abaixo: quem decide reexecutar é a `key`, não a identidade da função (que
  // muda a cada render, porque os chamadores a criam inline).
  useEffect(() => {
    latestOperation.current = operation
  })

  useEffect(() => {
    let active = true
    setState({ status: 'loading' })

    latestOperation
      .current()
      .then((data) => {
        if (active) setState({ status: 'success', data })
      })
      .catch((cause: unknown) => {
        if (!active) return
        setState({
          status: 'error',
          error: cause instanceof Error ? cause : new Error(String(cause)),
        })
      })

    // Ignora o resultado se a key mudar antes da Promise resolver.
    return () => {
      active = false
    }
  }, [key])

  return state
}
