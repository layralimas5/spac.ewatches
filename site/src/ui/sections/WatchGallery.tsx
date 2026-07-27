import { useState } from 'react'
import type { WatchImage } from '@/domain/watch'
import { WatchPhoto } from '@/ui/components/WatchPhoto'
import { ImageLightbox } from '@/ui/components/ImageLightbox'
import { ZoomInIcon } from '@/ui/components/icons'
import { cn } from '@/lib/cn'

/** Quantas miniaturas a régua mostra enquanto a peça tem uma foto só. */
const PLACEHOLDER_THUMBS = 4

/** Aproximação do zoom na lupa. A foto tem 1200px, então 2x ainda é nítido. */
const ZOOM_SCALE = 2

export function WatchGallery({
  images,
  name,
}: {
  readonly images: readonly WatchImage[]
  readonly name: string
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isZoomOpen, setZoomOpen] = useState(false)
  /** Ponto do cursor sobre a foto, para a lupa ampliar onde o olho está. */
  const [origin, setOrigin] = useState('50% 50%')
  const [isMagnifying, setMagnifying] = useState(false)

  /*
   * Enquanto o cadastro tem uma foto só, a régua repete a mesma imagem para o
   * bloco já nascer com o formato final da página. Assim que a segunda foto
   * real entrar no catálogo, as miniaturas passam a ser as fotos de verdade,
   * sem mexer em nada aqui.
   */
  const thumbnails =
    images.length > 1
      ? images
      : Array.from({ length: PLACEHOLDER_THUMBS }, () => images[0]).filter(
          (image): image is WatchImage => image !== undefined,
        )

  const active = thumbnails[activeIndex] ?? images[0]

  const onMouseMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - box.left) / box.width) * 100
    const y = ((event.clientY - box.top) / box.height) * 100
    setOrigin(`${x}% ${y}%`)
  }

  if (active === undefined) return null

  return (
    <div className="lg:sticky lg:top-24">
      {/* No celular a régua fica embaixo; do sm para cima, na lateral. */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:gap-4">
        {thumbnails.length > 1 && (
          <ul className="flex list-none gap-3 sm:w-20 sm:shrink-0 sm:flex-col">
            {thumbnails.map((image, index) => (
              <li key={`${image.url}-${index}`} className="w-16 sm:w-full">
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Ver foto ${index + 1} de ${thumbnails.length} do ${name}`}
                  aria-current={index === activeIndex}
                  className={cn(
                    'aspect-square w-full overflow-hidden rounded-lg border bg-paper p-1.5 transition-colors',
                    index === activeIndex
                      ? 'border-ink-950'
                      : 'border-paper-line hover:border-ink-500/40',
                  )}
                >
                  <WatchPhoto image={image} fit="contain" sizes="80px" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Fundo branco e peça inteira à mostra: com `cover`, foto em retrato
            perdia a ponta da pulseira no corte. */}
        <div className="min-w-0 flex-1 overflow-hidden rounded-md border border-paper-line bg-paper">
          {/*
            Duas formas de ver detalhe, porque as duas existem no varejo:
            passar o mouse amplia na hora, direto no lugar onde o cursor está;
            o clique abre a foto em tela cheia, que é o único caminho no celular,
            onde não existe passar o mouse.
          */}
          <button
            type="button"
            onClick={() => setZoomOpen(true)}
            onMouseEnter={() => setMagnifying(true)}
            onMouseLeave={() => setMagnifying(false)}
            onMouseMove={onMouseMove}
            aria-label={`Ampliar foto do ${name}`}
            className="group relative block aspect-square w-full cursor-zoom-in overflow-hidden"
          >
            <div
              className="h-full w-full p-6 transition-transform duration-300 ease-brand motion-reduce:transform-none sm:p-10"
              style={{
                transform: isMagnifying ? `scale(${ZOOM_SCALE})` : 'scale(1)',
                transformOrigin: origin,
              }}
            >
              {/* `eager` de propósito: esta é a maior imagem da página e define o LCP. */}
              <WatchPhoto
                image={active}
                fit="contain"
                loading="eager"
                sizes="(min-width: 1024px) 440px, 80vw"
              />
            </div>

            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-paper-line bg-paper/90 text-ink-950 opacity-0 transition-opacity group-hover:opacity-100 max-sm:opacity-100"
            >
              <ZoomInIcon className="h-4 w-4" />
            </span>
          </button>
        </div>
      </div>

      {isZoomOpen && (
        <ImageLightbox
          images={images}
          index={Math.min(activeIndex, images.length - 1)}
          name={name}
          onChangeIndex={setActiveIndex}
          onClose={() => setZoomOpen(false)}
        />
      )}
    </div>
  )
}
