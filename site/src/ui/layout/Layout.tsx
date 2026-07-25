import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnnouncementBar } from './AnnouncementBar'
import { Header } from './Header'
import { Footer } from './Footer'
import { CartDrawer } from '@/ui/components/CartDrawer'

/** Volta ao topo a cada navegação — sem isso a página nova abre na rolagem antiga. */
function useScrollToTopOnNavigate(pathname: string) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
}

export function Layout() {
  const { pathname } = useLocation()
  useScrollToTopOnNavigate(pathname)

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-ink-950 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-paper"
      >
        Pular para o conteúdo
      </a>

      <AnnouncementBar />
      <Header />

      <main id="conteudo" className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <CartDrawer />
    </div>
  )
}
