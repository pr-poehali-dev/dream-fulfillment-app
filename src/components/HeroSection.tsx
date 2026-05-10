import Icon from "@/components/ui/icon";

type IntroPhase = 'line1' | 'line2' | 'out' | 'done';

interface Props {
  introPhase: IntroPhase;
  starsCount: number;
  coinAnim: boolean;
  rippleAnim: boolean;
  smokeAnim: boolean;
  onWellClick: () => void;
  onShowVideo: () => void;
}

const COIN_IMG = "https://cdn.poehali.dev/projects/f2ec5eb9-318b-4d91-873e-4b30179226d6/bucket/994424dc-faf0-452e-8765-ab51c3bce72d.png";

export default function HeroSection({
  introPhase,
  starsCount,
  coinAnim,
  rippleAnim,
  smokeAnim,
  onWellClick,
}: Props) {
  return (
    <>
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12">
        <div className="flex items-center gap-2">
          <span className="text-xl" style={{ color: '#c9a84c' }}>✦</span>
          <span className="font-cormorant text-xl font-medium tracking-widest uppercase" style={{ color: '#c9a84c' }}>ЗАГАДАЙ.ОНЛАЙН</span>
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
              justifyContent: 'center',
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

        {/* Stars counter */}
        <div className="animate-fade-in mt-6 mb-6" style={{ animationDelay: '0.5s', opacity: 0 }}>
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full glass-panel">
            <span className="text-lg">⭐</span>
            <span className="font-golos text-sm">
              <span style={{ color: '#c9a84c', fontWeight: 600 }}>{starsCount.toLocaleString('ru-RU')}</span>
              <span style={{ color: 'rgba(200,210,240,0.35)' }}> / 146 745 098</span>
            </span>
          </div>
        </div>

        {/* Well / Coin */}
        <div className="animate-fade-in relative my-4" style={{ animationDelay: '0.8s', opacity: 0 }}>
          <button
            onClick={onWellClick}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            aria-label="Нажми на монету, чтобы загадать желание"
            className="focus:outline-none group"
          >
            <div style={{
              width: 56, height: 56,
              overflow: 'hidden',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              filter: 'drop-shadow(0 0 14px rgba(220,170,30,0.7)) drop-shadow(0 5px 14px rgba(80,50,0,0.8))',
              animation: 'coin-wobble-v 4s ease-in-out infinite',
            }}>
              <img
                src={COIN_IMG}
                alt="монета"
                style={{
                  width: 74, height: 74,
                  objectFit: 'cover',
                  objectPosition: 'center 10%',
                  marginTop: -6,
                }}
              />
            </div>
            <p className="font-cormorant text-xs tracking-[0.3em] uppercase mt-3 text-center"
              style={{ color: 'rgba(201,168,76,0.5)' }}>
              бросить монетку
            </p>
          </button>

          {coinAnim && (
            <div className="animate-coin-fall absolute left-1/2 -top-10 -translate-x-1/2 pointer-events-none z-20 select-none">
              <div style={{ width: 42, height: 42, overflow: 'hidden', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={COIN_IMG} alt="" style={{ width: 56, height: 56, objectFit: 'cover', objectPosition: 'center 10%', marginTop: -4 }} />
              </div>
            </div>
          )}
          {rippleAnim && (
            <div className="animate-ripple absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none z-20"
              style={{ width: '60px', height: '14px', border: '2px solid rgba(100,180,255,0.45)', borderRadius: '50%' }} />
          )}
          {smokeAnim && (
            <>
              <div className="animate-smoke-rise absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none z-20"
                style={{ width: '50px', height: '50px', background: 'radial-gradient(circle, rgba(150,100,220,0.5) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(10px)' }} />
              <div className="animate-smoke-rise absolute bottom-10 left-[55%] pointer-events-none z-20"
                style={{ width: '35px', height: '35px', background: 'radial-gradient(circle, rgba(80,140,255,0.35) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(7px)', animationDelay: '0.25s', opacity: 0 }} />
            </>
          )}

          <p className="font-golos text-xs mt-3" style={{ color: 'rgba(200,210,240,0.35)' }}>
            Нажми на колодец и брось монетку
          </p>
        </div>

        {/* CTA buttons */}
        <div className="animate-fade-in flex flex-wrap items-center justify-center gap-3 mt-4"
          style={{ animationDelay: '1s', opacity: 0 }}>
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
