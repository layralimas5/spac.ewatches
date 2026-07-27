import { useEffect, useRef, useState } from 'react'
import type { WatchImage } from '@/domain/watch'
import { cn } from '@/lib/cn'
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon, ZoomInIcon } from './icons'

interface ImageLightboxProps {
  readonly images: readonly WatchImage[]
  readonly index: number
  readonly name: string
  readonly onChangeIndex: (index: number) => void
  readonly onClose: () => void
}

const controlClass =
  'inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/30 ' +
  'text-cream transition-colors hover:bg-cream hover:text-ink-950'

/**
 * Foto do produto em tela cheia, para o cliente conferir acabamento.
 *
 * É diálogo modal de verdade: prende o foco, fecha no Esc e no clique fora, e
 * devolve o foco a quem abriu. Sem isso, quem navega por teclado fica preso na
 * página atrás da foto.
 */
export function ImageLightbox({
  images,
  index,
  name,
  onChangeIndex,
  onClose,
}: ImageLightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const [isZoomed, setZoomed] = useState(false)
  const total = images.length
  const image = images[index] ?? images[0]

  // Trocou de foto, volta ao tamanho normal: a nova entraria ampliada num
  // ponto que não tem nada a ver com ela.
  useEffect(() => setZoomed(false), [index])

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    return () => {
      document.body.style.overflow = ''
      previouslyFocused.current?.focus()
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (total <= 1) return
      if (event.key === 'ArrowRight') onChangeIndex((index + 1) % total)
      if (event.key === 'ArrowLeft') onChangeIndex((index - 1 + total) % total)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [index, total, onChangeIndex, onClose])

  if (image === undefined) return null

  return (
    <div
      className="on-dark fixed inset-0 z-[80] flex flex-col bg-ink-950/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Foto ampliada: ${name}`}
    >
      <div className="flex items-center justify-between gap-4 p-4">
        <p className="truncate text-sm text-muted">
          {total > 1 ? `${name} · foto ${index + 1} de ${total}` : name}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setZoomed((current) => !current)}
            aria-pressed={isZoomed}
            aria-label={isZoomed ? 'Reduzir foto' : 'Ampliar foto para ver detalhes'}
            className={cn(controlClass, isZoomed && 'bg-cream text-ink-950')}
          >
            <ZoomInIcon className="h-5 w-5" />
          </button>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Fechar foto"
            className={controlClass}
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        className={cn(
          'relative flex flex-1 justify-center p-4 sm:p-8',
          // Ampliada, a foto passa do tamanho da tela e a área ganha rolagem:
          // é assim que se arrasta para ver o outro canto do mostrador.
          isZoomed ? 'items-start overflow-auto' : 'items-center',
        )}
      >
        {/* O fundo fecha ao clique, como todo visualizador de foto. É um botão
            atrás da imagem, não um clique na área toda: assim clicar na própria
            foto não fecha, e o teclado continua tendo um alvo de verdade. */}
        <button
          type="button"
          aria-label="Fechar foto"
          onClick={onClose}
          className="absolute inset-0 cursor-zoom-out"
        />

        {/*
          Tocar na foto amplia. No celular esta é a única forma de ver detalhe,
          porque não existe passar o mouse, e sem isso a foto em tela cheia sai
          quase do mesmo tamanho da que está na página.
        */}
        <button
          type="button"
          onClick={() => setZoomed((current) => !current)}
          aria-label={isZoomed ? 'Reduzir foto' : 'Ampliar foto para ver detalhes'}
          className={cn('relative shrink-0', isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in')}
        >
          <img
            src={image.url}
            alt={image.alt}
            className={cn(
              'object-contain',
              // Altura em `vh` e não em `%`: o pai é botão de altura automática,
              // e porcentagem ali não teria contra o que ser calculada.
              isZoomed ? 'h-auto w-[240%] max-w-none sm:w-[150%]' : 'max-h-[78vh] max-w-full',
            )}
          />
        </button>
      </div>

      {total > 1 && (
        <div className="flex items-center justify-center gap-4 p-4">
          <button
            type="button"
            onClick={() => onChangeIndex((index - 1 + total) % total)}
            aria-label="Foto anterior"
            className={controlClass}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => onChangeIndex((index + 1) % total)}
            aria-label="Próxima foto"
            className={controlClass}
          >
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  )
}
