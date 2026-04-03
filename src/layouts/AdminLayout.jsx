import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Gavel,
  LayoutDashboard,
  Package,
  LogOut,
  ChevronRight,
  Menu,
  X,
  BookmarkCheck,
  ShoppingCart,
  ClipboardList,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import InstallAdminPWA from "../components/common/InstallAdminPWA";
import { messaging, getToken, VAPID_KEY, onMessage } from "../firebase";
import { toast } from "react-hot-toast";

const navItems = [
  { to: "/backoffice", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/backoffice/articulos", label: "Inventario", icon: Package },
  { to: "/backoffice/reservas", label: "Reservas", icon: BookmarkCheck },
  { to: "/backoffice/compras", label: "Compras", icon: ShoppingCart },
  { to: "/backoffice/pedidos", label: "Pedidos", icon: ClipboardList },
];

export default function AdminLayout() {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fcmToken, setFcmToken] = useState("");

  useEffect(() => {
    const requestNotificationPermission = async () => {
      if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
        return;
      }

      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const token = await getToken(messaging, { vapidKey: VAPID_KEY });
          if (token) {
            console.log("Token de notificaciones:", token);
            setFcmToken(token);
          } else {
            console.log("No registration token available.");
          }
        }
      } catch (error) {
        console.error("Error getting notification token:", error);
      }
    };

    requestNotificationPermission();

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);
      toast.success(payload.notification.title + ": " + payload.notification.body, {
        duration: 5000,
        position: 'top-right',
      });
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-50 overflow-x-hidden w-full">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-dark-900 flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-2">
          <Gavel size={20} className="text-brand-500" />
          <span className="text-white font-bold text-sm tracking-tight uppercase">
            Admin
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-white bg-dark-800 rounded-lg"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-dark-950/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 w-60 bg-dark-900 text-white z-50 transform transition-transform duration-300 lg:translate-x-0 flex flex-col
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="p-6 border-b border-dark-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
              <Gavel size={20} className="text-white -rotate-12" />
            </div>
            <div>
              <div className="font-black text-lg tracking-tight leading-none uppercase">
                Teleremate
              </div>
              <div className="text-[9px] text-gray-200 font-bold tracking-[0.2em] uppercase mt-1">
                Admin Panel
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all relative ${
                  isActive
                    ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                    : "text-gray-400 hover:bg-dark-800 hover:text-white"
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
              <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-dark-700 bg-dark-950/30">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center text-xs font-bold">
              {user?.email?.[0].toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{user?.email}</p>
              <p className="text-[10px] text-gray-500 truncate">
                Administrador
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all text-xs font-bold"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen pt-16 lg:pt-0 lg:pl-60 min-w-0 w-full overflow-x-hidden">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1700px] w-full mx-auto min-w-0 overflow-x-hidden">
          {fcmToken && (
            <div className="mb-8 p-6 bg-brand-50 border-2 border-brand-200 rounded-3xl shadow-sm animate-in fade-in slide-in-from-top-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center text-white">
                  <BookmarkCheck size={16} />
                </div>
                <h3 className="font-black text-xs uppercase tracking-[0.2em] text-brand-900">
                  Token de notificaciones (Admin)
                </h3>
              </div>
              <div className="relative group">
                <code className="block bg-white p-4 rounded-xl border border-brand-100 text-[10px] sm:text-xs font-mono text-brand-700 break-all shadow-inner">
                  {fcmToken}
                </code>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(fcmToken);
                    toast.success("Token copiado al portapapeles");
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-brand-600 transition-colors shadow-sm"
                >
                  COPIAR
                </button>
              </div>
              <p className="mt-3 text-[10px] text-brand-600 font-medium italic">
                * Copiá este token y pegalo en la variable OWNER_TOKEN de Railway para recibir notificaciones en este dispositivo.
              </p>
            </div>
          )}
          <Outlet />
        </main>
      </div>

      <InstallAdminPWA />
    </div>
  );
}
