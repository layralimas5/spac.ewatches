import { useSettings } from '@/application/use-settings'
import { sessionStore } from '@/infra'
import { Button } from '@/ui/components/Button'

/**
 * Tela de sessão encerrada.
 *
 * ⚠️ Isto não é autenticação. É uma trava de tela: evita que o sistema fique
 * aberto para quem passar pelo computador, e nada além disso. Quem souber
 * mexer no navegador entra. O login de verdade, com senha verificada no
 * servidor, entra junto com o Supabase, e é aqui que ele vai morar.
 */
export function LockScreen() {
  const settings = useSettings()

  return (
    <div className="on-dark flex min-h-dvh flex-col items-center justify-center bg-ink-950 px-6 text-center">
      <div className="flex items-baseline gap-2">
        <span className="text-2xl leading-none font-semibold tracking-tight text-cream">Space</span>
        <span className="text-xs font-medium tracking-[0.25em] text-muted uppercase">Gestão</span>
      </div>

      <h1 className="mt-8 text-xl font-semibold text-cream">Sessão encerrada</h1>

      <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
        O sistema está fechado neste navegador. Seus dados continuam salvos aqui, do jeito que
        estavam.
      </p>

      <Button
        className="mt-8 bg-paper text-ink-950 hover:bg-paper-alt"
        onClick={() => sessionStore.set(true)}
      >
        {`Entrar como ${settings.operatorName}`}
      </Button>

      <p className="mt-10 max-w-sm text-xs leading-relaxed text-ink-400">
        Esta tela é uma trava local, não uma senha. Enquanto o login no servidor não existir, não
        publique o sistema na internet.
      </p>
    </div>
  )
}
