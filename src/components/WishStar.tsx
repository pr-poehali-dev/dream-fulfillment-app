import { useState } from "react";

export type WishCategory = 'dust' | 'flicker' | 'star' | 'beacon' | 'sun';

export interface WishItem {
  id: number;
  x: number;
  y: number;
  amount: number;
  wish: string;
  name: string;
  avatar: string;
  brightness: number;
  category: WishCategory;
}

interface Props {
  wish: WishItem;
}

const CATEGORY_CONFIG: Record<WishCategory, {
  size: number;
  opacity: number;
  glow: string;
  avatarOpacity: number;
  avatarFilter: string;
  rays: boolean;
  goldHalo: boolean;
}> = {
  dust: {
    size: 18,
    opacity: 0.35,
    glow: '0 0 6px 3px rgba(200,200,255,0.25)',
    avatarOpacity: 0,
    avatarFilter: 'blur(4px) brightness(0.3)',
    rays: false,
    goldHalo: false,
  },
  flicker: {
    size: 24,
    opacity: 0.55,
    glow: '0 0 10px 5px rgba(180,180,255,0.35), 0 0 20px 8px rgba(150,150,255,0.15)',
    avatarOpacity: 0.4,
    avatarFilter: 'blur(2px) brightness(0.5)',
    rays: false,
    goldHalo: false,
  },
  star: {
    size: 32,
    opacity: 0.75,
    glow: '0 0 14px 6px rgba(200,220,255,0.5), 0 0 28px 12px rgba(180,200,255,0.25)',
    avatarOpacity: 0.7,
    avatarFilter: 'blur(0.5px) brightness(0.75)',
    rays: false,
    goldHalo: false,
  },
  beacon: {
    size: 42,
    opacity: 0.9,
    glow: '0 0 18px 8px rgba(255,240,180,0.65), 0 0 36px 16px rgba(255,210,80,0.35), 0 0 60px 24px rgba(255,180,30,0.15)',
    avatarOpacity: 1,
    avatarFilter: 'brightness(0.9)',
    rays: false,
    goldHalo: false,
  },
  sun: {
    size: 54,
    opacity: 1,
    glow: '0 0 24px 12px rgba(255,253,180,0.9), 0 0 50px 22px rgba(255,220,50,0.6), 0 0 90px 36px rgba(255,180,30,0.3)',
    avatarOpacity: 1,
    avatarFilter: 'brightness(1)',
    rays: true,
    goldHalo: true,
  },
};

export function calcBrightness(amount: number, minAmount: number, maxAmount: number): number {
  if (maxAmount === minAmount) return 0.5;
  return (amount - minAmount) / (maxAmount - minAmount);
}

export function getCategory(brightness: number): WishCategory {
  if (brightness <= 0.2) return 'dust';
  if (brightness <= 0.4) return 'flicker';
  if (brightness <= 0.6) return 'star';
  if (brightness <= 0.8) return 'beacon';
  return 'sun';
}

export default function WishStar({ wish }: Props) {
  const [hovered, setHovered] = useState(false);
  const cfg = CATEGORY_CONFIG[wish.category];
  const s = hovered ? cfg.size * 1.7 : cfg.size;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${wish.x}%`,
        top: `${wish.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: hovered ? 50 : 10,
        cursor: 'pointer',
        pointerEvents: 'auto',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
    >
      {/* Лучи для Sun */}
      {cfg.rays && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {[0, 45, 90, 135].map(rot => (
            <div key={rot} style={{
              position: 'absolute',
              width: '2px',
              height: `${s * 1.4}px`,
              left: '50%',
              top: '50%',
              marginLeft: '-1px',
              marginTop: `-${s * 0.7}px`,
              background: 'linear-gradient(to bottom, transparent, rgba(255,220,80,0.7), transparent)',
              transform: `rotate(${rot}deg)`,
              animation: 'wish-ray-spin 8s linear infinite',
              pointerEvents: 'none',
            }} />
          ))}
        </div>
      )}

      {/* Золотой ореол для Sun */}
      {cfg.goldHalo && (
        <div style={{
          position: 'absolute',
          width: `${s * 2.2}px`,
          height: `${s * 2.2}px`,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,220,50,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
          animation: 'wish-pulse 2s ease-in-out infinite',
        }} />
      )}

      {/* Кружок — аватар */}
      <div style={{
        width: `${s}px`,
        height: `${s}px`,
        borderRadius: '50%',
        overflow: 'hidden',
        boxShadow: cfg.glow,
        opacity: cfg.opacity,
        transition: 'width 0.3s ease, height 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease',
        border: wish.category === 'sun' ? '2px solid rgba(255,220,80,0.8)' :
                wish.category === 'beacon' ? '1.5px solid rgba(255,220,120,0.5)' :
                '1px solid rgba(255,255,255,0.15)',
        animation: `wish-twinkle ${3 + (wish.id % 3)}s ease-in-out infinite`,
        position: 'relative',
      }}>
        <img
          src={wish.avatar}
          alt={wish.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: hovered ? 1 : cfg.avatarOpacity,
            filter: hovered ? 'none' : cfg.avatarFilter,
            transition: 'opacity 0.3s ease, filter 0.3s ease',
          }}
        />
      </div>

      {/* Попап при наведении */}
      {hovered && (
        <div style={{
          position: 'absolute',
          bottom: `${s + 10}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(6,8,22,0.92)',
          border: '1px solid rgba(201,168,76,0.35)',
          borderRadius: '12px',
          padding: '10px 14px',
          minWidth: '180px',
          maxWidth: '240px',
          pointerEvents: 'none',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
          zIndex: 60,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <img src={wish.avatar} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} alt="" />
            <span style={{ color: '#c9a84c', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>{wish.name}</span>
          </div>
          <p style={{ color: 'rgba(240,232,208,0.9)', fontSize: 12, lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>
            «{wish.wish}»
          </p>
          <div style={{ marginTop: 6, fontSize: 11, color: 'rgba(201,168,76,0.7)' }}>
            {wish.amount} ₽ · {wish.category === 'dust' ? 'Пыль' : wish.category === 'flicker' ? 'Мерцание' : wish.category === 'star' ? 'Звезда' : wish.category === 'beacon' ? 'Маяк' : 'Солнце'}
          </div>
        </div>
      )}

      <style>{`
        @keyframes wish-twinkle {
          0%, 100% { opacity: ${cfg.opacity}; }
          50% { opacity: ${Math.min(cfg.opacity + 0.15, 1)}; }
        }
        @keyframes wish-ray-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes wish-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
        }
      `}</style>
    </div>
  );
}