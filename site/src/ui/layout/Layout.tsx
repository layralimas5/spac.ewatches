import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { cn } from '@/lib/cn'

/** Volta ao topo a cada navegação — sem isso a página nova abre na rolagem antiga. */
function useScrollToTopOnNavigate(pathname: string) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
}

export function Layout() {
  const { pathname } = useLocation()
  useScrollToTopOnNavigate(pathname)

  // O header é `fixed` para o banner da home passar por baixo dele. Quem não
  // tem banner precisa compensar a altura, senão o conteúdo nasce escondido.
  const isHome = pathname === '/'

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink-950"
      >
        Pular para o conteúdo
      </a>

      <Header />

      <main id="conteudo" className={cn('flex-1', !isHome && 'pt-18')}>
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
