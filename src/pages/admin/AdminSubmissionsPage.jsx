import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getAdminSubmissions, 
  getSubmissionById, 
  approveSubmission, 
  rejectSubmission 
} from "../../services/api";
import { 
  ClipboardList, 
  Check, 
  X, 
  Loader2, 
  User,
  Phone,
  Mail,
  ExternalLink,
  MessageCircle,
  Clock,
  ChevronRight,
  Maximize2,
  MapPin,
  AlertCircle
} from "lucide-react";
import { toast } from "react-hot-toast";
import { getWALink, WAMessages } from "../../utils/whatsapp";

const CATEGORIES = [
  { value: "deposito", label: "En Depósito" },
  { value: "remate", label: "A Rematar" },
  { value: "inmueble", label: "Inmuebles" },
  { value: "vehiculo", label: "Vehículos" },
];

export default function AdminSubmissionsPage() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [approvalData, setApprovalData] = useState({
    category: "deposito",
    auctionDate: "",
  });

  const { data: submissions, isLoading } = useQuery({
    queryKey: ["admin-submissions"],
    queryFn: getAdminSubmissions,
  });

  const { data: detail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["admin-submission", selectedId],
    queryFn: () => getSubmissionById(selectedId),
    enabled: !!selectedId,
  });

  const approveMutation = useMutation({
    mutationFn: (id) => approveSubmission(id, approvalData),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-submissions"]);
      queryClient.invalidateQueries(["admin-submission", selectedId]);
      queryClient.invalidateQueries(["admin-articles"]);
      toast.success("Pedido aprobado con éxito");
      setSelectedId(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Error al aprobar el pedido"),
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => rejectSubmission(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-submissions"]);
      queryClient.invalidateQueries(["admin-submission", selectedId]);
      toast.success("Pedido rechazado");
      setSelectedId(null);
    },
    onError: () => toast.error("Error al rechazar el pedido"),
  });

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      approved: "bg-green-100 text-green-700 border-green-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
    };
    const labels = {
      pending: "Pendiente",
      approved: "Aprobado",
      rejected: "Rechazado",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-100 flex items-center justify-center bg-dark-950/90 p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <button 
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors border border-white/20"
            onClick={() => setPreviewImage(null)}
          >
            <X size={24} />
          </button>
          <img 
            src={previewImage} 
            alt="Preview" 
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl animate-in zoom-in duration-300"
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">Pedidos de Venta</h1>
          <p className="text-gray-500 mt-1">Gestioná los artículos enviados por los usuarios para subastar.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Submissions List */}
        <div className={`xl:col-span-2 space-y-4 ${selectedId ? 'hidden xl:block' : ''}`}>
          <div className="card-admin overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Vendedor</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Artículo</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Precio Est.</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {submissions?.data?.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                        No hay pedidos de venta registrados aún.
                      </td>
                    </tr>
                  ) : (
                    submissions?.data?.map((sub) => (
                      <tr 
                        key={sub._id} 
                        className={`group hover:bg-brand-50/30 transition-colors cursor-pointer ${selectedId === sub._id ? 'bg-brand-50/50' : ''}`}
                        onClick={() => setSelectedId(sub._id)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900 text-sm">{sub.sellerName}</span>
                            <span className="text-xs text-gray-400">{sub.sellerPhone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-700 text-sm line-clamp-1">{sub.title}</span>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock size={10} className="text-gray-300" />
                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                              {new Date(sub.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-black text-gray-900 text-sm">${sub.estimatedPrice.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(sub.status)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-gray-400 group-hover:text-brand-500 transition-colors">
                            <ChevronRight size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Detail View */}
        <div className={`xl:col-span-1 space-y-6 ${!selectedId ? 'hidden xl:block' : ''}`}>
          {!selectedId ? (
            <div className="card-admin border-dashed bg-gray-50/30 flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-4">
                <ClipboardList size={32} className="text-gray-200" />
              </div>
              <h3 className="font-bold text-gray-400">Seleccioná un pedido</h3>
              <p className="text-xs text-gray-300 mt-1 max-w-[200px]">Hace click en un pedido de la lista para ver todos los detalles y procesarlo.</p>
            </div>
          ) : isLoadingDetail ? (
            <div className="card-admin p-12 flex justify-center">
              <Loader2 className="animate-spin text-brand-500" />
            </div>
          ) : (
            <div className="card-admin p-0 flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
              <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <h3 className="font-black text-gray-900 flex items-center gap-2">
                  Detalles del Pedido
                </h3>
                <button 
                  onClick={() => setSelectedId(null)}
                  className="p-1 px-2 text-xs font-bold bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-red-500 transition-colors xl:hidden"
                >
                  Cerrar
                </button>
              </div>
              
              <div className="flex-1 p-6 space-y-8 overflow-y-auto max-h-[80vh] custom-scrollbar">
                {/* Seller Info */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-brand-500 uppercase tracking-[0.2em]">Vendedor</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                        <User size={18} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Nombre</p>
                        <p className="text-sm font-bold text-gray-900">{detail.data.sellerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 group">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                        <Phone size={18} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Teléfono</p>
                        <a 
                          href={getWALink(detail.data.sellerPhone, WAMessages.sellerFollowup(detail.data.sellerName, detail.data.title))} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-sm font-bold text-gray-900 hover:text-green-500 flex items-center gap-1 transition-colors"
                        >
                          {detail.data.sellerPhone}
                          <MessageCircle size={14} />
                        </a>
                      </div>
                    </div>
                    {detail.data.sellerEmail && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                          <Mail size={18} className="text-gray-400" />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">Email</p>
                          <p className="text-sm font-bold text-gray-900">{detail.data.sellerEmail}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Article Info */}
                <div className="space-y-4 pt-4 border-t border-gray-50">
                  <h4 className="text-[10px] font-black text-brand-500 uppercase tracking-[0.2em]">Artículo</h4>
                  <div className="space-y-6">
                    <div>
                      <h5 className="text-lg font-bold text-gray-900 mb-1">{detail.data.title}</h5>
                      <p className="text-gray-500 text-sm leading-relaxed">{detail.data.description}</p>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Technical Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Precio Est.</p>
                          <p className="text-base font-black text-gray-900">${detail.data.estimatedPrice?.toLocaleString()}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Ubicación</p>
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-brand-500" />
                            <p className="text-sm font-bold text-gray-900 line-clamp-1">{detail.data.pickupLocation || "N/A"}</p>
                          </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 sm:col-span-2">
                          <p className="text-[10px] text-gray-400 font-bold uppercase mb-1 flex items-center gap-1">
                            <Clock size={12} /> Años de Uso
                          </p>
                          <p className="text-sm font-bold text-gray-900">{detail.data.usageYears || "No especificado"}</p>
                        </div>
                      </div>

                      {/* Prominent Condition Details */}
                      {detail.data.conditionDetails && (
                        <div className="p-5 bg-amber-50/50 border-2 border-amber-100 rounded-3xl shadow-sm">
                          <div className="flex items-center gap-2 mb-2 text-amber-700">
                            <AlertCircle size={16} />
                            <p className="text-[10px] font-black uppercase tracking-widest">Estado y Desperfectos</p>
                          </div>
                          <p className="text-sm font-semibold text-amber-900 leading-relaxed italic">
                            "{detail.data.conditionDetails}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div className="space-y-4 pt-4 border-t border-gray-50">
                  <h4 className="text-[10px] font-black text-brand-500 uppercase tracking-[0.2em]">Galería</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {detail.data.images.map((img, idx) => (
                      <div 
                        key={idx} 
                        className="aspect-square rounded-xl overflow-hidden bg-gray-100 group border border-gray-200 relative cursor-zoom-in"
                        onClick={() => setPreviewImage(img)}
                      >
                        <img 
                          src={img} 
                          alt="" 
                          className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                          <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              {detail.data.status === "pending" && (
                <div className="p-6 bg-white border-t border-gray-50 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Asignar Categoría</label>
                      <select
                        value={approvalData.category}
                        onChange={(e) => setApprovalData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-brand-500 transition-all"
                      >
                        {CATEGORIES.map(c => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                    {approvalData.category === "remate" && (
                      <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1 block">Fecha de Remate</label>
                        <input
                          type="date"
                          value={approvalData.auctionDate}
                          onChange={(e) => setApprovalData(prev => ({ ...prev, auctionDate: e.target.value }))}
                          required
                          className="w-full px-3 py-2 bg-amber-50/30 border border-amber-100 rounded-xl text-sm font-bold outline-none focus:border-amber-500 transition-all"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => rejectMutation.mutate(detail.data._id)}
                      disabled={rejectMutation.isLoading || approveMutation.isLoading}
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-500 rounded-xl font-bold text-sm transition-all"
                    >
                      {rejectMutation.isLoading ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
                      Rechazar
                    </button>
                    <button
                      onClick={() => {
                        if (approvalData.category === "remate" && !approvalData.auctionDate) {
                          toast.error("Por favor, selecciona una fecha para el remate");
                          return;
                        }
                        approveMutation.mutate(detail.data._id);
                      }}
                      disabled={rejectMutation.isLoading || approveMutation.isLoading}
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-brand-500 text-white hover:bg-brand-600 rounded-xl font-black text-sm transition-all shadow-lg shadow-brand-500/20"
                    >
                      {approveMutation.isLoading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                      Aprobar
                    </button>
                  </div>
                </div>
              )}

              {detail.data.status === "approved" && detail.data.approvedArticleId && (
                <div className="p-6 bg-green-50/30 border-t border-green-100">
                  <a
                    href={`/backoffice/articulos/editar/${detail.data.approvedArticleId}`}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-white text-green-600 border border-green-100 rounded-xl font-bold text-sm hover:shadow-md transition-all"
                  >
                    Ver artículo creado <ExternalLink size={16} />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
