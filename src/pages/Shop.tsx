export default function Shop() {
  return (
    <div className="min-h-screen" style={{ background: '#060810' }}>
      <header className="flex items-center justify-between px-6 py-5 md:px-12"
        style={{ borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
        <a href="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
          <span style={{ color: '#c9a84c' }}>✦</span>
          <span className="font-cormorant text-xl font-medium tracking-widest uppercase" style={{ color: '#c9a84c' }}>Загадай</span>
        </a>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-6">🛍️</div>
        <h1 className="font-cormorant text-4xl md:text-5xl mb-4" style={{ color: '#f0e8d0' }}>
          Магазин желаний
        </h1>
        <p className="font-golos text-sm mb-6 max-w-sm mx-auto leading-relaxed" style={{ color: 'rgba(200,210,240,0.5)' }}>
          Витрина товаров с Яндекс.Маркета с фиксированными ценами.
          <br />Раздел находится в разработке.
        </p>
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-panel font-golos text-sm"
          style={{ color: 'rgba(201,168,76,0.7)', border: '1px solid rgba(201,168,76,0.2)' }}>
          ✦ Скоро
        </div>
        <div className="mt-10">
          <a href="/" className="font-golos text-sm" style={{ color: 'rgba(200,210,240,0.35)', textDecoration: 'none' }}>
            ← Вернуться на главную
          </a>
        </div>
      </div>
    </div>
  );
}
