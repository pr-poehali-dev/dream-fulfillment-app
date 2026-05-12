import Icon from "@/components/ui/icon";
import { WishItem } from "@/components/WishStar";

const CATEGORY_LABEL: Record<string, string> = {
  dust: 'Пыль',
  flicker: 'Мерцание',
  star: 'Звезда',
  beacon: 'Маяк',
  sun: 'Солнце',
};

const CATEGORY_COLOR: Record<string, string> = {
  dust: 'rgba(200,200,255,0.6)',
  flicker: 'rgba(180,180,255,0.7)',
  star: 'rgba(200,220,255,0.8)',
  beacon: 'rgba(255,220,100,0.85)',
  sun: '#ffd700',
};

interface Props {
  wish: WishItem;
  onClose: () => void;
}

export default function WishCardModal({ wish, onClose }: Props) {
  const color = CATEGORY_COLOR[wish.category];

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(4,6,14,0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 420,
          background: 'rgba(8,10,24,0.97)',
          border: `1px solid ${color}44`,
          borderRadius: 24,
          padding: '36px 32px 32px',
          boxShadow: `0 0 60px ${color}22, 0 20px 60px rgba(0,0,0,0.7)`,
          textAlign: 'center',
        }}
      >
        {/* Закрыть */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(200,210,240,0.35)', padding: 4,
          }}>
          <Icon name="X" size={18} />
        </button>

        {/* Аватар */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>
          <div style={{
            position: 'absolute', inset: -6,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color}33 0%, transparent 70%)`,
          }} />
          <img
            src={wish.avatar}
            alt={wish.name}
            style={{
              width: 80, height: 80, borderRadius: '50%', objectFit: 'cover',
              border: `2px solid ${color}88`,
              boxShadow: `0 0 20px ${color}55`,
              position: 'relative',
            }}
          />
          <div style={{
            position: 'absolute', bottom: 2, right: 2,
            width: 20, height: 20, borderRadius: '50%',
            background: '#060810',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11,
            border: `1px solid ${color}55`,
          }}>
            ✦
          </div>
        </div>

        {/* Имя */}
        <div className="font-golos" style={{ color, fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
          {wish.name}
        </div>

        {/* Категория */}
        <div className="font-golos" style={{ fontSize: 11, color: 'rgba(200,210,240,0.35)', marginBottom: 24, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {CATEGORY_LABEL[wish.category]}
        </div>

        {/* Разделитель */}
        <div style={{ width: 40, height: 1, background: `linear-gradient(to right, transparent, ${color}55, transparent)`, margin: '0 auto 24px' }} />

        {/* Желание */}
        <p className="font-cormorant" style={{
          fontSize: 'clamp(1.1rem, 4vw, 1.35rem)',
          fontStyle: 'italic',
          fontWeight: 300,
          color: '#f0e8d0',
          lineHeight: 1.6,
          marginBottom: 28,
        }}>
          «{wish.wish}»
        </p>

        {/* Сумма */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '6px 16px', borderRadius: 99,
          background: `${color}11`,
          border: `1px solid ${color}33`,
        }}>
          <span style={{ fontSize: 13, color }}>✦</span>
          <span className="font-golos" style={{ fontSize: 13, color, fontWeight: 600 }}>
            {wish.amount.toLocaleString('ru-RU')} ₽
          </span>
        </div>
      </div>
    </div>
  );
}
