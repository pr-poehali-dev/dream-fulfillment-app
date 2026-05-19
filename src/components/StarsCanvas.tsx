import { useEffect, useState } from "react";

type Star = { id: number; x: number; y: number; size: number; delay: number; lit: boolean; isNew?: boolean; amount?: number; wish?: string; name?: string; avatar?: string };

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
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    const newStars = stars.filter(s => s.isNew);
    if (newStars.length === 0) return;

    const ids = new Set(newStars.map(s => s.id));
    setFlashing(ids);
    const timer = setTimeout(() => setFlashing(new Set()), 3000);
    return () => clearTimeout(timer);
  }, [stars]);

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ pointerEvents: 'none' }}>
      {stars.map(star => {
        const isFlashing = flashing.has(star.id);
        const isHovered = hoveredId === star.id;
        const { color, glow, opacity } = getStarGlow(star.amount, star.size);
        const haloSize = star.amount && star.amount >= 1000 ? 200 : star.amount && star.amount >= 100 ? 150 : 120;
        const rayLen = star.amount && star.amount >= 1000 ? 90 : star.amount && star.amount >= 100 ? 70 : 55;
        const scale = isHovered ? 2.4 : isFlashing ? 3.2 : 1;

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

            {/* Ореол при ховере */}
            {isHovered && (
              <div style={{
                position: 'absolute',
                width: `${star.size * 14}px`,
                height: `${star.size * 14}px`,
                left: `${-star.size * 7}px`,
                top: `${-star.size * 7}px`,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${color}33 0%, transparent 70%)`,
                pointerEvents: 'none',
                animation: 'star-halo-pulse 1s ease-in-out infinite',
              }} />
            )}

            {/* Сама звезда */}
            <div
              style={{
                position: 'absolute',
                left: 0, top: 0,
                width: `${star.size}px`,
                height: `${star.size}px`,
                marginLeft: `-${star.size * 0.5}px`,
                marginTop: `-${star.size * 0.5}px`,
                borderRadius: '50%',
                background: color,
                boxShadow: isHovered
                  ? `0 0 ${star.size * 12}px ${star.size * 6}px rgba(255,253,200,0.95), 0 0 ${star.size * 30}px ${star.size * 12}px rgba(255,220,80,0.6)`
                  : isFlashing
                    ? `0 0 ${star.size * 10}px ${star.size * 4}px rgba(255,253,200,0.95), 0 0 ${star.size * 28}px ${star.size * 10}px rgba(255,220,80,0.55)`
                    : glow,
                transform: `scale(${scale})`,
                animation: isFlashing || isHovered
                  ? undefined
                  : `twinkle ${2.5 + star.delay * 0.4}s ease-in-out ${star.delay}s infinite`,
                opacity: isFlashing ? 1 : opacity,
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                cursor: star.wish ? 'pointer' : 'default',
                pointerEvents: 'auto',
              }}
              onMouseEnter={() => setHoveredId(star.id)}
              onMouseLeave={() => setHoveredId(null)}
            />

            {/* Аватар пользователя над звездой */}
            {star.avatar && star.size >= 2 && (
              <div
                style={{
                  position: 'absolute',
                  left: 0, top: 0,
                  width: `${star.size * 2.2}px`,
                  height: `${star.size * 2.2}px`,
                  marginLeft: `-${star.size * 1.1}px`,
                  marginTop: `-${star.size * 1.1}px`,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  opacity: isHovered ? 0.95 : 0.45,
                  transform: `scale(${scale})`,
                  transition: 'opacity 0.25s ease, transform 0.25s ease',
                  boxShadow: `0 0 ${star.size * 3}px ${star.size}px rgba(255,240,180,0.18)`,
                  pointerEvents: 'none',
                }}
              >
                <img
                  src={star.avatar}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.85) saturate(0.7)' }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            )}

            {/* Попап при ховере */}
            {isHovered && star.wish && (
              <div style={{
                position: 'absolute',
                bottom: `${star.size * scale + 14}px`,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(6,8,22,0.93)',
                border: '1px solid rgba(201,168,76,0.25)',
                borderRadius: 12,
                padding: '10px 14px',
                minWidth: 180,
                maxWidth: 240,
                pointerEvents: 'none',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
                zIndex: 60,
                whiteSpace: 'normal',
              }}>
                {(star.name || star.avatar) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    {star.avatar && (
                      <img src={star.avatar} alt="" style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', opacity: 0.85, flexShrink: 0 }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    )}
                    {star.name && (
                      <span style={{ fontSize: 11, color: 'rgba(200,210,240,0.6)', fontFamily: 'Golos Text, sans-serif' }}>{star.name}</span>
                    )}
                  </div>
                )}
                <p style={{ color: 'rgba(240,232,208,0.9)', fontSize: 12, lineHeight: 1.5, margin: 0, fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif' }}>
                  «{star.wish}»
                </p>
                {star.amount && (
                  <div style={{ marginTop: 6, fontSize: 11, color: 'rgba(201,168,76,0.7)', fontFamily: 'Golos Text, sans-serif' }}>
                    ✦ {star.amount.toLocaleString('ru-RU')} ₽
                  </div>
                )}
              </div>
            )}
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
        @keyframes star-halo-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}