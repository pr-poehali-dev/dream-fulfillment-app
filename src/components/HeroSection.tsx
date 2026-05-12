import Icon from "@/components/ui/icon";

type IntroPhase = 'line1' | 'line2' | 'out' | 'done';

interface Props {
  introPhase: IntroPhase;
  starsCount: number;
  onWellClick: () => void;
  onShowVideo: () => void;
}

export default function HeroSection({
  introPhase,
  starsCount,
  onWellClick,
}: Props) {
  return (
    <>
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl" style={{ color: '#c9a84c' }}>✦</span>
            <span className="font-cormorant text-xl font-medium tracking-widest uppercase" style={{ color: '#c9a84c' }}>ЗАГАДАЙ.ОНЛАЙН</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.18)' }}>
            <span style={{ fontSize: 13 }}>⭐</span>
            <span className="font-golos text-xs">
              <span style={{ color: '#c9a84c', fontWeight: 600 }}>{starsCount.toLocaleString('ru-RU')}</span>
              <span style={{ color: 'rgba(200,210,240,0.35)' }}> / 146 745 098</span>
            </span>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-golos">
          {[
            { label: "Правила", href: "/rules" },
            { label: "Конфиденциальность", href: "/privacy" },
            { label: "Поддержка", href: "/contacts" },
          ].map(link => (
            <a key={link.href} href={link.href}
              className="transition-colors"
              style={{ color: 'rgba(200,210,240,0.6)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#c9a84c')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(200,210,240,0.6)')}>
              {link.label}
            </a>
          ))}
          <a href="/cabinet"
            className="flex items-center gap-2 px-4 py-2 rounded-full transition-all font-golos"
            style={{ border: '1px solid rgba(201,168,76,0.4)', color: '#c9a84c' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.1)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <Icon name="User" size={14} />
            Войти
          </a>
        </nav>
        <button className="md:hidden" style={{ color: 'rgba(200,210,240,0.7)', background: 'none', border: 'none' }}>
          <Icon name="Menu" size={22} />
        </button>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 text-center"
        style={{ minHeight: 'calc(100vh - 80px)', paddingTop: '40px', paddingBottom: '40px' }}>

        {/* Интро-вспышки */}
        {introPhase !== 'done' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              paddingTop: '6vh',
              zIndex: 30,
              pointerEvents: 'none',
              transition: 'opacity 1.2s ease',
              opacity: introPhase === 'out' ? 0 : 1,
            }}
          >
            {/* Строка 1 */}
            <div style={{
              transition: 'opacity 0.8s ease, transform 0.8s ease',
              opacity: introPhase === 'line1' || introPhase === 'line2' || introPhase === 'out' ? 1 : 0,
              transform: introPhase === 'line1' || introPhase === 'line2' || introPhase === 'out' ? 'translateY(0)' : 'translateY(20px)',
              marginBottom: '1.2rem',
              textAlign: 'center',
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem', animation: 'starFlashBig 1.2s ease-out both' }}>
                <span style={{ fontSize: 32, lineHeight: 1, filter: 'drop-shadow(0 0 14px #fffde0) drop-shadow(0 0 30px #ffd700)' }}>✦</span>
              </div>
              <p
                className="font-cormorant"
                style={{
                  fontSize: 'clamp(1.6rem, 5vw, 3.5rem)',
                  fontWeight: 300,
                  color: '#f0e8d0',
                  letterSpacing: '0.05em',
                  animation: 'starFlashBig 1.0s ease-out both',
                  textShadow: '0 0 40px rgba(255,220,80,0.5), 0 0 80px rgba(255,180,30,0.2)',
                }}
              >
                Мечтай вслух — тебя услышат
              </p>
            </div>

            {/* Строка 2 */}
            <div style={{
              transition: 'opacity 1s ease, transform 1s ease',
              opacity: introPhase === 'line2' || introPhase === 'out' ? 1 : 0,
              transform: introPhase === 'line2' || introPhase === 'out' ? 'translateY(0)' : 'translateY(20px)',
              textAlign: 'center',
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem', animation: introPhase === 'line2' ? 'starFlashBig 1.2s ease-out both' : 'none' }}>
                <span style={{ fontSize: 28, lineHeight: 1, filter: 'drop-shadow(0 0 12px #fffde0) drop-shadow(0 0 24px #ffd700)', opacity: introPhase === 'line2' || introPhase === 'out' ? 1 : 0, transition: 'opacity 0.8s ease' }}>✦</span>
              </div>
              <p
                className="font-cormorant"
                style={{
                  fontSize: 'clamp(1.2rem, 3.5vw, 2.2rem)',
                  fontWeight: 300,
                  fontStyle: 'italic',
                  color: 'rgba(201,168,76,0.9)',
                  letterSpacing: '0.04em',
                  animation: introPhase === 'line2' ? 'starFlashBig 1.0s ease-out both' : 'none',
                  textShadow: '0 0 30px rgba(255,200,50,0.4)',
                }}
              >
                И кто-то твою мечту исполнит
              </p>
            </div>
          </div>
        )}

        <style>{`
          @keyframes starFlashBig {
            0%   { opacity: 0; transform: scale(0.6); filter: brightness(3); }
            15%  { opacity: 1; transform: scale(1.12); filter: brightness(2.5); }
            40%  { transform: scale(1.03); filter: brightness(1.4); }
            100% { opacity: 1; transform: scale(1); filter: brightness(1); }
          }
        `}</style>

        {/* CTA buttons */}
        <div className="animate-fade-in flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: '1s', opacity: 0, position: 'absolute', bottom: '8%', left: 0, right: 0 }}>
          <button
            className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-golos font-semibold transition-all"
            style={{ background: 'linear-gradient(135deg, #c9a84c, #8a6a20)', color: '#060810' }}
            onClick={onWellClick}>
            ✦ Загадать желание
          </button>
          <button
            className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-golos glass-panel transition-all"
            style={{ color: 'rgba(200,210,240,0.75)' }}>
            🎲 Случайная звезда
          </button>
          <button
            className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-golos glass-panel transition-all"
            style={{ color: 'rgba(200,210,240,0.75)' }}>
            🔍 Найти свою звезду
          </button>
        </div>


      </main>
    </>
  );
}