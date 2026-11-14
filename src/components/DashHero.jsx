// Photo hero used at the top of role dashboards: date chip, title, subtitle, and optional glass stat cards.
export default function DashHero({ img = "villa", kicker, title, sub, stats = [], children }) {
  return (
    <section className="relative isolate overflow-hidden rounded-[28px] text-white min-h-[240px] md:min-h-[300px] p-5 md:p-8 flex flex-col justify-between gap-8 text-start">
      <img src={`/landing/${img}.webp`} alt="" className="absolute inset-0 w-full h-full object-cover -z-20" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 lp-shade" />
      <div>
        {kicker && <span className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-full bg-white/20 backdrop-blur px-3 py-1">{kicker}</span>}
        <h1 className="mt-3 font-display text-2xl md:text-4xl font-semibold text-balance [text-shadow:0_2px_20px_rgba(0,0,0,.35)]">{title}</h1>
        {sub && <p className="mt-2 text-sm md:text-base opacity-90 max-w-xl">{sub}</p>}
      </div>
      {(stats.length > 0 || children) && (
        <div className="flex flex-col sm:flex-row gap-3 sm:items-stretch">
          {stats.map(([l, v]) => (
            <div key={l} className="lp-glass rounded-[22px] px-5 py-3.5 flex-1 sm:flex-none sm:min-w-[200px]">
              <span className="text-xs font-semibold opacity-70">{l}</span>
              <div className="mt-1 font-display text-xl md:text-2xl font-semibold">{v}</div>
            </div>
          ))}
          {children}
        </div>
      )}
    </section>
  );
}
