import { lazy, Suspense, type ReactNode } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '@/ui/layout/Layout'
import { ErrorBoundary } from '@/ui/components/ErrorBoundary'
import { CartProvider } from '@/application/CartProvider'
import HomePage from '@/ui/pages/HomePage'

// A Home entra no bundle inicial — é a rota de entrada e não pode esperar um chunk.
// As outras carregam sob demanda.
const CatalogPage = lazy(() => import('@/ui/pages/CatalogPage'))
const WatchPage = lazy(() => import('@/ui/pages/WatchPage'))
const CustomImportPage = lazy(() => import('@/ui/pages/CustomImportPage'))
const CheckoutPage = lazy(() => import('@/ui/pages/CheckoutPage'))
const OrderConfirmationPage = lazy(() => import('@/ui/pages/OrderConfirmationPage'))
const NotFoundPage = lazy(() => import('@/ui/pages/NotFoundPage'))

function RouteFallback() {
  return (
    <div className="container-brand py-28" role="status" aria-live="polite">
      <span className="sr-only">Carregando página</span>
      <div className="mx-auto h-8 w-48 animate-pulse rounded bg-paper-alt" />
    </div>
  )
}

/** Evita repetir o mesmo `<Suspense>` em cada rota preguiçosa. */
function Lazy({ children }: { readonly children: ReactNode }) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <CartProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route
                path="catalogo"
                element={
                  <Lazy>
                    <CatalogPage />
                  </Lazy>
                }
              />
              <Route
                path="relogio/:id"
                element={
                  <Lazy>
                    <WatchPage />
                  </Lazy>
                }
              />
              <Route
                path="importacao"
                element={
                  <Lazy>
                    <CustomImportPage />
                  </Lazy>
                }
              />
              <Route
                path="checkout"
                element={
                  <Lazy>
                    <CheckoutPage />
                  </Lazy>
                }
              />
              <Route
                path="pedido/:code"
                element={
                  <Lazy>
                    <OrderConfirmationPage />
                  </Lazy>
                }
              />
              <Route
                path="*"
                element={
                  <Lazy>
                    <NotFoundPage />
                  </Lazy>
                }
              />
            </Route>
          </Routes>
        </CartProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
