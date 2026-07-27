import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/ui/layout/AppShell'
import DashboardPage from '@/ui/pages/DashboardPage'

/*
 * O painel entra no pacote inicial: é a tela de abertura e não pode esperar
 * um pedaço extra carregar. O resto vem sob demanda.
 */
const EstoquePage = lazy(() => import('@/ui/pages/EstoquePage'))
const PedidosPage = lazy(() => import('@/ui/pages/PedidosPage'))
const ClientesPage = lazy(() => import('@/ui/pages/ClientesPage'))
const EntregasPage = lazy(() => import('@/ui/pages/EntregasPage'))
const FinanceiroPage = lazy(() => import('@/ui/pages/FinanceiroPage'))
const ConfiguracoesPage = lazy(() => import('@/ui/pages/ConfiguracoesPage'))

function Loading() {
  return (
    <div className="space-y-4" role="status" aria-live="polite">
      <span className="sr-only">Carregando</span>
      <div className="h-8 w-48 animate-pulse rounded-lg bg-paper-line" />
      <div className="h-32 animate-pulse rounded-xl bg-paper-line" />
    </div>
  )
}

function Lazy({ children }: { readonly children: React.ReactNode }) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route
          path="estoque"
          element={
            <Lazy>
              <EstoquePage />
            </Lazy>
          }
        />
        <Route
          path="pedidos"
          element={
            <Lazy>
              <PedidosPage />
            </Lazy>
          }
        />
        <Route
          path="clientes"
          element={
            <Lazy>
              <ClientesPage />
            </Lazy>
          }
        />
        <Route
          path="entregas"
          element={
            <Lazy>
              <EntregasPage />
            </Lazy>
          }
        />
        <Route
          path="financeiro"
          element={
            <Lazy>
              <FinanceiroPage />
            </Lazy>
          }
        />
        <Route
          path="configuracoes"
          element={
            <Lazy>
              <ConfiguracoesPage />
            </Lazy>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
