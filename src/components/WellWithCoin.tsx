const WELL_IMG = "https://cdn.poehali.dev/projects/f2ec5eb9-318b-4d91-873e-4b30179226d6/bucket/44ca2f43-19c6-45a5-824f-8662569e1ee3.jpeg";
const COIN_IMG = "https://cdn.poehali.dev/projects/f2ec5eb9-318b-4d91-873e-4b30179226d6/bucket/994424dc-faf0-452e-8765-ab51c3bce72d.png";

interface Props {
  coinAnim: boolean;
  rippleAnim: boolean;
  smokeAnim: boolean;
  onWellClick: () => void;
}

export default function WellWithCoin({ coinAnim, rippleAnim, smokeAnim, onWellClick }: Props) {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 700, margin: '0 auto' }}>
      <img
        src={WELL_IMG}
        alt="Ночной берег с колодцем"
        style={{
          width: '100%',
          display: 'block',
          objectFit: 'cover',
          objectPosition: 'center bottom',
          filter: 'brightness(0.75) contrast(1.1)',
          borderRadius: 0,
        }}
      />

      {/* Монетка — над отверстием колодца: ~47% слева, ~28% сверху */}
      <button
        onClick={onWellClick}
        aria-label="Загадать желание"
        style={{
          position: 'absolute',
          left: '47%',
          top: '28%',
          transform: 'translateX(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}
        className="focus:outline-none"
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
            style={{ width: 74, height: 74, objectFit: 'cover', objectPosition: 'center 10%', marginTop: -6 }}
          />
        </div>
      </button>

      {/* Анимация падения монеты */}
      {coinAnim && (
        <div
          className="animate-coin-fall pointer-events-none select-none"
          style={{
            position: 'absolute',
            left: '47%',
            top: '28%',
            transform: 'translateX(-50%)',
            zIndex: 20,
          }}
        >
          <div style={{ width: 42, height: 42, overflow: 'hidden', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={COIN_IMG} alt="" style={{ width: 56, height: 56, objectFit: 'cover', objectPosition: 'center 10%', marginTop: -4 }} />
          </div>
        </div>
      )}

      {/* Рябь на воде — ~58% слева, ~75% сверху (отверстие колодца) */}
      {rippleAnim && (
        <div
          className="animate-ripple pointer-events-none"
          style={{
            position: 'absolute',
            left: '47%',
            top: '68%',
            transform: 'translateX(-50%)',
            width: 60, height: 14,
            border: '2px solid rgba(100,180,255,0.45)',
            borderRadius: '50%',
            zIndex: 20,
          }}
        />
      )}

      {/* Дым магии */}
      {smokeAnim && (
        <>
          <div
            className="animate-smoke-rise pointer-events-none"
            style={{
              position: 'absolute',
              left: '47%',
              top: '60%',
              transform: 'translateX(-50%)',
              width: 50, height: 50,
              background: 'radial-gradient(circle, rgba(150,100,220,0.5) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(10px)',
              zIndex: 20,
            }}
          />
          <div
            className="animate-smoke-rise pointer-events-none"
            style={{
              position: 'absolute',
              left: '52%',
              top: '60%',
              width: 35, height: 35,
              background: 'radial-gradient(circle, rgba(80,140,255,0.35) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(7px)',
              animationDelay: '0.25s',
              opacity: 0,
              zIndex: 20,
            }}
          />
        </>
      )}
    </div>
  );
}
