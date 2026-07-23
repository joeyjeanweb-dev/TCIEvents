/**
 * Milestone 0 placeholder.
 * Confirms fonts + "Tropical Luxury" color tokens are wired up correctly.
 * This whole page gets replaced by the real homepage in Milestone 1.
 */
export default function Home() {
  const swatches = [
    { name: "ocean-900", className: "bg-ocean-900" },
    { name: "ocean-700", className: "bg-ocean-700" },
    { name: "ocean-600", className: "bg-ocean-600" },
    { name: "ocean-400", className: "bg-ocean-400" },
    { name: "turquoise", className: "bg-turquoise" },
    { name: "sand-100", className: "bg-sand-100" },
    { name: "sand-200", className: "bg-sand-200" },
    { name: "gold-500", className: "bg-gold-500" },
    { name: "ink-900", className: "bg-ink-900" },
    { name: "ink-500", className: "bg-ink-500" },
  ];

  return (
    <main className="container-page py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-ocean-600">
        Milestone 0 · Setup check
      </p>
      <h1 className="mt-3 text-5xl md:text-6xl font-semibold text-ocean-900">
        Tropical Luxury is ready.
      </h1>
      <p className="mt-4 max-w-xl text-lg text-ink-500 font-sans">
        This heading is <span className="font-display">Fraunces</span> and this
        body text is <span className="font-semibold">Inter</span>. If the colors
        below look right, our design tokens are wired up correctly.
      </p>

      <div className="mt-10 grid grid-cols-2 sm:grid-cols-5 gap-4">
        {swatches.map((s) => (
          <div key={s.name}>
            <div
              className={`${s.className} h-20 rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] ring-1 ring-black/5`}
            />
            <p className="mt-2 text-xs text-ink-500">{s.name}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap gap-4">
        <button className="rounded-[var(--radius-control)] bg-ocean-600 px-6 py-3 font-medium text-white shadow-[var(--shadow-soft)] transition hover:bg-ocean-700">
          Primary button
        </button>
        <button className="rounded-[var(--radius-control)] bg-gradient-to-r from-gold-500 to-[#d9b64a] px-6 py-3 font-medium text-ink-900 shadow-[var(--shadow-soft)] transition hover:brightness-105">
          Premium button
        </button>
      </div>
    </main>
  );
}
