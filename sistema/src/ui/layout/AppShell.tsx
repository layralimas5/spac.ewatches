import { useEffect, useState, type ComponentType, type SVGProps } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { cn } from '@/lib/cn'
import {
  BoxIcon,
  CartIcon,
  CloseIcon,
  DashboardIcon,
  MenuIcon,
  TruckIcon,
  UsersIcon,
  WalletIcon,
} from '@/ui/components/icons'

interface NavItem {
  readonly to: string
  readonly label: string
  readonly icon: ComponentType<SVGProps<SVGSVGElement>>
}

const navigation: readonly NavItem[] = [
  { to: '/', label: 'Painel', icon: DashboardIcon },
  { to: '/estoque', label: 'Estoque', icon: BoxIcon },
  { to: '/pedidos', label: 'Pedidos', icon: CartIcon },
  { to: '/clientes', label: 'Clientes', icon: UsersIcon },
  { to: '/entregas', label: 'Entregas', icon: TruckIcon },
  { to: '/financeiro', label: 'Financeiro', icon: WalletIcon },
]

function NavItems({ onNavigate }: { readonly onNavigate?: () => void }) {
  return (
    <nav aria-label="Navegação principal">
      <ul className="list-none space-y-1">
        {navigation.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === '/'}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                  isActive
                    ? 'bg-cream/10 font-medium text-cream'
                    : 'text-muted hover:bg-cream/5 hover:text-cream',
                )
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function Brand() {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-lg leading-none font-semibold tracking-tight text-cream">Space</span>
      <span className="text-[0.6875rem] font-medium tracking-[0.25em] text-muted uppercase">
        Gestão
      </span>
    </div>
  )
}

/**
 * Moldura do sistema: menu fixo à esquerda no desktop, gaveta no celular.
 *
 * O menu é escuro e o conteúdo claro de propósito: separa "onde eu estou" de
 * "o que eu estou fazendo" sem precisar de linha divisória nem de cor de marca.
 */
export function AppShell() {
  const [isMenuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  // Trocou de tela, fecha a gaveta: no celular ela cobre o conteúdo inteiro.
  useEffect(() => setMenuOpen(false), [location.pathname])

  return (
    <div className="min-h-dvh lg:flex">
      <a
        href="#conteudo"
        className="sr-only rounded-md bg-ink-950 px-4 py-2 text-cream focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50"
      >
        Ir para o conteúdo
      </a>

      {/* Menu fixo do desktop */}
      <aside className="on-dark hidden w-60 shrink-0 flex-col gap-8 bg-ink-950 p-5 lg:sticky lg:top-0 lg:flex lg:h-dvh">
        <Brand />
        <NavItems />
        <p className="mt-auto text-xs leading-relaxed text-ink-400">
          Dados guardados neste navegador. Antes de publicar, ligue o Supabase.
        </p>
      </aside>

      {/* Barra do celular */}
      <header className="on-dark sticky top-0 z-30 flex items-center gap-3 bg-ink-950 px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-cream"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
        <Brand />
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-ink-950/60"
          />
          <div className="on-dark relative flex h-full w-72 max-w-[80%] flex-col gap-8 bg-ink-950 p-5">
            <div className="flex items-center justify-between">
              <Brand />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Fechar menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-cream"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <NavItems onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      <main id="conteudo" className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
