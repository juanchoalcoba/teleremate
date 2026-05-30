import { useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster, toast } from "react-hot-toast";
import SmoothScroll from "./components/common/SmoothScroll";
import DynamicCanonical from "./components/common/DynamicCanonical";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";

// Public Pages
const HomePage = lazy(() => import("./pages/public/HomePage"));
const CatalogPage = lazy(() => import("./pages/public/CatalogPage"));
const ArticleDetailPage = lazy(() => import("./pages/public/ArticleDetailPage"));

// Admin Pages
const LoginPage = lazy(() => import("./pages/admin/LoginPage"));
const DashboardPage = lazy(() => import("./pages/admin/DashboardPage"));
const AdminArticlesPage = lazy(() => import("./pages/admin/AdminArticlesPage"));
const ArticleFormPage = lazy(() => import("./pages/admin/ArticleFormPage"));
const ReservationsPage = lazy(() => import("./pages/admin/ReservationsPage"));
const PurchasesPage = lazy(() => import("./pages/admin/PurchasesPage"));
const AdminSubmissionsPage = lazy(() => import("./pages/admin/AdminSubmissionsPage"));
const AdminAnnotationsPage = lazy(() => import("./pages/admin/AdminAnnotationsPage"));
const AdminResidencesPage = lazy(() => import("./pages/admin/AdminResidencesPage"));

// Features
const SellPage = lazy(() => import("./pages/public/SellPage"));

// Auth Guard
import useAuthStore from "./store/authStore";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/backoffice/login" replace />;
  return children;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (refreshing) return;
        refreshing = true;

        const isForm =
          window.location.pathname.includes("/articulos/nuevo") ||
          window.location.pathname.includes("/articulos/editar");

        if (isForm) {
          toast(
            (t) => (
              <div className="flex flex-col gap-2">
                <span className="font-bold text-sm">Nueva versión disponible</span>
                <span className="text-xs">
                  Guarde sus cambios y recargue la página.
                </span>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-brand-500 text-white px-3 py-2 rounded-xl text-xs mt-2 font-bold transition-all hover:bg-brand-600 shadow-sm"
                >
                  Recargar ahora
                </button>
              </div>
            ),
            { duration: Infinity, style: { border: "1px solid #10B981" } }
          );
        } else {
          toast.success("Nueva versión detectada. Actualizando...", {
            duration: 3000,
          });
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <DynamicCanonical />
        <SmoothScroll>
          <Suspense fallback={
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          }>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicLayout />}>
                <Route index element={<HomePage />} />
                <Route path="catalogo" element={<CatalogPage />} />
                <Route path="articulo/:id" element={<ArticleDetailPage />} />
                <Route path="vender" element={<SellPage />} />
              </Route>

              {/* Admin Auth */}
              <Route path="/backoffice/login" element={<LoginPage />} />

              {/* Admin Routes */}
              <Route
                path="/backoffice"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="articulos" element={<AdminArticlesPage />} />
                <Route path="articulos/nuevo" element={<ArticleFormPage />} />
                <Route
                  path="articulos/editar/:id"
                  element={<ArticleFormPage />}
                />
                <Route path="reservas" element={<ReservationsPage />} />
                <Route path="compras" element={<PurchasesPage />} />
                <Route path="pedidos" element={<AdminSubmissionsPage />} />
                <Route path="anotaciones" element={<AdminAnnotationsPage />} />
                <Route path="domicilios" element={<AdminResidencesPage />} />
              </Route>

              {/* 404 Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </SmoothScroll>
      </BrowserRouter>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;
