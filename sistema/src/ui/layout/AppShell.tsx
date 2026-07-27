import { useEffect, useState, type ComponentType, type SVGProps } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useSession } from '@/application/use-settings'
import { sessionStore } from '@/infra'
import { cn } from '@/lib/cn'
import { Topbar } from './Topbar'
import {
  BoxIcon,
  CartIcon,
  CloseIcon,
  DashboardIcon,
  LogoutIcon,
  SettingsIcon,
  TruckIcon,
  UsersIcon,
  WalletIcon,
} from '@/ui/components/icons'
import { LockScreen } from '@/ui/pages/LockScreen'

interface NavItem {
  readonly to: string
  readonly label: string
  readonly icon: ComponentType<SVGProps<SVGSVGElement>>
}

const mainNavigation: readonly NavItem[] = [
  { to: '/', label: 'Painel', icon: DashboardIcon },
  { to: '/estoque', label: 'Estoque', icon: BoxIcon },
  { to: '/pedidos', label: 'Pedidos', icon: CartIcon },
  { to: '/clientes', label: 'Clientes', icon: UsersIcon },
  { to: '/entregas', label: 'Entregas', icon: TruckIcon },
  { to: '/financeiro', label: 'Financeiro', icon: WalletIcon },
]

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
    isActive ? 'bg-cream/10 font-medium text-cream' : 'text-muted hover:bg-cream/5 hover:text-cream',
  )

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

function SidebarContent({ onNavigate }: { readonly onNavigate?: () => void }) {
  const navigate = useNavigate()

  const leave = () => {
    onNavigate?.()
    sessionStore.set(false)
    navigate('/')
  }

  return (
    <>
      <nav aria-label="Navegação principal" className="flex-1">
        <ul className="list-none space-y-1">
          {mainNavigation.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} end={item.to === '/'} onClick={onNavigate} className={linkClass}>
                <item.icon className="h-5 w-5 shrink-0" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Ajustes e saída ficam separados do resto: são o fim da lista em
          qualquer sistema, e misturá-los com as telas de trabalho confunde. */}
      <div className="border-t border-cream/10 pt-3">
        <ul className="list-none space-y-1">
          <li>
            <NavLink to="/configuracoes" onClick={onNavigate} className={linkClass}>
              <SettingsIcon className="h-5 w-5 shrink-0" />
              Configurações
            </NavLink>
          </li>
          <li>
            <button
              type="button"
              onClick={leave}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-muted transition-colors hover:bg-cream/5 hover:text-cream"
            >
              <LogoutIcon className="h-5 w-5 shrink-0" />
              Sair
            </button>
          </li>
        </ul>
      </div>
    </>
  )
}

/**
 * Moldura do sistema: menu fixo à esquerda no desktop, gaveta no celular, e a
 * barra do topo com notificações e conta.
 *
 * O menu é escuro e o conteúdo claro de propósito: separa "onde eu estou" de
 * "o que eu estou fazendo" sem precisar de linha divisória nem de cor de marca.
 */
export function AppShell() {
  const [isMenuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const hasSession = useSession()

  // Trocou de tela, fecha a gaveta: no celular ela cobre o conteúdo inteiro.
  useEffect(() => setMenuOpen(false), [location.pathname])

  if (!hasSession) return <LockScreen />

  return (
    <div className="min-h-dvh lg:flex">
      <a
        href="#conteudo"
        className="sr-only rounded-md bg-ink-950 px-4 py-2 text-cream focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50"
      >
        Ir para o conteúdo
      </a>

      <aside className="on-dark hidden w-60 shrink-0 flex-col gap-6 bg-ink-950 p-5 lg:sticky lg:top-0 lg:flex lg:h-dvh">
        <Brand />
        <SidebarContent />
      </aside>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-ink-950/60"
          />
          <div className="on-dark relative flex h-full w-72 max-w-[80%] flex-col gap-6 bg-ink-950 p-5">
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
            <SidebarContent onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMenu={() => setMenuOpen(true)} />

        <main id="conteudo" className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
