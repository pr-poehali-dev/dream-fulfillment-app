import { useEffect, useState } from "react";

type Star = { id: number; x: number; y: number; size: number; delay: number; lit: boolean; isNew?: boolean; amount?: number };

interface Props {
  stars: Star[];
}

function getStarGlow(amount: number | undefined, size: number) {
  const a = amount ?? 10;
  if (a >= 1000) return {
    color: '#fff7c0',
    glow: `0 0 ${size*10}px ${size*5}px rgba(255,255,150,0.95), 0 0 ${size*28}px ${size*10}px rgba(255,220,50,0.55), 0 0 ${size*55}px ${size*18}px rgba(255,180,30,0.25)`,
    opacity: 1,
  };
  if (a >= 500) return {
    color: '#fff5d0',
    glow: `0 0 ${size*8}px ${size*4}px rgba(255,245,160,0.9), 0 0 ${size*20}px ${size*8}px rgba(255,210,60,0.45)`,
    opacity: 0.97,
  };
  if (a >= 100) return {
    color: '#fffde0',
    glow: `0 0 ${size*6}px ${size*3}px rgba(255,253,200,0.85), 0 0 ${size*14}px ${size*5}px rgba(255,230,80,0.35)`,
    opacity: 0.92,
  };
  if (a >= 50) return {
    color: '#fffcf0',
    glow: `0 0 ${size*4}px ${size*2}px rgba(255,252,220,0.75), 0 0 ${size*9}px ${size*3}px rgba(255,220,100,0.25)`,
    opacity: 0.85,
  };
  return {
    color: '#fffdf0',
    glow: `0 0 ${size*3}px ${size}px rgba(255,253,200,0.5)`,
    opacity: 0.72,
  };
}

export default function StarsCanvas({ stars }: Props) {
  const [flashing, setFlashing] = useState<Set<number>>(new Set());

  useEffect(() => {
    const newStars = stars.filter(s => s.isNew);
    if (newStars.length === 0) return;

    const ids = new Set(newStars.map(s => s.id));
    setFlashing(ids);
    const timer = setTimeout(() => setFlashing(new Set()), 3000);
    return () => clearTimeout(timer);
  }, [stars]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {stars.map(star => {
        const isFlashing = flashing.has(star.id);
        const { color, glow, opacity } = getStarGlow(star.amount, star.size);
        // Размер гало вспышки тоже зависит от суммы
        const haloSize = star.amount && star.amount >= 1000 ? 200 : star.amount && star.amount >= 100 ? 150 : 120;
        const rayLen = star.amount && star.amount >= 1000 ? 90 : star.amount && star.amount >= 100 ? 70 : 55;

        return (
          <div key={star.id} style={{ position: 'absolute', left: `${star.x}%`, top: `${star.y}%` }}>
            {/* Вспышка при появлении */}
            {isFlashing && (
              <>
                <div style={{
                  position: 'absolute',
                  width: `${haloSize}px`, height: `${haloSize}px`,
                  left: `-${haloSize/2}px`, top: `-${haloSize/2}px`,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, rgba(255,253,200,0.55) 0%, rgba(255,220,80,0.18) 40%, transparent 70%)`,
                  animation: 'star-burst-halo 2.5s ease-out forwards',
                  pointerEvents: 'none',
                }} />
                {/* Лучи */}
                {[0, 90, 45, -45].map((rot, ri) => (
                  <div key={ri} style={{
                    position: 'absolute',
                    width: ri < 2 ? '2px' : '1px',
                    height: `${rayLen}px`,
                    left: '-1px', top: `-${rayLen/2}px`,
                    background: `linear-gradient(to bottom, transparent, ${color}, transparent)`,
                    transform: `rotate(${rot}deg)`,
                    animation: 'star-burst-ray 2s ease-out forwards',
                    animationDelay: ri >= 2 ? '0.1s' : '0s',
                    pointerEvents: 'none',
                  }} />
                ))}
              </>
            )}

            {/* Сама звезда */}
            <div
              className="star-dot"
              style={{
                position: 'absolute',
                left: 0, top: 0,
                width: `${star.size * (isFlashing ? 3.2 : 1)}px`,
                height: `${star.size * (isFlashing ? 3.2 : 1)}px`,
                marginLeft: `-${star.size * (isFlashing ? 1.6 : 0.5)}px`,
                marginTop: `-${star.size * (isFlashing ? 1.6 : 0.5)}px`,
                borderRadius: '50%',
                background: color,
                boxShadow: isFlashing
                  ? `0 0 ${star.size * 10}px ${star.size * 4}px rgba(255,253,200,0.95), 0 0 ${star.size * 28}px ${star.size * 10}px rgba(255,220,80,0.55)`
                  : glow,
                animation: isFlashing
                  ? 'star-appear 2.5s ease-out forwards'
                  : `twinkle ${2.5 + star.delay * 0.4}s ease-in-out ${star.delay}s infinite`,
                opacity: isFlashing ? 1 : opacity,
                transition: 'width 0.5s, height 0.5s, box-shadow 0.5s',
              }}
            />
          </div>
        );
      })}

      <style>{`
        @keyframes star-appear {
          0%   { opacity: 0; transform: scale(0); }
          15%  { opacity: 1; transform: scale(2.5); }
          40%  { opacity: 1; transform: scale(1.8); }
          100% { opacity: 0.85; transform: scale(1); }
        }
        @keyframes star-burst-halo {
          0%   { opacity: 0; transform: scale(0.2); }
          20%  { opacity: 0.9; transform: scale(1); }
          100% { opacity: 0; transform: scale(2.5); }
        }
        @keyframes star-burst-ray {
          0%   { opacity: 0; transform: scaleY(0); }
          20%  { opacity: 1; transform: scaleY(1); }
          100% { opacity: 0; transform: scaleY(1.5); }
        }
      `}</style>
    </div>
  );
}
