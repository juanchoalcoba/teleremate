import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Trash2, CheckCircle, Clock, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";
import {
  getPurchases,
  updatePurchaseStatus,
  deletePurchase,
} from "../../services/api";
import { getWALink, WAMessages } from "../../utils/whatsapp";

export default function PurchasesPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("pending");
  const limit = 10;
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["purchases", page, status],
    queryFn: () => getPurchases({ page, limit, status }),
  });

  const handleStatusChange = async (purchaseId, newStatus) => {
    try {
      await updatePurchaseStatus(purchaseId, { status: newStatus });
      toast.success(`Compra actualizada a ${newStatus}`);
      refetch();
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    } catch (error) {
      toast.error("Error al actualizar la compra", error);
    }
  };

  const handleDelete = async (purchaseId) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta compra?")) return;

    try {
      await deletePurchase(purchaseId);
      toast.success("Compra eliminada");
      refetch();
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    } catch (error) {
      toast.error("Error al eliminar la compra", error);
    }
  };

  const purchases = data?.data?.purchases || [];
  const pagination = data?.data?.pagination || { pages: 1 };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2">Gestión de Compras</h1>
        <p className="text-gray-600">Administra las compras de artículos</p>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => {
            setStatus("pending");
            setPage(1);
          }}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            status === "pending"
              ? "bg-green-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Clock size={16} className="inline mr-2" />
          Pendientes
        </button>
        <button
          onClick={() => {
            setStatus("processed");
            setPage(1);
          }}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            status === "processed"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <CheckCircle size={16} className="inline mr-2" />
          Procesadas
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Cargando compras...</div>
        ) : purchases.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No hay compras {status === "pending" ? "pendientes" : "procesadas"}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                      Artículo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                      Teléfono
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                      Entrega
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                      Dirección
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                      Fecha Solicitud
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {purchases.map((purchase) => (
                    <tr key={purchase._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {purchase.articleId?.lotNumber} -{" "}
                        {purchase.articleId?.title}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {purchase.fullName}
                      </td>
                      <td className="px-6 py-4">
                        <a 
                          href={getWALink(purchase.phone, WAMessages.purchaseFollowup(purchase.fullName, purchase.articleId?.lotNumber, purchase.articleId?.title))}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-bold text-gray-900 hover:text-green-500 flex items-center gap-1 transition-colors"
                        >
                          {purchase.phone}
                          <MessageCircle size={14} />
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            purchase.deliveryMethod === "pickup"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {purchase.deliveryMethod === "pickup"
                            ? "Retiro"
                            : "Envío"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {purchase.deliveryAddress || "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {new Date(purchase.createdAt).toLocaleDateString(
                          "es-UY"
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {status === "pending" && (
                            <button
                              onClick={() =>
                                handleStatusChange(purchase._id, "processed")
                              }
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-200 transition"
                            >
                              Marcar Procesada
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(purchase._id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200 transition flex items-center gap-1"
                          >
                            <Trash2 size={14} /> Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Página {pagination.page} de {pagination.totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="p-2 border rounded-lg disabled:opacity-50"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() =>
                      setPage(Math.min(pagination.totalPages, page + 1))
                    }
                    disabled={page === pagination.totalPages}
                    className="p-2 border rounded-lg disabled:opacity-50"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
