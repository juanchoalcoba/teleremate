import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  MoreHorizontal,
  Package,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  getAdminArticles,
  deleteArticle,
  updateArticle,
} from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const STATUS_BADGES = {
  depot: "badge-depot",
  upcoming: "badge-upcoming",
  sold: "badge-sold",
};

const STATUS_LABELS = {
  depot: "En Depósito",
  upcoming: "Próximo Remate",
  sold: "Vendido",
};

export default function AdminArticlesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-articles", { search, page, status: statusFilter }],
    queryFn: () =>
      getAdminArticles({ search, page, status: statusFilter, limit: 10 }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-articles"]);
      toast.success("Artículo eliminado");
    },
    onError: () => toast.error("Error al eliminar artículo"),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateArticle(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-articles"]);
      toast.success("Estado actualizado");
    },
  });

  const handleDelete = (id) => {
    if (
      window.confirm(
        "¿Estás seguro de que querés eliminar este artículo? Esta acción no se puede deshacer.",
      )
    ) {
      deleteMutation.mutate(id);
    }
  };

  const articles = data?.data?.articles || [];
  const pagination = data?.data?.pagination || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-display">
            Inventario de Artículos
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Gestioná los lotes, subí imágenes y cambiá estados.
          </p>
        </div>
        <Link
          to="/backoffice/articulos/nuevo"
          className="btn-primary w-full sm:w-auto justify-center"
        >
          <Plus size={18} /> Nuevo Artículo
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Buscar por título o lote..."
            className="input pl-11 w-full"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="flex gap-2 sm:gap-4">
          <select
            className="input flex-1 sm:w-48"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Todos los estados</option>
            <option value="depot">En Depósito</option>
            <option value="upcoming">Próximo Remate</option>
            <option value="sold">Vendidos</option>
          </select>
          <button className="btn-secondary px-3 lg:hidden">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card bg-white border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Artículo
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Lote
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Categoría
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Precio Est.
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Estado
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="px-6 py-4">
                      <div className="h-12 bg-gray-50 rounded-xl"></div>
                    </td>
                  </tr>
                ))
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center text-gray-400">
                      <Package size={48} className="mb-4 opacity-20" />
                      <p className="font-semibold">
                        No se encontraron artículos
                      </p>
                      <Link
                        to="/backoffice/articulos/nuevo"
                        className="text-brand-600 hover:underline mt-2 text-sm"
                      >
                        Crear el primero
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                articles.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          <img
                            src={item.images?.[0]?.url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 group-hover:text-brand-600 transition-colors truncate max-w-[200px]">
                            {item.title}
                          </p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                            {item.condition}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">
                        {item.lotNumber}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      $ {item.estimatedPrice.toLocaleString("es-UY")}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        className={`text-xs font-bold px-2 py-1 rounded-full border-none cursor-pointer focus:ring-0 ${
                          item.status === "depot"
                            ? "bg-blue-100 text-blue-700"
                            : item.status === "upcoming"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-green-100 text-green-700"
                        }`}
                        value={item.status}
                        onChange={(e) =>
                          statusMutation.mutate({
                            id: item._id,
                            status: e.target.value,
                          })
                        }
                      >
                        <option value="depot">En Depósito</option>
                        <option value="upcoming">Próximo Remate</option>
                        <option value="sold">Vendido</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <Link
                          to={`/articulo/${item._id}`}
                          target="_blank"
                          className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                          title="Ver en el sitio"
                        >
                          <ExternalLink size={16} />
                        </Link>
                        <Link
                          to={`/backoffice/articulos/editar/${item._id}`}
                          className="p-2 text-gray-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="hidden md:block group-hover:hidden">
                        <MoreHorizontal
                          size={16}
                          className="text-gray-300 ml-auto"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 flex items-center justify-between border-t border-gray-100">
            <p className="text-xs text-gray-500 font-medium">
              Mostrando {articles.length} de {pagination.total} artículos
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-bold px-4">
                Página {page} de {pagination.totalPages}
              </span>
              <button
                disabled={page === pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
