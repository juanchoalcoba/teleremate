import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Trash2, MessageCircle, ClipboardList, Database } from "lucide-react";
import toast from "react-hot-toast";
import { getAdminAnnotations, deleteAdminAnnotation } from "../../services/api";
import { getWALink, WAMessages } from "../../utils/whatsapp";

export default function AdminAnnotationsPage() {
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-annotations", page],
    queryFn: () => getAdminAnnotations({ page, limit }),
  });

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este registro?")) return;

    try {
      await deleteAdminAnnotation(id);
      toast.success("Registro eliminado correctamente");
      refetch();
    } catch {
      toast.error("Error al eliminar el registro");
    }
  };

  const annotations = data?.data?.annotations || [];
  const pagination = data?.data?.pagination || { totalPages: 1 };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-brand-500/10 text-brand-600 rounded-lg">
              <ClipboardList size={20} />
            </div>
            <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest px-2 py-0.5 bg-brand-50 rounded-full">
              CRM Admin
            </span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Interesados en Remates</h1>
          <p className="text-gray-500 mt-1 uppercase text-[10px] font-black tracking-widest">
            Gestión de clientes anotados para próximos remates
          </p>
        </div>
        
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
            <div className="px-4 py-2 flex items-center gap-2 border-r border-gray-100">
               <Database size={14} className="text-gray-400" />
               <span className="text-xs font-bold text-gray-700">{pagination.total || 0} Registros</span>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-20 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-500 border-t-transparent mb-4"></div>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Cargando anotaciones...</p>
          </div>
        ) : annotations.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center">
             <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-4">
                <ClipboardList size={32} />
             </div>
             <h3 className="text-lg font-bold text-gray-900">No hay interesados registrados</h3>
             <p className="text-gray-500 text-sm max-w-xs mx-auto">Cuando los clientes se anoten desde el catálogo, aparecerán aquí.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cliente</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contacto</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Artículo Interés</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Fecha Registro</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {annotations.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-5">
                        <span className="font-bold text-gray-900">{item.fullName}</span>
                      </td>
                      <td className="px-6 py-5">
                        <a 
                          href={getWALink(item.phone, WAMessages.annotationFollowup(item.fullName, item.articleId?.lotNumber, item.articleId?.title))}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 group/link"
                        >
                          <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-black tracking-tight group-hover/link:bg-green-500 group-hover/link:text-white transition-all">
                            {item.phone}
                          </span>
                          <MessageCircle size={14} className="text-green-500 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                        </a>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                           <span className="text-xs font-black text-brand-500 uppercase tracking-tight">Lote {item.articleId?.lotNumber || 'N/A'}</span>
                           <span className="text-sm font-bold text-gray-600 line-clamp-1">{item.articleId?.title || 'Artículo no encontrado'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs font-bold text-gray-400">
                          {new Date(item.createdAt).toLocaleDateString("es-UY", { 
                            day: '2-digit', 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Eliminar registro"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Página {page} de {pagination.totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 border-2 border-gray-200 rounded-xl disabled:opacity-30 hover:bg-white transition-all shadow-sm"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="p-2 border-2 border-gray-200 rounded-xl disabled:opacity-30 hover:bg-white transition-all shadow-sm"
                  >
                    <ChevronRight size={20} />
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
