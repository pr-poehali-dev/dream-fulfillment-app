interface Props {
  size?: number;
  glow?: boolean;
}

export default function GoldCoin({ size = 72, glow = true }: Props) {
  const s = size;
  // Монета наклонена — рисуем как эллипс (перспектива сверху-сбоку)
  const cx = s * 0.5;
  const cy = s * 0.47;
  const rx = s * 0.44;        // горизонтальный радиус
  const ry = s * 0.38;        // вертикальный (сплюснут — наклон)
  const edgeH = s * 0.13;     // высота видимой грани (монета толстая)

  const id = `coin_${s}`;

  return (
    <div style={{ display: 'inline-block', position: 'relative' }}>
      <style>{`
        @keyframes coin-wobble {
          0%   { transform: rotate(-6deg) translateY(0px); }
          25%  { transform: rotate(0deg)  translateY(-3px); }
          50%  { transform: rotate(6deg)  translateY(0px); }
          75%  { transform: rotate(0deg)  translateY(-3px); }
          100% { transform: rotate(-6deg) translateY(0px); }
        }
        .coin-wobble {
          animation: coin-wobble 3.5s ease-in-out infinite;
          transform-origin: center bottom;
        }
        .coin-wobble:hover {
          animation-play-state: paused;
          transform: rotate(0deg) scale(1.08) !important;
        }
      `}</style>

      <div className={glow ? 'coin-wobble' : ''} style={{
        filter: glow
          ? 'drop-shadow(0 6px 18px rgba(100,70,0,0.7)) drop-shadow(0 0 22px rgba(201,168,76,0.5))'
          : 'drop-shadow(0 3px 6px rgba(0,0,0,0.6))',
        transition: 'filter 0.3s',
      }}>
        <svg
          width={s}
          height={s * 0.95}
          viewBox={`0 0 ${s} ${s * 0.95}`}
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block', overflow: 'visible' }}
        >
          <defs>
            {/* Основной градиент лицевой стороны — фотореализм */}
            <radialGradient id={`${id}_face`} cx="38%" cy="32%" r="70%">
              <stop offset="0%"   stopColor="#fff9c0"/>
              <stop offset="18%"  stopColor="#f0d060"/>
              <stop offset="42%"  stopColor="#c8920c"/>
              <stop offset="68%"  stopColor="#9a6808"/>
              <stop offset="88%"  stopColor="#7a5006"/>
              <stop offset="100%" stopColor="#5a3a04"/>
            </radialGradient>

            {/* Градиент торца — тёмно-золотой */}
            <linearGradient id={`${id}_edge`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor="#d4960e"/>
              <stop offset="30%"  stopColor="#a07010"/>
              <stop offset="70%"  stopColor="#6a4808"/>
              <stop offset="100%" stopColor="#3a2804"/>
            </linearGradient>

            {/* Блик — яркое пятно от источника света */}
            <radialGradient id={`${id}_shine`} cx="30%" cy="25%" r="45%">
              <stop offset="0%"   stopColor="rgba(255,255,220,0.85)"/>
              <stop offset="40%"  stopColor="rgba(255,240,160,0.35)"/>
              <stop offset="100%" stopColor="rgba(255,220,100,0)"/>
            </radialGradient>

            {/* Вторичный блик по краю */}
            <radialGradient id={`${id}_rim`} cx="50%" cy="50%" r="50%">
              <stop offset="78%"  stopColor="rgba(201,168,76,0)"/>
              <stop offset="90%"  stopColor="rgba(255,220,80,0.25)"/>
              <stop offset="100%" stopColor="rgba(180,120,20,0.5)"/>
            </radialGradient>

            {/* Тень на лице от рельефа */}
            <radialGradient id={`${id}_shadow`} cx="65%" cy="65%" r="55%">
              <stop offset="0%"   stopColor="rgba(60,30,0,0.45)"/>
              <stop offset="100%" stopColor="rgba(60,30,0,0)"/>
            </radialGradient>

            {/* Тиснение ₽ */}
            <filter id={`${id}_emboss`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" result="blur"/>
              <feOffset dx="1" dy="1.5" result="offset"/>
              <feComposite in="SourceGraphic" in2="offset" operator="over"/>
            </filter>
          </defs>

          {/* === ГРАНЬ (торец монеты — видна снизу из-за наклона) === */}
          {/* Основная форма грани — эллипс смещённый вниз */}
          <ellipse
            cx={cx} cy={cy + edgeH}
            rx={rx} ry={ry * 0.55}
            fill={`url(#${id}_edge)`}
          />
          {/* Закрываем боковые стенки */}
          <path
            d={`
              M ${cx - rx} ${cy}
              A ${rx} ${ry} 0 0 0 ${cx + rx} ${cy}
              L ${cx + rx} ${cy + edgeH}
              A ${rx} ${ry * 0.55} 0 0 1 ${cx - rx} ${cy + edgeH}
              Z
            `}
            fill={`url(#${id}_edge)`}
          />

          {/* Рифление на торце */}
          {Array.from({ length: 28 }, (_, i) => {
            const t = i / 28;
            const angle = Math.PI + t * Math.PI; // нижние 180° видны
            const ex = cx + rx * Math.cos(angle);
            const ey = cy + ry * 0.55 * Math.sin(angle);
            if (Math.sin(angle) > 0) return null;
            return (
              <line
                key={i}
                x1={ex} y1={ey + edgeH * 0.1}
                x2={ex} y2={ey + edgeH * 0.9}
                stroke="rgba(255,180,30,0.18)"
                strokeWidth={s * 0.008}
              />
            );
          })}

          {/* === ЛИЦЕВАЯ СТОРОНА === */}
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${id}_face)`}/>

          {/* Ободок внешний — рифлёный */}
          {Array.from({ length: 52 }, (_, i) => {
            const a1 = (i / 52) * Math.PI * 2;
            const a2 = ((i + 0.35) / 52) * Math.PI * 2;
            const r1x = rx * 0.90, r1y = ry * 0.90;
            const r2x = rx * 0.98, r2y = ry * 0.98;
            return (
              <line
                key={i}
                x1={cx + r1x * Math.cos(a1)} y1={cy + r1y * Math.sin(a1)}
                x2={cx + r2x * Math.cos(a2)} y2={cy + r2y * Math.sin(a2)}
                stroke={i % 2 === 0 ? '#c9a030' : '#7a5008'}
                strokeWidth={s * 0.009}
                opacity="0.7"
              />
            );
          })}

          {/* Кольца обода */}
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="#c9a030" strokeWidth={s*0.016} opacity="0.55"/>
          <ellipse cx={cx} cy={cy} rx={rx*0.87} ry={ry*0.87} fill="none" stroke="#e8d060" strokeWidth={s*0.006} opacity="0.3"/>

          {/* Тень рельефа */}
          <ellipse cx={cx} cy={cy} rx={rx*0.87} ry={ry*0.87} fill={`url(#${id}_shadow)`}/>

          {/* Знак ₽ — рельефный */}
          <g filter={`url(#${id}_emboss)`}>
            {/* Тень символа */}
            <text
              x={cx + s*0.012} y={cy + ry*0.14 + s*0.018}
              textAnchor="middle" dominantBaseline="middle"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontWeight="bold"
              fontSize={ry * 0.88}
              fill="rgba(40,20,0,0.6)"
            >₽</text>
            {/* Сам символ */}
            <text
              x={cx} y={cy + ry*0.12}
              textAnchor="middle" dominantBaseline="middle"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontWeight="bold"
              fontSize={ry * 0.88}
              fill="#fff8b0"
              opacity="0.95"
            >₽</text>
          </g>

          {/* Блик — основной */}
          <ellipse
            cx={cx - rx*0.18} cy={cy - ry*0.3}
            rx={rx*0.42} ry={ry*0.28}
            fill={`url(#${id}_shine)`}
            style={{ transform: 'rotate(-18deg)', transformOrigin: `${cx - rx*0.18}px ${cy - ry*0.3}px` }}
          />

          {/* Блик по ободу */}
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${id}_rim)`}/>

          {/* Маленький яркий блик — бликовая точка */}
          <ellipse
            cx={cx - rx*0.3} cy={cy - ry*0.45}
            rx={rx*0.1} ry={ry*0.07}
            fill="rgba(255,255,230,0.9)"
            style={{ transform: 'rotate(-20deg)', transformOrigin: `${cx - rx*0.3}px ${cy - ry*0.45}px` }}
          />
        </svg>
      </div>
    </div>
  );
}
