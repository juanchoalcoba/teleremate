import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import SmoothScroll from "./components/common/SmoothScroll";
import DynamicCanonical from "./components/common/DynamicCanonical";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";

// Public Pages
import HomePage from "./pages/public/HomePage";
import CatalogPage from "./pages/public/CatalogPage";
import ArticleDetailPage from "./pages/public/ArticleDetailPage";
import SellPage from "./pages/public/SellPage";

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

// Auth
import useAuthStore from "./store/authStore";

// --------------------
// Query Client
// --------------------
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// --------------------
// Protected Route
// --------------------
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/backoffice/login" replace />;
  return children;
};

// --------------------
// SEO Controller (clave)
// --------------------
function SEOController() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/backoffice");

  // ❗ SOLO aplicar canonical a la app pública
  if (isAdmin) return null;

  return <DynamicCanonical />;
}

// --------------------
// Routes Component
// --------------------
function AppRoutes() {
  return (
    <>
      <SEOController />

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

          {/* Admin Protected */}
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
            <Route path="articulos/editar/:id" element={<ArticleFormPage />} />
            <Route path="reservas" element={<ReservationsPage />} />
            <Route path="compras" element={<PurchasesPage />} />
            <Route path="pedidos" element={<AdminSubmissionsPage />} />
            <Route path="anotaciones" element={<AdminAnnotationsPage />} />
            <Route path="domicilios" element={<AdminResidencesPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SmoothScroll>
    </>
  );
}

// --------------------
// Main App
// --------------------
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>

      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;