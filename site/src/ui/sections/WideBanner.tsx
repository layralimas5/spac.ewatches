import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { wideBanner } from '@/config/banners'
import { Logo } from '@/ui/components/Logo'
import { Reveal } from '@/ui/components/Reveal'
import { ArrowRightIcon } from '@/ui/components/icons'

/**
 * Banner largo abaixo dos blocos de pronta-entrega e encomenda.
 *
 * A arte fica atrás e o texto à direita, sobre um véu que escurece só aquele
 * lado: a foto continua respirando à esquerda e o texto nunca depende da sorte
 * de cair numa área escura.
 *
 * Enquanto não houver imagem configurada, o bloco mostra a marca sobre fundo
 * neutro em vez de sumir. O espaço fica reservado com a proporção final, então
 * subir a arte depois não empurra o resto da página (nada de CLS).
 */
export function WideBanner() {
  const { image, imageAlt, to, eyebrow, title, description, ctaLabel } = wideBanner
  const hasText = title !== undefined

  const photo: ReactNode =
    image !== undefined ? (
      // O corte sobe um pouco (`35%`) porque o assunto da foto costuma estar na
      // parte de cima, e um corte centralizado come rosto.
      //
      // O zoom no hover mora na imagem, não no bloco: o bloco parado mantém o
      // texto no lugar e a borda arredondada firme enquanto a foto se aproxima.
      <img
        src={image}
        // Com texto por cima, a foto vira ilustração: o nome do link já vem do
        // título, e repetir a descrição da imagem só alonga a leitura.
        alt={hasText ? '' : (imageAlt ?? '')}
        // Zoom curto de propósito: numa foto que ocupa a largura toda, 10% de
        // aproximação vira um salto. 4% dá o sinal de "isto é clicável" sem
        // sacudir a página.
        className="h-full w-full object-cover object-[50%_35%] transition-transform duration-700 ease-brand group-hover:scale-[1.04] motion-reduce:transform-none"
        loading="lazy"
        decoding="async"
      />
    ) : (
      <span className="flex h-full w-full items-center justify-center border border-paper-line bg-paper-alt">
        <Logo />
      </span>
    )

  const overlay = hasText && image !== undefined && (
    <>
      {/* O véu vem da esquerda, que é o lado onde o texto fica. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-ink-950/95 via-ink-950/70 to-ink-950/10 sm:from-ink-950/90 sm:via-ink-950/55 sm:to-ink-950/5"
      />

      <div className="absolute inset-0 flex items-center justify-start p-5 sm:p-10 lg:p-14">
        <Reveal className="max-w-[16rem] text-left sm:max-w-sm">
          {eyebrow !== undefined && (
            <p className="eyebrow hidden text-muted sm:block">{eyebrow}</p>
          )}

          <p className="text-lg leading-tight font-semibold text-cream sm:mt-2 sm:text-3xl lg:text-4xl">
            {title}
          </p>

          {description !== undefined && (
            <p className="mt-2 hidden text-sm leading-relaxed text-muted sm:block sm:text-base">
              {description}
            </p>
          )}

          {ctaLabel !== undefined && (
            <span className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-cream underline underline-offset-4 sm:mt-4">
              {ctaLabel}
              {/* A seta anda quando o mouse entra: o movimento aponta o caminho. */}
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:translate-x-1 motion-reduce:transform-none" />
            </span>
          )}
        </Reveal>
      </div>
    </>
  )

  // 15/8 é a proporção em que os banners da loja são exportados (1920x1024).
  // Mantendo a mesma medida no celular e no desktop, a arte aparece inteira nos
  // dois, sem corte que engole metade da foto na tela estreita.
  const frame = 'group relative block aspect-[15/8] w-full overflow-hidden rounded-lg'

  return (
    <section className="container-brand py-4" aria-label="Banner da loja">
      {to !== undefined ? (
        <Link to={to} className={frame}>
          {photo}
          {overlay}
        </Link>
      ) : (
        <div className={frame}>
          {photo}
          {overlay}
        </div>
      )}
    </section>
  )
}
