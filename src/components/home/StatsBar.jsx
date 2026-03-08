export default function StatsBar() {
  return (
    <div className="bg-brand-600 text-white py-12 border-t border-brand-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div>
          <div className="text-4xl font-black mb-1">100+</div>
          <div className="text-brand-100 text-xs font-bold uppercase tracking-widest">
            Artículos
          </div>
        </div>
        <div>
          <div className="text-4xl font-black mb-1">500+</div>
          <div className="text-brand-100 text-xs font-bold uppercase tracking-widest">
            Rematados
          </div>
        </div>
        <div>
          <div className="text-4xl font-black mb-1">10+</div>
          <div className="text-brand-100 text-xs font-bold uppercase tracking-widest">
            Categorías
          </div>
        </div>
        <div>
          <div className="text-4xl font-black mb-1">15</div>
          <div className="text-brand-100 text-xs font-bold uppercase tracking-widest">
            Años exp.
          </div>
        </div>
      </div>
    </div>
  );
}
