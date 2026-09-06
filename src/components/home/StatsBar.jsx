import { Users, Gavel, Package, ShieldCheck } from "lucide-react";

export default function StatsBar() {
  const stats = [
    {
      icon: Users,
      value: "+50.000",
      label: "Usuarios activos",
    },
    {
      icon: Gavel,
      value: "+12.000",
      label: "Subastas realizadas",
    },
    {
      icon: Package,
      value: "+30.000",
      label: "Artículos vendidos",
    },
    {
      icon: ShieldCheck,
      value: "100%",
      label: "Confianza y transparencia",
    },
  ];

  return (
    <div className="relative z-20 -mt-6 sm:-mt-7 px-4 sm:px-6 lg:px-8 mb-12">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl sm:rounded-full border border-gray-100 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.12)] px-6 sm:px-10 py-5 sm:py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-4 items-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`flex items-center gap-3.5 sm:gap-4 ${
                  idx > 0 ? "pt-4 md:pt-0 md:pl-6" : ""
                } ${idx % 2 !== 0 && "pl-4 md:pl-6"}`}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
                  <Icon size={24} />
                </div>
                <div className="text-left">
                  <div className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                    {item.value}
                  </div>
                  <div className="text-xs sm:text-xs font-bold text-gray-500">
                    {item.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
