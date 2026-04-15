import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Gavel,
  User,
  Lock,
  Loader2,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";
import { login as loginApi } from "../../services/api";
import useAuthStore from "../../store/authStore";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await loginApi({ email: username, password });
      setAuth(data.token, data.user);
      toast.success("¡Bienvenido, administrador!");
      navigate("/backoffice");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error al iniciar sesión. Verifique sus credenciales.",
      );
      toast.error("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="p-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors text-sm font-medium"
        >
          <ChevronLeft size={16} /> Volver al sitio público
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 pb-24">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-16 h-16 bg-brand-500 rounded-3xl flex items-center justify-center shadow-lg shadow-brand-500/20 mb-5">
              <Gavel size={32} className="text-white -rotate-12" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 font-display">
              Panel de Control
            </h1>
            <p className="text-gray-500 mt-2">
              Iniciá sesión para gestionar el teleremate
            </p>
          </div>

          {/* Form */}
          <div className="card p-8 border border-gray-100 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm">
                  <AlertCircle size={18} /> {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Nombre de usuario
                </label>
                <div className="relative group">
                  <User
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Introduce tu usuario"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Contraseña
                </label>
                <div className="relative group">
                  <Lock
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors"
                  />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3.5 text-base shadow-lg shadow-brand-500/30"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  "Ingresar"
                )}
              </button>
            </form>

            <div className="mt-8 text-center border-t border-gray-50 pt-6">
              <p className="text-xs text-gray-400">
                Acceso restringido solo para personal autorizado.
                <br />
                Teleremate Uruguay © {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
