interface Props {
  size?: number;
  glow?: boolean;
}

export default function GoldCoin({ size = 72, glow = true }: Props) {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;
  const r = s * 0.42;
  const edgeH = s * 0.07;

  return (
    <svg
      width={s}
      height={s + edgeH * 2}
      viewBox={`0 0 ${s} ${s + edgeH * 2}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        display: 'block',
        filter: glow
          ? 'drop-shadow(0 0 10px rgba(201,168,76,0.7)) drop-shadow(0 0 24px rgba(201,168,76,0.3))'
          : 'none',
        transition: 'filter 0.3s ease, transform 0.3s ease',
      }}
      className={glow ? 'group-hover:scale-110' : ''}
    >
      <defs>
        <radialGradient id={`cf_${s}`} cx="40%" cy="35%" r="65%">
          <stop offset="0%"   stopColor="#fff4a0"/>
          <stop offset="25%"  stopColor="#e8c84a"/>
          <stop offset="60%"  stopColor="#b8900a"/>
          <stop offset="100%" stopColor="#7a5508"/>
        </radialGradient>
        <radialGradient id={`cs_${s}`} cx="32%" cy="28%" r="38%">
          <stop offset="0%"   stopColor="rgba(255,252,200,0.75)"/>
          <stop offset="100%" stopColor="rgba(255,252,200,0)"/>
        </radialGradient>
        <linearGradient id={`ce_${s}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#c9960a"/>
          <stop offset="50%"  stopColor="#7a5508"/>
          <stop offset="100%" stopColor="#4a3005"/>
        </linearGradient>
      </defs>

      {/* Тень */}
      <ellipse cx={cx + s*0.015} cy={cy + r + edgeH + s*0.03} rx={r * 0.85} ry={edgeH * 0.6} fill="rgba(0,0,0,0.35)"/>

      {/* Нижняя грань — объём */}
      <ellipse cx={cx} cy={cy + edgeH} rx={r} ry={edgeH} fill={`url(#ce_${s})`}/>
      {/* Боковая стенка */}
      <rect
        x={cx - r} y={cy}
        width={r * 2} height={edgeH}
        fill={`url(#ce_${s})`}
      />

      {/* Основной диск */}
      <circle cx={cx} cy={cy} r={r} fill={`url(#cf_${s})`}/>

      {/* Рифлёный ободок */}
      {Array.from({ length: 36 }, (_, i) => {
        const a1 = (i / 36) * Math.PI * 2;
        const a2 = ((i + 0.4) / 36) * Math.PI * 2;
        const ri = r * 0.91, ro = r * 0.98;
        return (
          <line
            key={i}
            x1={cx + ri * Math.cos(a1)} y1={cy + ri * Math.sin(a1)}
            x2={cx + ro * Math.cos(a2)} y2={cy + ro * Math.sin(a2)}
            stroke="#7a5508" strokeWidth={s * 0.012} opacity="0.6"
          />
        );
      })}

      {/* Кольцо обода */}
      <circle cx={cx} cy={cy} r={r}    fill="none" stroke="#a07820" strokeWidth={s * 0.014} opacity="0.5"/>
      <circle cx={cx} cy={cy} r={r * 0.88} fill="none" stroke="#c9a84c" strokeWidth={s * 0.008} opacity="0.35"/>

      {/* Знак ₽ по центру */}
      <text
        x={cx} y={cy + r * 0.12}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Georgia, serif"
        fontWeight="bold"
        fontSize={r * 0.82}
        fill="#fff4a0"
        opacity="0.92"
        style={{ letterSpacing: 0 }}
      >₽</text>

      {/* Блик */}
      <ellipse
        cx={cx - r * 0.22} cy={cy - r * 0.28}
        rx={r * 0.32} ry={r * 0.2}
        fill={`url(#cs_${s})`}
        style={{ transform: 'rotate(-25deg)', transformOrigin: `${cx - r * 0.22}px ${cy - r * 0.28}px` }}
      />
    </svg>
  );
}
