import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Trash2, CheckCircle, Clock, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";
import { getReservations, updateReservationStatus, deleteReservation } from "../../services/api";
import { getWALink, WAMessages } from "../../utils/whatsapp";

export default function ReservationsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("pending");
  const limit = 10;
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["reservations", page, status],
    queryFn: () => getReservations({ page, limit, status }),
  });

  const handleStatusChange = async (reservationId, newStatus) => {
    try {
      await updateReservationStatus(reservationId, { status: newStatus });
      toast.success(`Reserva actualizada a ${newStatus}`);
      refetch();
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    } catch (error) {
      toast.error("Error al actualizar la reserva", error);
    }
  };

  const handleDelete = async (reservationId) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta reserva?")) return;

    try {
      await deleteReservation(reservationId);
      toast.success("Reserva eliminada");
      refetch();
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    } catch (error) {
      toast.error("Error al eliminar la reserva", error);
    }
  };

  const reservations = data?.data?.reservations || [];
  const pagination = data?.data?.pagination || { pages: 1 };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2">Gestión de Reservas</h1>
        <p className="text-gray-600">Administra las reservas de artículos</p>
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
              ? "bg-brand-500 text-white"
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
              ? "bg-green-500 text-white"
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
          <div className="p-8 text-center text-gray-500">Cargando reservas...</div>
        ) : reservations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No hay reservas {status === "pending" ? "pendientes" : "procesadas"}
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
                      Reservado Hasta
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
                  {reservations.map((reservation) => (
                    <tr key={reservation._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {reservation.articleId?.lotNumber} -{" "}
                        {reservation.articleId?.title}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {reservation.fullName}
                      </td>
                      <td className="px-6 py-4">
                        <a 
                          href={getWALink(reservation.phone, WAMessages.reservationFollowup(reservation.fullName, reservation.articleId?.lotNumber, reservation.articleId?.title))}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-bold text-gray-900 hover:text-green-500 flex items-center gap-1 transition-colors"
                        >
                          {reservation.phone}
                          <MessageCircle size={14} />
                        </a>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {new Date(reservation.reservedUntil).toLocaleDateString(
                          "es-UY"
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {new Date(reservation.createdAt).toLocaleDateString(
                          "es-UY"
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {status === "pending" && (
                            <button
                              onClick={() =>
                                handleStatusChange(reservation._id, "processed")
                              }
                              className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-semibold hover:bg-green-200 transition"
                            >
                              Marcar Procesada
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(reservation._id)}
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
