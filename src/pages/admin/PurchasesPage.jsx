import { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  CheckCircle,
  Clock,
  MessageCircle,
  RefreshCw,
  Search,
  X,
  Eye,
  Truck,
  Building2,
  CreditCard,
  Package,
  DollarSign,
  MapPin,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getPurchases,
  updatePurchaseStatus,
  deletePurchase,
  verifyPurchaseMP,
} from "../../services/api";
import { getWALink, WAMessages } from "../../utils/whatsapp";
import { getImageUrl } from "../../utils/imageUtils";

// Utility: Helper to calculate base price, 20% Teleremate commission, 6% MP commission, and total price
const getPurchasePriceDetails = (purchase) => {
  const article = purchase?.articleId || {};
  const basePrice = Number(purchase?.price) || Number(article.salePrice) || Number(article.estimatedPrice) || 0;
  const teleremateCommission = Math.round(basePrice * 0.20);
  const subtotalWithTeleremate = basePrice + teleremateCommission;

  const isMP = purchase?.paymentMethod === "mercadopago";
  const mpCommissionAmount = isMP ? Math.round(basePrice * 0.06) : 0;
  const totalPrice = isMP ? Math.round(basePrice * 1.26) : subtotalWithTeleremate;
  const currencySymbol = article.currency === "USD" ? "US$" : "$";

  return {
    basePrice,
    teleremateCommission,
    subtotalWithTeleremate,
    isMP,
    mpCommissionAmount,
    totalPrice,
    currencySymbol,
  };
};

export default function PurchasesPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [deliveryFilter, setDeliveryFilter] = useState("all");
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [verifyingId, setVerifyingId] = useState(null);

  const limit = 15;
  const queryClient = useQueryClient();

  // Lock body background scroll when modal is open
  useEffect(() => {
    if (selectedPurchase) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedPurchase]);

  // API Call - Fetch Purchases
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["purchases", page, status],
    queryFn: () => getPurchases({ page, limit, status }),
  });

  const handleVerifyMP = async (purchaseId) => {
    setVerifyingId(purchaseId);
    try {
      const res = await verifyPurchaseMP(purchaseId);
      if (res.data?.paymentStatus === "approved") {
        toast.success("¡Pago de MercadoPago verificado y APROBADO!");
      } else {
        toast.info(res.data?.message || "Pago aún en estado pendiente en MercadoPago");
      }
      refetch();
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al verificar pago con MercadoPago");
    } finally {
      setVerifyingId(null);
    }
  };

  const handleStatusChange = async (purchaseId, newStatus) => {
    try {
      await updatePurchaseStatus(purchaseId, { status: newStatus });
      toast.success(`Compra actualizada a ${newStatus === "processed" ? "Procesada" : "Pendiente"}`);
      if (selectedPurchase?._id === purchaseId) {
        setSelectedPurchase(null);
      }
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
      toast.success("Compra eliminada correctamente");
      if (selectedPurchase?._id === purchaseId) {
        setSelectedPurchase(null);
      }
      refetch();
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    } catch (error) {
      toast.error("Error al eliminar la compra", error);
    }
  };

  const rawPurchases = data?.data?.purchases || [];
  const pagination = data?.data?.pagination || { pages: 1, total: 0 };

  // Advanced Client Filtering & Search
  const filteredPurchases = useMemo(() => {
    return rawPurchases.filter((p) => {
      // 1. Search Query
      const query = searchTerm.toLowerCase().trim();
      if (query) {
        const fullName = (p.fullName || "").toLowerCase();
        const phone = (p.phone || "").toLowerCase();
        const address = (p.deliveryAddress || "").toLowerCase();
        const lotNumber = (p.articleId?.lotNumber || "").toString().toLowerCase();
        const articleTitle = (p.articleId?.title || "").toLowerCase();

        const matchesSearch =
          fullName.includes(query) ||
          phone.includes(query) ||
          address.includes(query) ||
          lotNumber.includes(query) ||
          articleTitle.includes(query);

        if (!matchesSearch) return false;
      }

      // 2. Payment Method Filter
      if (paymentFilter === "mp_approved") {
        if (p.paymentMethod !== "mercadopago" || p.paymentStatus !== "approved") return false;
      } else if (paymentFilter === "mp_pending") {
        if (p.paymentMethod !== "mercadopago" || p.paymentStatus === "approved") return false;
      } else if (paymentFilter === "deposit") {
        if (p.paymentMethod === "mercadopago") return false;
      }

      // 3. Delivery Method Filter
      if (deliveryFilter === "shipping" && p.deliveryMethod === "pickup") return false;
      if (deliveryFilter === "pickup" && p.deliveryMethod !== "pickup") return false;

      return true;
    });
  }, [rawPurchases, searchTerm, paymentFilter, deliveryFilter]);

  // Executive Metrics Calculations (Including Base Price + 6% MP Commission)
  const metrics = useMemo(() => {
    const total = rawPurchases.length;
    const mpApproved = rawPurchases.filter(
      (p) => p.paymentMethod === "mercadopago" && p.paymentStatus === "approved"
    ).length;
    const shipping = rawPurchases.filter((p) => p.deliveryMethod !== "pickup").length;
    const totalAmount = rawPurchases.reduce((acc, p) => {
      const priceDetails = getPurchasePriceDetails(p);
      return acc + priceDetails.totalPrice;
    }, 0);

    return { total, mpApproved, shipping, totalAmount };
  }, [rawPurchases]);

  const selectedPriceDetails = selectedPurchase ? getPurchasePriceDetails(selectedPurchase) : null;

  return (
    <div className="space-y-6 pb-12">
      {/* ── TITULO DE LA SECCIÓN ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Gestión de Compras
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
              Backoffice
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Administra órdenes, verifica pagos de MercadoPago y coordina entregas.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-sm transition cursor-pointer"
        >
          <RefreshCw size={15} className={isLoading ? "animate-spin text-[#9a7b38]" : ""} />
          <span>Actualizar</span>
        </button>
      </div>

      {/* ── TARJETAS DE MÉTRICAS EJECUTIVAS (KPIs) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total en Lista */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-[#9a7b38] rounded-xl shrink-0">
            <Package size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Órdenes {status === "pending" ? "Pendientes" : "Procesadas"}</p>
            <h3 className="text-2xl font-black text-gray-900 mt-0.5">{metrics.total}</h3>
          </div>
        </div>

        {/* KPI 2: MP Aprobados */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">MP Aprobados</p>
            <h3 className="text-2xl font-black text-gray-900 mt-0.5">{metrics.mpApproved}</h3>
          </div>
        </div>

        {/* KPI 3: Envíos Pendientes */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
            <Truck size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Envíos a Domicilio</p>
            <h3 className="text-2xl font-black text-gray-900 mt-0.5">{metrics.shipping}</h3>
          </div>
        </div>

        {/* KPI 4: Monto Total acumulado */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl shrink-0">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Valor Listado</p>
            <h3 className="text-2xl font-black text-gray-900 mt-0.5">
              ${metrics.totalAmount.toLocaleString("es-UY")}
            </h3>
          </div>
        </div>
      </div>

      {/* ── BARRA DE CONTROLES: TABS, BUSCADOR Y FILTROS ── */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Tabs de Estado */}
          <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl shrink-0">
            <button
              onClick={() => {
                setStatus("pending");
                setPage(1);
              }}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-sm transition-all cursor-pointer ${
                status === "pending"
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Clock size={16} className={status === "pending" ? "text-amber-600" : ""} />
              <span>Pendientes</span>
            </button>

            <button
              onClick={() => {
                setStatus("processed");
                setPage(1);
              }}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-sm transition-all cursor-pointer ${
                status === "processed"
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <CheckCircle size={16} className={status === "processed" ? "text-emerald-600" : ""} />
              <span>Procesadas</span>
            </button>
          </div>

          {/* Buscador + Filtros */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* Buscador */}
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar cliente, lote..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9a7b38]/30 transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filtro MercadoPago */}
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:bg-white focus:outline-none transition cursor-pointer"
            >
              <option value="all">Pago: Todos</option>
              <option value="mp_approved">MP Aprobado</option>
              <option value="mp_pending">MP Pendiente</option>
              <option value="deposit">Depósito / Transferencia</option>
            </select>

            {/* Filtro Entrega */}
            <select
              value={deliveryFilter}
              onChange={(e) => setDeliveryFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:bg-white focus:outline-none transition cursor-pointer"
            >
              <option value="all">Entrega: Todos</option>
              <option value="shipping">Envío a Domicilio</option>
              <option value="pickup">Retiro en Local</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── TABLA EJECUTIVA REDISEÑADA Y LIMPIA ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500 font-medium">
            <RefreshCw size={24} className="animate-spin mx-auto text-[#9a7b38] mb-2" />
            Cargando compras...
          </div>
        ) : filteredPurchases.length === 0 ? (
          <div className="p-12 text-center text-gray-500 font-medium">
            <Package size={36} className="mx-auto text-gray-300 mb-2" />
            No se encontraron compras {status === "pending" ? "pendientes" : "procesadas"}
            {searchTerm && ` que coincidan con "${searchTerm}"`}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="px-5 py-3.5">Artículo & Lote</th>
                    <th className="px-5 py-3.5">Comprador</th>
                    <th className="px-5 py-3.5">Estado de Pago</th>
                    <th className="px-5 py-3.5">Precio & Comisión</th>
                    <th className="px-5 py-3.5">Entrega</th>
                    <th className="px-5 py-3.5">Fecha</th>
                    <th className="px-5 py-3.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredPurchases.map((purchase) => {
                    const article = purchase.articleId || {};
                    const isMPApproved = purchase.paymentMethod === "mercadopago" && purchase.paymentStatus === "approved";
                    const isMPPending = purchase.paymentMethod === "mercadopago" && purchase.paymentStatus !== "approved";
                    const priceDetails = getPurchasePriceDetails(purchase);

                    return (
                      <tr key={purchase._id} className="hover:bg-amber-50/20 transition-colors">
                        
                        {/* COLUMNA: Artículo & Lote */}
                        <td className="px-5 py-4 max-w-xs">
                          <div className="flex items-center gap-3">
                            {article.images?.[0] ? (
                              <img
                                src={getImageUrl(article.images[0])}
                                alt={article.title || "Artículo"}
                                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-200"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200">
                                <Package size={20} className="text-gray-400" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-black bg-amber-100 text-amber-900 border border-amber-200 mb-1">
                                LOTE #{article.lotNumber || "-"}
                              </span>
                              <h4 className="font-bold text-gray-900 text-xs sm:text-sm line-clamp-1" title={article.title}>
                                {article.title || "Artículo no disponible"}
                              </h4>
                            </div>
                          </div>
                        </td>

                        {/* COLUMNA: Comprador & WhatsApp Directo */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900">{purchase.fullName}</span>
                            <a
                              href={getWALink(
                                purchase.phone,
                                WAMessages.purchaseFollowup(purchase.fullName, article.lotNumber, article.title)
                              )}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 transition-colors w-fit mt-1"
                              title="Abrir chat directo en WhatsApp"
                            >
                              <MessageCircle size={12} />
                              <span>{purchase.phone}</span>
                            </a>
                          </div>
                        </td>

                        {/* COLUMNA: Estado de Pago */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col items-start gap-1.5">
                            {isMPApproved && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <CheckCircle size={12} /> MP Aprobado
                              </span>
                            )}

                            {isMPPending && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-200">
                                <Clock size={12} /> MP Pendiente
                              </span>
                            )}

                            {purchase.paymentMethod !== "mercadopago" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-800 border border-blue-200">
                                <CreditCard size={12} /> Depósito / Efectivo
                              </span>
                            )}

                            {/* Botón Verificar MP */}
                            {isMPPending && (
                              <button
                                onClick={() => handleVerifyMP(purchase._id)}
                                disabled={verifyingId === purchase._id}
                                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-2xs"
                                title="Consultar a MercadoPago para re-verificar el estado real del pago"
                              >
                                <RefreshCw size={11} className={verifyingId === purchase._id ? "animate-spin" : ""} />
                                <span>{verifyingId === purchase._id ? "Verificando..." : "Verificar MP"}</span>
                              </button>
                            )}

                            {purchase.paymentId && (
                              <span className="text-[11px] text-gray-500 font-mono">
                                ID: {purchase.paymentId}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* COLUMNA: Precio & Comisión */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col items-start">
                            <span className="font-black text-gray-900 text-sm">
                              {priceDetails.currencySymbol} {priceDetails.totalPrice.toLocaleString("es-UY")}
                            </span>
                            {priceDetails.isMP ? (
                              <span className="text-[11px] font-bold text-[#9a7b38] bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 mt-0.5">
                                Base {priceDetails.currencySymbol}{priceDetails.basePrice.toLocaleString("es-UY")} + 20% Tele + 6% MP
                              </span>
                            ) : (
                              <span className="text-[11px] font-bold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 mt-0.5">
                                Base {priceDetails.currencySymbol}{priceDetails.basePrice.toLocaleString("es-UY")} + 20% Tele
                              </span>
                            )}
                          </div>
                        </td>

                        {/* COLUMNA: Entrega & Dirección Acotada */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col items-start gap-1">
                            {purchase.deliveryMethod !== "pickup" ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-orange-100 text-orange-800 border border-orange-200">
                                <Truck size={12} /> Envío
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-800 border border-blue-200">
                                <Building2 size={12} /> Retiro
                              </span>
                            )}

                            {purchase.deliveryAddress ? (
                              <span
                                className="text-xs text-gray-600 line-clamp-1 max-w-[180px] font-medium"
                                title={purchase.deliveryAddress}
                              >
                                {purchase.deliveryAddress}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400 italic">Sin dirección</span>
                            )}
                          </div>
                        </td>

                        {/* COLUMNA: Fecha */}
                        <td className="px-5 py-4 text-xs font-bold text-gray-600">
                          {new Date(purchase.createdAt).toLocaleDateString("es-UY")}
                        </td>

                        {/* COLUMNA: Acciones */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Botón Ver Detalle */}
                            <button
                              onClick={() => setSelectedPurchase(purchase)}
                              className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition cursor-pointer"
                              title="Ver detalle completo del comprador"
                            >
                              <Eye size={15} />
                            </button>

                            {/* Botón Cambiar Estado */}
                            {status === "pending" ? (
                              <button
                                onClick={() => handleStatusChange(purchase._id, "processed")}
                                className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1"
                              >
                                <CheckCircle size={13} />
                                <span className="hidden sm:inline">Procesar</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleStatusChange(purchase._id, "pending")}
                                className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1"
                              >
                                <Clock size={13} />
                                <span className="hidden sm:inline">Revertir</span>
                              </button>
                            )}

                            {/* Botón Eliminar */}
                            <button
                              onClick={() => handleDelete(purchase._id)}
                              className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition cursor-pointer border border-red-100"
                              title="Eliminar compra"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {pagination.pages > 1 && (
              <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs font-bold text-gray-500">
                  Página {pagination.page} de {pagination.pages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="p-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                    disabled={page === pagination.pages}
                    className="p-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── MODAL DE DETALLE COMPLETO DEL COMPRADOR ── */}
      {selectedPurchase && selectedPriceDetails && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fadeIn"
          onClick={() => setSelectedPurchase(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl relative border border-gray-100 max-h-[85vh] flex flex-col my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal (Fijo Arriba) */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-[#9a7b38]" />
                <h3 className="text-lg font-black text-gray-900 tracking-tight">
                  Detalle Completo de la Compra
                </h3>
              </div>
              <button
                onClick={() => setSelectedPurchase(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Cuerpo del Modal con Scrollbar Vertical Interno Propio */}
            <div className="overflow-y-auto py-3 space-y-4 flex-1 pr-1">
              {/* Ficha del Artículo */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                {selectedPurchase.articleId?.images?.[0] ? (
                  <img
                    src={getImageUrl(selectedPurchase.articleId.images[0])}
                    alt={selectedPurchase.articleId.title}
                    className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gray-200 flex items-center justify-center text-gray-400">
                    <Package size={24} />
                  </div>
                )}
                <div>
                  <span className="px-2 py-0.5 rounded-md text-xs font-black bg-amber-100 text-amber-900 border border-amber-200">
                    LOTE #{selectedPurchase.articleId?.lotNumber || "-"}
                  </span>
                  <h4 className="font-bold text-gray-900 text-base mt-1">
                    {selectedPurchase.articleId?.title || "Sin título"}
                  </h4>
                  <p className="text-xs text-gray-500 font-medium">
                    Fecha de solicitud: {new Date(selectedPurchase.createdAt).toLocaleDateString("es-UY")}
                  </p>
                </div>
              </div>

              {/* Desglose Financiero Completo */}
              <div className="p-4 bg-[#9a7b38]/5 rounded-2xl border border-[#9a7b38]/20 space-y-2">
                <span className="text-xs font-bold text-[#9a7b38] uppercase tracking-wider block">
                  Desglose Financiero Completo
                </span>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 font-medium">Precio Base Artículo (Vendedor):</span>
                  <span className="font-bold text-gray-900">
                    {selectedPriceDetails.currencySymbol} {selectedPriceDetails.basePrice.toLocaleString("es-UY")}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm text-amber-900">
                  <span className="font-medium">Comisión Teleremate (20%):</span>
                  <span className="font-bold">
                    +{selectedPriceDetails.currencySymbol} {selectedPriceDetails.teleremateCommission.toLocaleString("es-UY")}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500 pt-1 border-t border-amber-200/50">
                  <span className="font-medium">Subtotal (Base + Teleremate):</span>
                  <span className="font-bold text-gray-700">
                    {selectedPriceDetails.currencySymbol} {selectedPriceDetails.subtotalWithTeleremate.toLocaleString("es-UY")}
                  </span>
                </div>

                {selectedPriceDetails.isMP && (
                  <div className="flex justify-between items-center text-sm text-[#9a7b38]">
                    <span className="font-medium">Comisión MercadoPago (6%):</span>
                    <span className="font-bold">
                      +{selectedPriceDetails.currencySymbol} {selectedPriceDetails.mpCommissionAmount.toLocaleString("es-UY")}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center text-base pt-2 border-t border-[#9a7b38]/30">
                  <span className="font-black text-gray-900">TOTAL FINAL IMPORTE:</span>
                  <span className="font-black text-emerald-700 text-lg">
                    {selectedPriceDetails.currencySymbol} {selectedPriceDetails.totalPrice.toLocaleString("es-UY")}
                  </span>
                </div>
              </div>

              {/* Datos del Cliente y Envío */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-white rounded-2xl border border-gray-100 space-y-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Comprador</span>
                  <p className="font-black text-gray-900 text-base">{selectedPurchase.fullName}</p>
                  <a
                    href={getWALink(
                      selectedPurchase.phone,
                      WAMessages.purchaseFollowup(
                        selectedPurchase.fullName,
                        selectedPurchase.articleId?.lotNumber,
                        selectedPurchase.articleId?.title
                      )
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 mt-2 transition"
                  >
                    <MessageCircle size={14} />
                    <span>Enviar WhatsApp ({selectedPurchase.phone})</span>
                  </a>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-gray-100 space-y-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Método de Pago</span>
                  <p className="font-bold text-gray-900">
                    {selectedPurchase.paymentMethod === "mercadopago" ? "MercadoPago" : "Depósito / Transferencia"}
                  </p>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-black mt-1 ${
                      selectedPurchase.paymentStatus === "approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {selectedPurchase.paymentStatus === "approved" ? "Pago Aprobado" : "Pendiente de Pago"}
                  </span>
                </div>
              </div>

              {/* Dirección de Entrega */}
              <div className="p-4 bg-amber-50/40 rounded-2xl border border-amber-100/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                    <MapPin size={14} className="text-[#9a7b38]" />
                    Dirección de Entrega ({selectedPurchase.deliveryMethod !== "pickup" ? "Envío" : "Retiro"})
                  </span>
                  {selectedPurchase.deliveryAddress && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPurchase.deliveryAddress)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-[#9a7b38] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Ver en Maps</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-900 leading-relaxed">
                  {selectedPurchase.deliveryAddress || "El cliente seleccionó retiro en sucursal o no especificó dirección."}
                </p>
              </div>
            </div>

            {/* Footer del Modal (Fijo Abajo con Botones Siempre Visibles) */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 shrink-0">
              <button
                onClick={() => setSelectedPurchase(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition cursor-pointer"
              >
                Cerrar
              </button>

              {selectedPurchase.status === "pending" && (
                <button
                  onClick={() => handleStatusChange(selectedPurchase._id, "processed")}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition cursor-pointer shadow-xs inline-flex items-center gap-2"
                >
                  <CheckCircle size={16} />
                  <span>Marcar como Procesada</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
