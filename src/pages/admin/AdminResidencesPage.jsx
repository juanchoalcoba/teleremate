import { useQuery } from "@tanstack/react-query";
import { 
  Home, 
  User, 
  Phone, 
  Package, 
  ExternalLink, 
  MapPin, 
  Calendar,
  MessageCircle,
  Clock
} from "lucide-react";
import { getAdminResidences } from "../../services/api";
import { Link } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUtils";
import { getCurrencySymbol } from "../../utils/articleUtils";
import { getWALink, WAMessages } from "../../utils/whatsapp";

export default function AdminResidencesPage() {
  const { data: articles, isLoading } = useQuery({
    queryKey: ["admin-residences"],
    queryFn: getAdminResidences,
    select: (res) => res.data,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-display flex items-center gap-3">
          <Home className="text-brand-600" /> Domicilios
        </h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          Gestión de artículos que se encuentran en hogares externos.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : articles?.length === 0 ? (
        <div className="card py-20 text-center bg-white border border-gray-100">
          <div className="flex flex-col items-center text-gray-400">
            <Home size={48} className="mb-4 opacity-20" />
            <p className="font-semibold text-gray-900">No hay artículos de domicilio aún</p>
            <p className="text-sm">Los artículos aparecerán aquí cuando apruebes pedidos de ingreso.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {articles?.map((item) => (
            <div key={item._id} className="card bg-white border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col md:flex-row h-full">
                {/* Article Info Section */}
                <div className="w-full md:w-2/5 relative h-48 md:h-auto">
                  <img
                    src={getImageUrl(item.images?.[0]?.url)}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${
                      item.status === 'sold' ? 'bg-red-500 text-white' :
                      item.status === 'reserved' ? 'bg-orange-500 text-white' :
                      'bg-emerald-500 text-white'
                    }`}>
                      {item.status === 'sold' ? 'Vendido' : 
                       item.status === 'reserved' ? 'Reservado' : 'Disponible'}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-5 space-y-4">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-black text-gray-900 leading-tight">{item.title}</h3>
                      <Link to={`/backoffice/articulos/editar/${item._id}`} className="text-gray-400 hover:text-brand-600 transition-colors">
                        <ExternalLink size={16} />
                      </Link>
                    </div>
                    <code className="text-[10px] bg-gray-50 text-gray-400 px-1.5 py-0.5 rounded border border-gray-100 uppercase">
                      ID: {item.lotNumber}
                    </code>
                  </div>

                  {/* Parties Section */}
                  <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-50">
                    {/* Seller Box */}
                    <div className="space-y-2">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Vendedor (Dueño)
                       </span>
                       <div className="flex items-center justify-between group/contact">
                         <div>
                           <p className="text-sm font-bold text-gray-900">{item.metadata?.sellerName}</p>
                           <p className="text-xs text-gray-500 flex items-center gap-1">
                             <Phone size={12} /> {item.metadata?.sellerPhone}
                           </p>
                         </div>
                         <a 
                           href={getWALink(item.metadata?.sellerPhone || "", WAMessages.sellerFollowup(item.metadata?.sellerName, item.title))}
                           target="_blank"
                           rel="noreferrer"
                           className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-sm"
                         >
                           <MessageCircle size={16} />
                         </a>
                       </div>
                    </div>

                    {/* Buyer Box (If exists) */}
                    {item.customerInfo && (
                      <div className="p-3 rounded-xl bg-brand-50/50 border border-brand-100 animate-in fade-in slide-in-from-bottom-2">
                        <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest flex items-center gap-1 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div> {item.customerInfo.type === 'buyer' ? 'Comprador' : 'Reservador'}
                        </span>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold text-gray-900">{item.customerInfo.fullName}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Phone size={12} /> {item.customerInfo.phone}
                            </p>
                          </div>
                          <a 
                            href={getWALink(item.customerInfo.phone, item.customerInfo.type === 'buyer' ? WAMessages.purchaseFollowup(item.customerInfo.fullName, item.lotNumber, item.title) : WAMessages.reservationFollowup(item.customerInfo.fullName, item.lotNumber, item.title))}
                            target="_blank"
                            rel="noreferrer"
                            className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600 transition-all shadow-md shadow-brand-500/20"
                          >
                            <MessageCircle size={16} />
                          </a>
                        </div>
                        {item.customerInfo.deliveryAddress && (
                          <p className="mt-2 text-[10px] text-brand-700 bg-white/50 p-1.5 rounded-lg border border-brand-100 flex items-center gap-1.5 leading-tight">
                            <MapPin size={12} className="shrink-0" /> {item.customerInfo.deliveryAddress}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
