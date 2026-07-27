import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { buildNotifications } from '@/application/notifications'
import { useDeliveries, useOrders, useProducts } from '@/application/use-store'
import { useSettings } from '@/application/use-settings'
import { operatorInitials } from '@/domain/settings'
import { sessionStore } from '@/infra'
import { cn } from '@/lib/cn'
import { BellIcon, CheckIcon, LogoutIcon, MenuIcon, SettingsIcon } from '@/ui/components/icons'

/** Fecha o painel ao clicar fora ou apertar Esc, como todo menu suspenso. */
function useDismiss(onDismiss: () => void) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (ref.current !== null && !ref.current.contains(event.target as Node)) onDismiss()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onDismiss()
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onDismiss])

  return ref
}

const panelClass =
  'absolute right-0 top-full z-40 mt-2 w-72 rounded-xl border border-paper-line bg-paper p-2 shadow-xl'

function NotificationsMenu() {
  const [isOpen, setOpen] = useState(false)
  const products = useProducts()
  const orders = useOrders()
  const deliveries = useDeliveries()
  const notifications = buildNotifications(products, orders, deliveries)
  const ref = useDismiss(() => setOpen(false))

  const toneText: Record<string, string> = {
    negative: 'text-negative',
    attention: 'text-attention',
    info: 'text-info',
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-label={
          notifications.length === 0
            ? 'Notificações, nenhuma pendência'
            : `Notificações, ${notifications.length} pendências`
        }
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink-500 transition-colors hover:bg-paper-alt hover:text-ink-950"
      >
        <BellIcon className="h-5 w-5" />
        {notifications.length > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-negative px-1 text-[0.625rem] font-semibold text-cream">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={panelClass} role="dialog" aria-label="Notificações">
          <p className="px-3 py-2 text-xs font-medium tracking-wide text-ink-400 uppercase">
            Precisa de atenção
          </p>

          {notifications.length === 0 ? (
            <p className="flex items-center gap-2 px-3 py-4 text-sm text-ink-500">
              <CheckIcon className="h-4 w-4 text-positive" />
              Nada pendente por aqui.
            </p>
          ) : (
            <ul className="list-none">
              {notifications.map((notification) => (
                <li key={notification.id}>
                  <Link
                    to={notification.to}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-paper-alt"
                  >
                    <span
                      className={cn(
                        'block text-sm font-medium',
                        toneText[notification.tone] ?? 'text-ink-950',
                      )}
                    >
                      {notification.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-ink-500">{notification.detail}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

function UserMenu() {
  const [isOpen, setOpen] = useState(false)
  const settings = useSettings()
  const navigate = useNavigate()
  const ref = useDismiss(() => setOpen(false))

  const leave = () => {
    setOpen(false)
    sessionStore.set(false)
    navigate('/')
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-label={`Conta de ${settings.operatorName}`}
        className="inline-flex items-center gap-2 rounded-lg py-1 pr-2 pl-1 transition-colors hover:bg-paper-alt"
      >
        <span
          aria-hidden="true"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-950 text-xs font-semibold text-cream"
        >
          {operatorInitials(settings)}
        </span>
        <span className="hidden max-w-[10rem] truncate text-sm font-medium text-ink-950 sm:block">
          {settings.operatorName}
        </span>
      </button>

      {isOpen && (
        <div className={panelClass} role="dialog" aria-label="Conta">
          <div className="border-b border-paper-line px-3 py-2">
            <p className="truncate text-sm font-medium text-ink-950">{settings.operatorName}</p>
            <p className="truncate text-xs text-ink-500">{settings.storeName}</p>
          </div>

          <Link
            to="/configuracoes"
            onClick={() => setOpen(false)}
            className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-950 transition-colors hover:bg-paper-alt"
          >
            <SettingsIcon className="h-4 w-4 text-ink-400" />
            Configurações
          </Link>

          <button
            type="button"
            onClick={leave}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-ink-950 transition-colors hover:bg-paper-alt"
          >
            <LogoutIcon className="h-4 w-4 text-ink-400" />
            Sair
          </button>
        </div>
      )}
    </div>
  )
}

/**
 * Barra do topo: contexto à esquerda, ações da pessoa à direita.
 *
 * O sino e a conta ficam no mesmo canto em qualquer tamanho de tela, porque é
 * onde a mão procura por eles em qualquer sistema.
 */
export function Topbar({ onOpenMenu }: { readonly onOpenMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-paper-line bg-paper px-4 py-2.5 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Abrir menu"
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink-950 lg:hidden"
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      <div className="flex items-baseline gap-2 lg:hidden">
        <span className="text-base leading-none font-semibold tracking-tight">Space</span>
        <span className="text-[0.625rem] font-medium tracking-[0.25em] text-ink-400 uppercase">
          Gestão
        </span>
      </div>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <NotificationsMenu />
        <UserMenu />
      </div>
    </header>
  )
}
