import { useState, useEffect } from "react";

interface Props {
  onClose: () => void;
}

const SUBTITLES = [
  { time: 0, text: "Где-то на берегу вечного океана..." },
  { time: 3, text: "Стоит колодец. Ему тысяча лет." },
  { time: 6, text: "Каждая брошенная монетка..." },
  { time: 9, text: "...зажигает звезду на небосводе." },
  { time: 12, text: "146 745 098 желаний ждут исполнения." },
  { time: 15, text: "Твоё — следующее." },
];

export default function VideoPreview({ onClose }: Props) {
  const [elapsed, setElapsed] = useState(0);
  const [currentSub, setCurrentSub] = useState(SUBTITLES[0].text);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(prev => {
        const next = prev + 1;
        const sub = [...SUBTITLES].reverse().find(s => s.time <= next);
        if (sub) setCurrentSub(sub.text);
        if (next >= 18) {
          clearInterval(interval);
          onClose();
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onClose]);

  const progress = Math.min((elapsed / 18) * 100, 100);

  return (
    <div className="video-overlay z-50">
      <div className="relative w-full max-w-2xl px-6 text-center">
        {/* Animated background visual */}
        <div className="relative mb-10" style={{ height: '280px' }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 60% 40% at 50% 60%, rgba(20,30,60,0.9) 0%, rgba(6,8,16,1) 100%)',
            borderRadius: '16px',
            overflow: 'hidden',
          }}>
            {/* Moon */}
            <div style={{
              position: 'absolute', top: '15%', right: '15%',
              width: '60px', height: '60px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #f0e8d0 0%, #d4c890 100%)',
              boxShadow: '0 0 40px 15px rgba(240,232,208,0.3)',
              animation: 'moon-glow 4s ease-in-out infinite',
            }} />
            {/* Water reflection */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
              background: 'linear-gradient(to bottom, transparent, rgba(10,20,40,0.8))',
            }} />
            <div style={{
              position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
              width: '4px', height: '80px',
              background: 'linear-gradient(to bottom, rgba(240,232,208,0.6), transparent)',
              borderRadius: '2px',
            }} />
            {/* Well silhouette */}
            <div style={{
              position: 'absolute', bottom: '15%', left: '50%', transform: 'translateX(-50%)',
              fontSize: '60px', lineHeight: 1, userSelect: 'none',
            }}>🪣</div>
            {/* Stars */}
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: `${10 + Math.sin(i * 1.7) * 40 + 40}%`,
                top: `${5 + Math.cos(i * 2.3) * 20 + 10}%`,
                width: `${1 + (i % 2)}px`,
                height: `${1 + (i % 2)}px`,
                borderRadius: '50%',
                background: '#fffdf0',
                opacity: elapsed > i * 0.8 ? 0.7 : 0,
                transition: 'opacity 0.5s ease',
                boxShadow: '0 0 4px 2px rgba(255,253,200,0.4)',
              }} />
            ))}
          </div>
        </div>

        {/* Subtitle */}
        <div className="mb-8" style={{ minHeight: '60px' }}>
          <p className="font-cormorant text-2xl md:text-3xl font-light" style={{ color: '#f0e8d0' }}>
            {currentSub}
          </p>
        </div>

        {/* Progress bar */}
        <div className="relative mb-6">
          <div className="w-full h-0.5 rounded-full" style={{ background: 'rgba(201,168,76,0.15)' }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #8a6a20, #c9a84c)' }}
            />
          </div>
        </div>

        <button
          onClick={onClose}
          className="font-golos text-sm px-6 py-2 rounded-full transition-all"
          style={{
            border: '1px solid rgba(201,168,76,0.3)',
            color: 'rgba(200,210,240,0.6)',
            background: 'none',
            cursor: 'pointer',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#c9a84c')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(200,210,240,0.6)')}>
          Пропустить →
        </button>
      </div>
    </div>
  );
}