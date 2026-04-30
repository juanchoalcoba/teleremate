import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster, toast } from "react-hot-toast";
import SmoothScroll from "./components/common/SmoothScroll";
import DynamicCanonical from "./components/common/DynamicCanonical";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";

// Public Pages
import HomePage from "./pages/public/HomePage";
import CatalogPage from "./pages/public/CatalogPage";
import ArticleDetailPage from "./pages/public/ArticleDetailPage";

// Admin Pages
import LoginPage from "./pages/admin/LoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import AdminArticlesPage from "./pages/admin/AdminArticlesPage";
import ArticleFormPage from "./pages/admin/ArticleFormPage";
import ReservationsPage from "./pages/admin/ReservationsPage";
import PurchasesPage from "./pages/admin/PurchasesPage";
import AdminSubmissionsPage from "./pages/admin/AdminSubmissionsPage";
import AdminAnnotationsPage from "./pages/admin/AdminAnnotationsPage";
import AdminResidencesPage from "./pages/admin/AdminResidencesPage";

// Features
import SellPage from "./pages/public/SellPage";

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
        </SmoothScroll>
      </BrowserRouter>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;
