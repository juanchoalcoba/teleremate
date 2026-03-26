import { useQuery } from "@tanstack/react-query";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Package,
  Gavel,
  CheckCircle,
  TrendingUp,
  DollarSign,
  AlertCircle,
  ChevronRight,
  Star,
} from "lucide-react";
import { getDashboard } from "../../services/api";
import { Link } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUtils";

// eslint-disable-next-line no-unused-vars
function KPICard({ title, value, icon: Icon, color, trend }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    green: "bg-green-50 text-green-600 border-green-100",
    brand: "bg-brand-50 text-brand-600 border-brand-100",
  };

  return (
    <div className="card p-6 border border-gray-100 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-1">
          {title}
        </p>
        <h3 className="text-3xl font-bold text-gray-900 font-display">
          {value}
        </h3>
        {trend && (
          <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-green-600">
            <TrendingUp size={12} /> {trend} esta semana
          </div>
        )}
      </div>
      <div
        className={`p-3 rounded-2xl border ${colors[color] || colors.brand}`}
      >
        <Icon size={24} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: getDashboard,
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-10 w-48 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-gray-200 rounded-2xl"></div>
          <div className="h-96 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const { kpis, salesByMonth, featuredArticles } = data?.data || {};

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-display">
          Resumen del Negocio
        </h1>
        <p className="text-gray-500 mt-1">
          Acá podés ver el estado general de las operaciones de Teleremate.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Venta Directa"
          value={kpis?.totalDepot || 0}
          icon={Package}
          color="blue"
        />
        <KPICard
          title="Próximos Remates"
          value={kpis?.totalUpcoming || 0}
          icon={Gavel}
          color="amber"
        />
        <KPICard
          title="Vendidos"
          value={kpis?.totalSold || 0}
          icon={CheckCircle}
          color="green"
          trend="+12%"
        />
        <KPICard
          title="Valor Estimado"
          value={`$${(kpis?.estimatedValue || 0).toLocaleString("es-UY")}`}
          icon={DollarSign}
          color="brand"
        />
      </div>

      {/* Charts & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="card lg:col-span-2 border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-gray-900 font-display">
              Historial de Ventas
            </h3>
            <select className="input h-9 py-0 text-xs w-32 border-none bg-gray-50">
              <option>Últimos 6 meses</option>
              <option>Último año</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesByMonth || []}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  dx={-10}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value) => [
                    `$${value.toLocaleString("es-UY")}`,
                    "Ventas",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top items */}
        <div className="card border border-gray-100 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 font-display">
              Artículos Relevantes
            </h3>
            <span className="p-2 bg-brand-50 text-brand-500 rounded-lg">
              <Star size={18} fill="currentColor" />
            </span>
          </div>
          <div className="flex-1 space-y-5">
            {featuredArticles?.map((item) => (
              <Link
                key={item._id}
                to={`/articulo/${item._id}`}
                className="flex items-center gap-3 group hover:bg-gray-50 p-2 -m-2 rounded-xl transition-colors"
                target="_blank"
              >
                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                  <img
                    src={getImageUrl(item.images?.[0]?.url)}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate group-hover:text-brand-600 transition-colors">
                    {item.title}
                  </p>
                  <p className="text-xs text-brand-600 font-semibold mt-0.5">
                    $ {item.estimatedPrice.toLocaleString("es-UY")}
                  </p>
                </div>
                <ChevronRight
                  size={14}
                  className="text-gray-300 group-hover:text-brand-400 group-hover:translate-x-1 transition-all"
                />
              </Link>
            ))}

            {(!featuredArticles || featuredArticles.length === 0) && (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 py-12">
                <AlertCircle size={32} className="mb-2 opacity-20" />
                <p className="text-sm">No hay artículos destacados</p>
              </div>
            )}
          </div>
          <Link
            to="/backoffice/articulos"
            className="mt-6 text-center text-sm font-bold text-brand-600 hover:text-brand-700 bg-brand-50 py-2.5 rounded-xl transition-colors"
          >
            Ver inventario completo
          </Link>
        </div>
      </div>
    </div>
  );
}
