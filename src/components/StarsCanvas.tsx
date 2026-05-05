import { useEffect, useState } from "react";

type Star = { id: number; x: number; y: number; size: number; delay: number; lit: boolean; isNew?: boolean };

interface Props {
  stars: Star[];
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
        return (
          <div key={star.id} style={{ position: 'absolute', left: `${star.x}%`, top: `${star.y}%` }}>
            {/* Вспышка при появлении */}
            {isFlashing && (
              <>
                {/* Большое гало */}
                <div style={{
                  position: 'absolute',
                  width: '120px', height: '120px',
                  left: '-60px', top: '-60px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,253,200,0.5) 0%, rgba(255,220,80,0.15) 40%, transparent 70%)',
                  animation: 'star-burst-halo 2.5s ease-out forwards',
                  pointerEvents: 'none',
                }} />
                {/* Лучи-крест */}
                <div style={{
                  position: 'absolute',
                  width: '2px', height: '60px',
                  left: '-1px', top: '-30px',
                  background: 'linear-gradient(to bottom, transparent, rgba(255,253,200,0.9), transparent)',
                  animation: 'star-burst-ray 2s ease-out forwards',
                  pointerEvents: 'none',
                }} />
                <div style={{
                  position: 'absolute',
                  width: '60px', height: '2px',
                  left: '-30px', top: '-1px',
                  background: 'linear-gradient(to right, transparent, rgba(255,253,200,0.9), transparent)',
                  animation: 'star-burst-ray 2s ease-out forwards',
                  pointerEvents: 'none',
                }} />
                {/* Диагональные лучи */}
                <div style={{
                  position: 'absolute',
                  width: '1px', height: '40px',
                  left: '-0.5px', top: '-20px',
                  background: 'linear-gradient(to bottom, transparent, rgba(255,253,200,0.6), transparent)',
                  transform: 'rotate(45deg)',
                  animation: 'star-burst-ray 2s ease-out forwards',
                  animationDelay: '0.1s',
                  pointerEvents: 'none',
                }} />
                <div style={{
                  position: 'absolute',
                  width: '1px', height: '40px',
                  left: '-0.5px', top: '-20px',
                  background: 'linear-gradient(to bottom, transparent, rgba(255,253,200,0.6), transparent)',
                  transform: 'rotate(-45deg)',
                  animation: 'star-burst-ray 2s ease-out forwards',
                  animationDelay: '0.1s',
                  pointerEvents: 'none',
                }} />
              </>
            )}

            {/* Сама звезда */}
            <div
              className="star-dot"
              style={{
                position: 'absolute',
                left: 0, top: 0,
                width: `${star.size * (isFlashing ? 3 : 1)}px`,
                height: `${star.size * (isFlashing ? 3 : 1)}px`,
                marginLeft: `-${star.size * (isFlashing ? 1.5 : 0.5)}px`,
                marginTop: `-${star.size * (isFlashing ? 1.5 : 0.5)}px`,
                borderRadius: '50%',
                background: '#fffdf0',
                boxShadow: isFlashing
                  ? `0 0 ${star.size * 8}px ${star.size * 3}px rgba(255,253,200,0.9), 0 0 ${star.size * 20}px ${star.size * 6}px rgba(255,220,80,0.4)`
                  : `0 0 ${star.size * 3}px ${star.size}px rgba(255,253,200,0.5)`,
                animation: isFlashing
                  ? 'star-appear 2.5s ease-out forwards'
                  : `twinkle ${2.5 + star.delay * 0.4}s ease-in-out ${star.delay}s infinite`,
                opacity: isFlashing ? 1 : 0.75,
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
