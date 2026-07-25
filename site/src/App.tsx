import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '@/ui/layout/Layout'
import { ErrorBoundary } from '@/ui/components/ErrorBoundary'
import HomePage from '@/ui/pages/HomePage'

// A Home entra no bundle inicial — é a rota de entrada e não pode esperar um chunk.
// As outras carregam sob demanda.
const CatalogPage = lazy(() => import('@/ui/pages/CatalogPage'))
const WatchPage = lazy(() => import('@/ui/pages/WatchPage'))
const CustomImportPage = lazy(() => import('@/ui/pages/CustomImportPage'))
const NotFoundPage = lazy(() => import('@/ui/pages/NotFoundPage'))

function RouteFallback() {
  return (
    <div className="container-brand py-28" role="status" aria-live="polite">
      <span className="sr-only">Carregando página</span>
      <div className="mx-auto h-8 w-48 animate-pulse rounded bg-ink-900" />
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route
              path="catalogo"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <CatalogPage />
                </Suspense>
              }
            />
            <Route
              path="relogio/:id"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <WatchPage />
                </Suspense>
              }
            />
            <Route
              path="importacao"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <CustomImportPage />
                </Suspense>
              }
            />
            <Route
              path="*"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <NotFoundPage />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
