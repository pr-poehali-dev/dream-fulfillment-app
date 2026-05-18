export default function Oferta() {
  return (
    <div className="min-h-screen" style={{ background: '#060810' }}>
      <header className="flex items-center justify-between px-6 py-5 md:px-12"
        style={{ borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
        <a href="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
          <span style={{ color: '#c9a84c' }}>✦</span>
          <span className="font-cormorant text-xl font-medium tracking-widest uppercase" style={{ color: '#c9a84c' }}>Загадай</span>
        </a>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-cormorant text-4xl md:text-5xl mb-2" style={{ color: '#f0e8d0' }}>Публичная оферта</h1>
        <p className="font-golos text-sm mb-10" style={{ color: 'rgba(200,210,240,0.4)' }}>
          Редакция от 01.01.2024
        </p>

        <div className="text-center mt-8">
          <a href="/" className="font-golos text-sm" style={{ color: 'rgba(200,210,240,0.35)', textDecoration: 'none' }}>
            ← Вернуться на главную
          </a>
        </div>
      </div>
    </div>
  );
}
