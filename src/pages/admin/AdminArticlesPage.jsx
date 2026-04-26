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
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getImageUrl } from "../../utils/imageUtils";
import { getCurrencySymbol } from "../../utils/articleUtils";

const CATEGORY_LABELS = {
  deposito: "Venta Directa",
  remate: "A Rematar",
  inmueble: "Inmuebles",
  vehiculo: "Vehículos",
};

export default function AdminArticlesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("");

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-articles", { search, page, category: categoryFilter }],
    queryFn: () =>
      getAdminArticles({ search, page, category: categoryFilter, limit: 10 }),
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
    mutationFn: ({ id, status }) => {
      const payload = { status };
      if (status === "depot") payload.category = "deposito";
      if (status === "upcoming") payload.category = "remate";
      return updateArticle(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-articles"]);
      queryClient.invalidateQueries(["article"]);
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
            Gestioná los artículos, subí imágenes y cambiá estados.
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
            placeholder="Buscar por título o ID..."
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
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Todas las categorías</option>
            <option value="deposito">Venta Directa</option>
            <option value="remate">A Rematar</option>
            <option value="inmueble">Inmuebles</option>
            <option value="vehiculo">Vehículos</option>
          </select>
          <button className="btn-secondary px-3 lg:hidden">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card bg-white border border-gray-100 max-w-full mx-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-4 text-xs font-black text-gray-400 uppercase tracking-widest w-[30%]">
                  Artículo
                </th>
                <th className="px-4 py-4 text-xs font-black text-gray-400 uppercase tracking-widest w-[10%]">
                  LOTE
                </th>
                <th className="px-4 py-4 text-xs font-black text-gray-400 uppercase tracking-widest w-[10%]">
                  REF.
                </th>
                <th className="px-4 py-4 text-xs font-black text-gray-400 uppercase tracking-widest w-[15%]">
                  Categoría
                </th>
                <th className="px-4 py-4 text-xs font-black text-gray-400 uppercase tracking-widest w-[15%]">
                  Precio Est.
                </th>
                <th className="px-4 py-4 text-xs font-black text-gray-400 uppercase tracking-widest w-[15%]">
                  Estado
                </th>
                <th className="px-4 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right sticky right-0 bg-gray-50 z-10 w-[15%]">
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
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                          <img
                            src={getImageUrl(item.images?.[0]?.url)}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 text-sm truncate max-w-[250px]">
                            {item.title}
                          </p>
                          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">
                            {item.condition}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-black text-brand-600">
                        {item.auctionLot || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <code className="text-[10px] font-mono bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded text-gray-500">
                        {item.lotNumber}
                      </code>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-500">
                      {item.category}
                    </td>
                    <td className="px-4 py-4 text-xs font-black text-gray-900 whitespace-nowrap">
                      {getCurrencySymbol(item.currency, item.category)} {item.estimatedPrice?.toLocaleString("es-UY")}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="relative group/select w-fit">
                        <select
                          className={`appearance-none text-xs font-black uppercase tracking-widest pl-3 pr-8 py-2 rounded-full border-0 cursor-pointer focus:ring-2 focus:ring-offset-1 transition-all shadow-sm ${
                            {
                              depot: "bg-blue-50 text-blue-600",
                              upcoming: "bg-amber-50 text-amber-600",
                              reserved: "bg-orange-50 text-orange-600",
                              sold: "bg-red-50 text-red-600",
                            }[item.status] || "bg-gray-50 text-gray-600"
                          }`}
                          value={item.status}
                          onChange={(e) =>
                            statusMutation.mutate({
                              id: item._id,
                              status: e.target.value,
                            })
                          }
                        >
                          <option value="depot">VENTA DIRECTA</option>
                          <option value="upcoming">PRÓX. REMATE</option>
                          <option value="reserved">RESERVADO</option>
                          <option value="sold">VENDIDO</option>
                        </select>
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-50">
                          <MoreHorizontal size={14} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right sticky right-0 bg-white group-hover:bg-gray-50/50 transition-colors z-10 border-l border-gray-50/50">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/articulo/${item._id}`}
                          target="_blank"
                          className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                          title="Ver"
                        >
                          <ExternalLink size={14} />
                        </Link>
                        <Link
                          to={`/backoffice/articulos/editar/${item._id}`}
                          className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
                          title="Editar"
                        >
                          <Edit2 size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Borrar"
                        >
                          <Trash2 size={14} />
                        </button>
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
