import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface RevealProps {
  readonly children: ReactNode
  /** Atraso em segundos, para escalonar itens de uma lista. */
  readonly delay?: number
  readonly className?: string
}

/**
 * Entrada sutil ao rolar: sobe alguns pixels e aparece. Nada além disso.
 *
 * Quem tem `prefers-reduced-motion` ativo recebe o conteúdo já posicionado —
 * não uma versão degradada, a mesma coisa sem o deslocamento.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion === true) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
