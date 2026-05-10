import { useState, useEffect, useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";
import WishModal from "@/components/WishModal";
import VideoPreview from "@/components/VideoPreview";
import StarsCanvas from "@/components/StarsCanvas";
import GoldCoin from "@/components/GoldCoin";

function useSound() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      const AudioCtx = window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      ctxRef.current = new AudioCtx();
    }
    return ctxRef.current;
  }, []);

  const playCoin = useCallback(() => {
    const ctx = getCtx();
    // Звук металлической монетки — синусоида с быстрым затуханием
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.6);

    // Второй призвук — звон
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(4200, ctx.currentTime + 0.05);
    osc2.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.3);
    gain2.gain.setValueAtTime(0.15, ctx.currentTime + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc2.start(ctx.currentTime + 0.05);
    osc2.stop(ctx.currentTime + 0.5);
  }, [getCtx]);

  const playSplash = useCallback(() => {
    const ctx = getCtx();
    // Шум воды — белый шум с огибающей
    const bufferSize = ctx.sampleRate * 0.8;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 1.5);
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // Фильтр — делаем плеск «водянистым»
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.6);
    filter.Q.value = 0.8;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start(ctx.currentTime);
    source.stop(ctx.currentTime + 0.8);
  }, [getCtx]);

  const playMagic = useCallback(() => {
    const ctx = getCtx();
    // Магический звук — восходящие синусоиды
    [0, 0.1, 0.2].forEach((delay, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      const baseFreq = 400 + i * 200;
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime + delay);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.5, ctx.currentTime + delay + 0.8);
      gain.gain.setValueAtTime(0.08, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 1.2);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 1.2);
    });
  }, [getCtx]);

  return { playCoin, playSplash, playMagic };
}

const BG_IMAGE = "https://cdn.poehali.dev/projects/f2ec5eb9-318b-4d91-873e-4b30179226d6/bucket/44ca2f43-19c6-45a5-824f-8662569e1ee3.jpeg";

const PARTNERS = [
  { name: "Ангел №1", subtitle: "Первый партнёр", url: "#" },
  { name: "Ангел №2", subtitle: "Стать партнёром", url: "#" },
  { name: "Ангел №3", subtitle: "Стать партнёром", url: "#" },
];

type Star = { id: number; x: number; y: number; size: number; delay: number; lit: boolean; amount?: number };

export default function Index() {
  const { playCoin, playSplash, playMagic } = useSound();
  const [showModal, setShowModal] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [coinAnim, setCoinAnim] = useState(false);
  const [smokeAnim, setSmokeAnim] = useState(false);
  const [rippleAnim, setRippleAnim] = useState(false);
  const [stars, setStars] = useState<Star[]>([]);
  const [introPhase, setIntroPhase] = useState<'line1' | 'line2' | 'out' | 'done'>('line1');
  const [starsCount, setStarsCount] = useState(1247);
  const [copilkaAmount] = useState(34580);
  const [angelsCount] = useState(89);
  const [altruistsCount] = useState(23);

  useEffect(() => {
    const hasSeenVideo = localStorage.getItem("zagadai_seen_video");
    if (!hasSeenVideo) {
      setTimeout(() => setShowVideo(true), 500);
    }
    setStars([]);
    // Фаза 1: первая строка — 0–2.5s
    // Фаза 2: вторая строка — 2.5–5s
    // Фаза out: исчезает — 5–6.2s
    // done: убрано
    const t1 = setTimeout(() => setIntroPhase('line2'), 2500);
    const t2 = setTimeout(() => setIntroPhase('out'), 5000);
    const t3 = setTimeout(() => setIntroPhase('done'), 6200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const handleWellClick = () => {
    if (coinAnim) return;
    playCoin();
    setCoinAnim(true);
    setTimeout(() => {
      playSplash();
      setRippleAnim(true);
    }, 1100);
    setTimeout(() => {
      playMagic();
      setSmokeAnim(true);
    }, 1300);
    setTimeout(() => {
      setCoinAnim(false);
      setRippleAnim(false);
      setSmokeAnim(false);
      setShowModal(true);
    }, 2200);
  };

  const playStarAppear = () => {
    try {
      const AudioCtx = window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      // Высокий хрустальный звон — звезда зажигается
      [0, 0.12, 0.28, 0.48].forEach((delay, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        const freqs = [1800, 2400, 3000, 2200];
        osc.frequency.setValueAtTime(freqs[i], ctx.currentTime + delay);
        osc.frequency.exponentialRampToValueAtTime(freqs[i] * 1.3, ctx.currentTime + delay + 0.4);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 1.5);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 1.5);
      });
    } catch (_) { /* silent */ }
  };

  const handleWishSent = (amount: number) => {
    setShowModal(false);
    setStarsCount(prev => prev + 1);
    setTimeout(() => playStarAppear(), 300);
    // Размер звезды зависит от суммы
    const baseSize = amount >= 1000 ? 3.5 : amount >= 500 ? 2.8 : amount >= 100 ? 2.2 : amount >= 50 ? 1.8 : 1.3;
    const newStar: Star = {
      id: Date.now(),
      x: 5 + Math.random() * 85,
      y: 2 + Math.random() * 45,
      size: baseSize + Math.random() * 0.5,
      delay: Math.random() * 3,
      lit: true,
      amount,
    };
    setStars(prev => {
      const updated = prev.map(s => ({ ...s, isNew: false }));
      return [...updated, { ...newStar, isNew: true }];
    });
    setTimeout(() => {
      setStars(prev => prev.map(s => s.id === newStar.id ? { ...s, isNew: false } : s));
    }, 3000);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: '#060810' }}>

      {showVideo && (
        <VideoPreview onClose={() => {
          localStorage.setItem("zagadai_seen_video", "1");
          setShowVideo(false);
        }} />
      )}

      {/* Background */}
      <div className="fixed inset-0 z-0" style={{ background: '#060810' }}>
        {/* Тёмное небо занимает весь верх, берег — только нижние 38% */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #03040d 0%, #060a18 55%, #080c1a 70%, #0a0e1c 100%)' }} />
        <img
          src={BG_IMAGE}
          alt="Ночной берег с колодцем"
          className="absolute left-0 right-0 bottom-0 w-full"
          style={{
            height: '42%',
            objectFit: 'cover',
            objectPosition: 'center bottom',
            filter: 'brightness(0.75) contrast(1.1)',
          }}
        />
        {/* Плавный переход небо→берег */}
        <div className="absolute left-0 right-0" style={{
          bottom: '38%',
          height: '18%',
          background: 'linear-gradient(to bottom, #060a18 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(6,8,16,0) 60%, rgba(6,8,16,0.92) 100%)'
        }} />
        <StarsCanvas stars={stars} />
      </div>

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

        {/* Интро-вспышки: появляются строки с эффектом звезды, потом исчезают */}
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
              {/* Вспышка-звезда над строкой */}
              <div style={{
                display: 'flex', justifyContent: 'center', marginBottom: '0.5rem',
                animation: 'starFlashBig 1.2s ease-out both',
              }}>
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

            {/* Строка 2 — появляется с задержкой */}
            <div style={{
              transition: 'opacity 1s ease, transform 1s ease',
              opacity: introPhase === 'line2' || introPhase === 'out' ? 1 : 0,
              transform: introPhase === 'line2' || introPhase === 'out' ? 'translateY(0)' : 'translateY(20px)',
              textAlign: 'center',
            }}>
              <div style={{
                display: 'flex', justifyContent: 'center', marginBottom: '0.5rem',
                animation: introPhase === 'line2' ? 'starFlashBig 1.2s ease-out both' : 'none',
              }}>
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

        {/* Well */}
        <div className="animate-fade-in relative my-4" style={{ animationDelay: '0.8s', opacity: 0 }}>
          <button
            onClick={handleWellClick}
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
                src="https://cdn.poehali.dev/projects/f2ec5eb9-318b-4d91-873e-4b30179226d6/bucket/994424dc-faf0-452e-8765-ab51c3bce72d.png"
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
              <div style={{
                width: 42, height: 42, overflow: 'hidden', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <img
                  src="https://cdn.poehali.dev/projects/f2ec5eb9-318b-4d91-873e-4b30179226d6/bucket/994424dc-faf0-452e-8765-ab51c3bce72d.png"
                  alt="" style={{ width: 56, height: 56, objectFit: 'cover', objectPosition: 'center 10%', marginTop: -4 }}
                />
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
            onClick={handleWellClick}>
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

      {/* Stats */}
      <section className="relative z-10 py-14 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: starsCount.toLocaleString('ru-RU'), label: "Звёзд зажжено", icon: "⭐" },
            { value: `${copilkaAmount.toLocaleString('ru-RU')} ₽`, label: "В Копилке Ангела", icon: "💰" },
            { value: angelsCount.toString(), label: "Исполнено Ангелами", icon: "👼" },
            { value: altruistsCount.toString(), label: "Исполнено Альтруистами", icon: "🤝" },
          ].map((stat, i) => (
            <div key={i} className="glass-panel rounded-2xl p-5 text-center">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="font-cormorant text-2xl md:text-3xl gold-text font-semibold mb-1">{stat.value}</div>
              <div className="font-golos text-xs" style={{ color: 'rgba(200,210,240,0.45)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-cormorant text-3xl md:text-4xl text-center mb-10" style={{ color: '#f0e8d0' }}>
            Ритуал в трёх шагах
          </h2>
          <div className="space-y-4">
            {[
              { num: "I", title: "Брось монетку", text: "Нажми на колодец, загадай желание и выбери сумму. 50% уходит в Копилку Ангела — фонд исполнения мечт." },
              { num: "II", title: "Расскажи миру", text: "Опубликуй пост ВКонтакте — так твоя звезда зажигается на небосводе. Только публичные мечты исполняются." },
              { num: "III", title: "Жди Ангела", text: "Ангел или Альтруист увидит твою звезду и исполнит желание. Белая звезда ждёт — красная уже исполнена." },
            ].map((step, i) => (
              <div key={i} className="flex gap-6 glass-panel rounded-2xl p-6">
                <div className="font-cormorant text-4xl font-light shrink-0 w-10 leading-none" style={{ color: 'rgba(201,168,76,0.45)' }}>
                  {step.num}
                </div>
                <div>
                  <h3 className="font-cormorant text-xl mb-2" style={{ color: '#f0e8d0' }}>{step.title}</h3>
                  <p className="font-golos text-sm leading-relaxed" style={{ color: 'rgba(200,210,240,0.55)' }}>{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support CTA */}
      <section className="relative z-10 py-10 px-4 text-center">
        <div className="max-w-md mx-auto glass-panel rounded-3xl p-8">
          <div className="text-4xl mb-4">🙏</div>
          <h2 className="font-cormorant text-2xl mb-3" style={{ color: '#f0e8d0' }}>Поддержать проект</h2>
          <p className="font-golos text-sm mb-6" style={{ color: 'rgba(200,210,240,0.45)' }}>
            Помоги нам зажечь все 146 745 098 звёзд
          </p>
          <button
            className="w-full py-3 rounded-full font-golos font-semibold text-sm animate-glow-pulse transition-all"
            style={{ background: 'linear-gradient(135deg, #c9a84c, #8a6a20)', color: '#060810' }}>
            Стать Ангелом-партнёром
          </button>
        </div>
      </section>

      {/* Partners */}
      <section className="relative z-10 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-cormorant text-2xl text-center mb-8" style={{ color: 'rgba(201,168,76,0.6)' }}>
            Ангелы-партнёры
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {PARTNERS.map((p, i) => (
              <a key={i} href={p.url}
                className="glass-panel rounded-2xl px-8 py-5 text-center transition-all hover:scale-105"
                style={{ minWidth: '130px', textDecoration: 'none' }}>
                <div className="text-2xl mb-2" style={{ color: 'rgba(201,168,76,0.5)' }}>✦</div>
                <div className="font-golos text-sm font-medium" style={{ color: '#f0e8d0' }}>{p.name}</div>
                <div className="font-golos text-xs mt-1" style={{ color: 'rgba(200,210,240,0.35)' }}>{p.subtitle}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-4 text-center mt-4"
        style={{ borderTop: '1px solid rgba(201,168,76,0.08)' }}>
        <div className="flex flex-wrap justify-center gap-6 mb-4">
          {[
            { label: "Правила", href: "/rules" },
            { label: "Конфиденциальность", href: "/privacy" },
            { label: "Техподдержка", href: "/contacts" },
          ].map(link => (
            <a key={link.href} href={link.href}
              className="font-golos text-xs transition-colors"
              style={{ color: 'rgba(200,210,240,0.35)', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#c9a84c')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(200,210,240,0.35)')}>
              {link.label}
            </a>
          ))}
          <button
            onClick={() => setShowVideo(true)}
            className="font-golos text-xs transition-colors"
            style={{ color: 'rgba(200,210,240,0.35)', background: 'none', border: 'none', cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#c9a84c')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(200,210,240,0.35)')}>
            О проекте
          </button>
        </div>
        <p className="font-golos text-xs" style={{ color: 'rgba(200,210,240,0.18)' }}>
          © 2024 Загадай Онлайн · zagadai.online
        </p>
      </footer>

      {showModal && (
        <WishModal onClose={() => setShowModal(false)} onSent={handleWishSent} />
      )}
    </div>
  );
}