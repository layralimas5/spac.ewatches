import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { buttonStyles } from '@/ui/components/Button'
import { Logo } from '@/ui/components/Logo'
import { CloseIcon, MenuIcon, WhatsAppIcon } from '@/ui/components/icons'
import { contactChannelLabel, generalContactLink } from '@/lib/whatsapp'
import { cn } from '@/lib/cn'

const navItems = [
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/importacao', label: 'Importação sob encomenda' },
] as const

/**
 * Header fixo com dois estados.
 *
 * Sobre o banner da home ele é transparente, deixando o hero escuro passar por
 * baixo. Assim que a página rola — ou em qualquer outra rota, que começa clara —
 * ele ganha fundo desfocado e inverte o texto para escuro.
 *
 * O botão de contato é dourado nos dois estados de propósito: é o CTA principal
 * e não pode depender da rolagem para continuar visível.
 */
export function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setScrolled] = useState(false)
  const reduceMotion = useReducedMotion()
  const location = useLocation()

  // Só a home abre com bloco escuro; nas demais o topo já é claro.
  const hasDarkHero = location.pathname === '/'
  const overHero = hasDarkHero && !isScrolled && !isMenuOpen

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'text-sm transition-colors duration-200',
      overHero
        ? isActive
          ? 'text-gold-400'
          : 'text-cream/75 hover:text-cream'
        : isActive
          ? 'text-gold-700'
          : 'text-ink-500 hover:text-ink-950',
    )

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300',
        overHero
          ? 'border-b border-transparent bg-transparent'
          : 'border-b border-paper-line bg-paper/80 shadow-[0_1px_20px_rgba(13,13,16,0.05)] backdrop-blur-xl',
      )}
    >
      <div className="container-brand flex h-18 items-center justify-between gap-6">
        <Link to="/" aria-label="Space Watches — página inicial">
          <Logo tone={overHero ? 'dark' : 'light'} />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={generalContactLink()}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonStyles('primary', 'md'), 'hidden md:inline-flex')}
          >
            <WhatsAppIcon className="h-4 w-4" />
            {`Falar no ${contactChannelLabel()}`}
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="menu-mobile"
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            className={cn(
              'inline-flex h-11 w-11 items-center justify-center rounded-lg transition-colors md:hidden',
              overHero ? 'text-cream' : 'text-ink-950',
            )}
          >
            {isMenuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="menu-mobile"
            initial={reduceMotion === true ? false : { opacity: 0, height: 0 }}
            animate={reduceMotion === true ? {} : { opacity: 1, height: 'auto' }}
            exit={reduceMotion === true ? {} : { opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-paper-line bg-paper md:hidden"
          >
            <nav aria-label="Principal (celular)" className="container-brand flex flex-col gap-1 py-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'rounded-lg px-3 py-3 text-base transition-colors',
                      isActive
                        ? 'bg-paper-alt text-gold-700'
                        : 'text-ink-500 hover:bg-paper-alt hover:text-ink-950',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              <a
                href={generalContactLink()}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonStyles('primary', 'lg'), 'mt-3 w-full')}
              >
                <WhatsAppIcon className="h-4 w-4" />
                {`Falar no ${contactChannelLabel()}`}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
