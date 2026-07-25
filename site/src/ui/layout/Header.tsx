import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { navigation } from '@/config/navigation'
import { useCart } from '@/application/use-cart'
import { Logo } from '@/ui/components/Logo'
import { CartIcon, ChevronDownIcon, CloseIcon, MenuIcon, SearchIcon } from '@/ui/components/icons'
import { cn } from '@/lib/cn'

/**
 * Header sólido e fixo, com barra promocional acima e carrinho à direita —
 * a estrutura padrão do e-commerce brasileiro que a loja escolheu como
 * referência.
 *
 * Substituiu o header transparente sobre o banner: com barra promocional em
 * cima e fundo branco, não existe mais o estado escuro que exigia inverter a
 * cor do texto conforme a rolagem.
 */
export function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [isScrolled, setScrolled] = useState(false)
  const [query, setQuery] = useState('')
  const reduceMotion = useReducedMotion()
  const location = useLocation()
  const navigate = useNavigate()
  const { count, open } = useCart()

  useEffect(() => {
    setMenuOpen(false)
    setOpenSubmenu(null)
  }, [location.pathname, location.search])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
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

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault()
    const term = query.trim()
    navigate(term === '' ? '/catalogo' : `/catalogo?q=${encodeURIComponent(term)}`)
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b border-paper-line bg-paper/95 backdrop-blur-md transition-shadow duration-300',
        isScrolled && 'shadow-[0_1px_20px_rgba(13,13,16,0.06)]',
      )}
    >
      <div className="container-brand flex h-16 items-center gap-4 lg:h-18">
        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          aria-expanded={isMenuOpen}
          aria-controls="menu-mobile"
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          className="-ml-2 inline-flex h-10 w-10 items-center justify-center rounded-md text-ink-950 lg:hidden"
        >
          {isMenuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>

        <Link to="/" aria-label="Space Watches — página inicial" className="shrink-0">
          <Logo />
        </Link>

        {/* `onMouseLeave` na nav inteira, não em cada item: sair de um item e
            entrar no vizinho não deve piscar o painel. */}
        <nav
          aria-label="Principal"
          className="ml-6 hidden items-center gap-1 lg:flex"
          onMouseLeave={() => setOpenSubmenu(null)}
        >
          {navigation.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setOpenSubmenu(item.children === undefined ? null : item.label)}
            >
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors',
                    isActive ? 'text-gold-700' : 'text-ink-950 hover:text-gold-700',
                  )
                }
              >
                {item.label}
                {item.children !== undefined && <ChevronDownIcon className="h-3.5 w-3.5" />}
              </NavLink>

              {item.children !== undefined && openSubmenu === item.label && (
                <div className="absolute left-0 top-full w-60 rounded-lg border border-paper-line bg-paper p-2 shadow-[0_12px_32px_rgba(13,13,16,0.12)]">
                  <ul className="list-none">
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <Link
                          to={child.to}
                          className="block rounded-md px-3 py-2 text-sm text-ink-500 transition-colors hover:bg-paper-alt hover:text-ink-950"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </nav>

        <form
          onSubmit={submitSearch}
          role="search"
          className="ml-auto hidden max-w-xs flex-1 md:block"
        >
          <label htmlFor="busca-header" className="sr-only">
            Buscar relógios
          </label>
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
            <input
              id="busca-header"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="O que você procura?"
              className="h-10 w-full rounded-md border border-paper-line bg-paper-alt pl-9 pr-3 text-sm text-ink-950 placeholder:text-ink-500/70 focus:border-gold-600 focus:bg-paper"
            />
          </div>
        </form>

        <button
          type="button"
          onClick={open}
          className="relative ml-auto inline-flex h-10 w-10 items-center justify-center rounded-md text-ink-950 transition-colors hover:text-gold-700 md:ml-2"
          aria-label={count === 0 ? 'Abrir carrinho, vazio' : `Abrir carrinho, ${count} item(ns)`}
        >
          <CartIcon className="h-6 w-6" />
          {count > 0 && (
            <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1 text-[0.6875rem] font-semibold text-ink-950">
              {count}
            </span>
          )}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="menu-mobile"
            initial={reduceMotion === true ? false : { opacity: 0, height: 0 }}
            animate={reduceMotion === true ? {} : { opacity: 1, height: 'auto' }}
            exit={reduceMotion === true ? {} : { opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-paper-line bg-paper lg:hidden"
          >
            <div className="container-brand py-4">
              <form onSubmit={submitSearch} role="search" className="mb-4">
                <label htmlFor="busca-mobile" className="sr-only">
                  Buscar relógios
                </label>
                <div className="relative">
                  <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
                  <input
                    id="busca-mobile"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="O que você procura?"
                    className="h-11 w-full rounded-md border border-paper-line bg-paper-alt pl-9 pr-3 text-sm text-ink-950 placeholder:text-ink-500/70 focus:border-gold-600 focus:bg-paper"
                  />
                </div>
              </form>

              <nav aria-label="Principal (celular)">
                <ul className="list-none space-y-1">
                  {navigation.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={item.to}
                        className="block rounded-md px-3 py-3 text-base font-medium text-ink-950 hover:bg-paper-alt"
                      >
                        {item.label}
                      </Link>

                      {item.children !== undefined && (
                        <ul className="list-none border-l border-paper-line pl-3">
                          {item.children.map((child) => (
                            <li key={child.label}>
                              <Link
                                to={child.to}
                                className="block rounded-md px-3 py-2 text-sm text-ink-500 hover:bg-paper-alt hover:text-ink-950"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
