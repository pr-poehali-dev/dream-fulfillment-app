interface Props {
  size?: number;
  glow?: boolean;
}

export default function GoldCoin({ size = 80, glow = true }: Props) {
  const W = size;
  const H = size * 1.1;

  const faceCX = W * 0.44;
  const faceCY = H * 0.47;
  const faceRX = W * 0.40;
  const faceRY = H * 0.44;
  const edgeW  = W * 0.16;

  const id = `rc_${size}`;

  return (
    <div style={{ display: 'inline-block', position: 'relative' }}>
      <style>{`
        @keyframes coin-wobble-v {
          0%   { transform: rotate(-4deg) translateY(0px);  }
          30%  { transform: rotate(2deg)  translateY(-4px); }
          60%  { transform: rotate(-2deg) translateY(-1px); }
          80%  { transform: rotate(3deg)  translateY(-3px); }
          100% { transform: rotate(-4deg) translateY(0px);  }
        }
        .coin-v-wobble {
          animation: coin-wobble-v 4s ease-in-out infinite;
          transform-origin: 50% 95%;
        }
        .coin-v-wobble:hover {
          animation-play-state: paused;
          transform: rotate(0deg) scale(1.06) translateY(-2px) !important;
          transition: transform 0.3s ease;
        }
      `}</style>

      <div
        className={glow ? 'coin-v-wobble' : ''}
        style={{
          filter: glow
            ? 'drop-shadow(0 12px 28px rgba(80,50,0,0.8)) drop-shadow(0 0 20px rgba(220,170,30,0.45))'
            : 'drop-shadow(0 4px 8px rgba(0,0,0,0.7))',
        }}
      >
        <svg
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block', overflow: 'visible' }}
        >
          <defs>
            <radialGradient id={`${id}_face`} cx="34%" cy="28%" r="72%">
              <stop offset="0%"   stopColor="#fff7a0"/>
              <stop offset="12%"  stopColor="#fce060"/>
              <stop offset="30%"  stopColor="#e8b820"/>
              <stop offset="55%"  stopColor="#c49010"/>
              <stop offset="78%"  stopColor="#a07010"/>
              <stop offset="100%" stopColor="#7a5208"/>
            </radialGradient>

            <linearGradient id={`${id}_edge`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#c49010"/>
              <stop offset="25%"  stopColor="#e8c030"/>
              <stop offset="55%"  stopColor="#b07810"/>
              <stop offset="80%"  stopColor="#7a5008"/>
              <stop offset="100%" stopColor="#3a2404"/>
            </linearGradient>

            <radialGradient id={`${id}_shine1`} cx="28%" cy="22%" r="48%">
              <stop offset="0%"   stopColor="rgba(255,255,220,0.9)"/>
              <stop offset="35%"  stopColor="rgba(255,245,150,0.45)"/>
              <stop offset="100%" stopColor="rgba(255,220,80,0)"/>
            </radialGradient>

            <linearGradient id={`${id}_edge_shine`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor="rgba(255,240,120,0.7)"/>
              <stop offset="30%"  stopColor="rgba(220,180,40,0.3)"/>
              <stop offset="100%" stopColor="rgba(100,60,0,0.1)"/>
            </linearGradient>

            <clipPath id={`${id}_clip`}>
              <ellipse cx={faceCX} cy={faceCY} rx={faceRX} ry={faceRY}/>
            </clipPath>
          </defs>

          {/* Тень */}
          <ellipse cx={W*0.52} cy={H*0.97} rx={W*0.38} ry={H*0.03} fill="rgba(0,0,0,0.5)"/>

          {/* Грань — правый торец */}
          <path
            d={`
              M ${faceCX + faceRX} ${faceCY - faceRY * 0.12}
              C ${faceCX + faceRX + edgeW*0.3} ${faceCY - faceRY*0.5},
                ${faceCX + faceRX + edgeW*0.6} ${faceCY - faceRY*0.2},
                ${faceCX + faceRX + edgeW}     ${faceCY - faceRY * 0.08}
              L ${faceCX + faceRX + edgeW}     ${faceCY + faceRY * 0.88}
              C ${faceCX + faceRX + edgeW*0.6} ${faceCY + faceRY*1.05},
                ${faceCX + faceRX + edgeW*0.3} ${faceCY + faceRY*1.02},
                ${faceCX + faceRX}             ${faceCY + faceRY * 0.92}
              Z
            `}
            fill={`url(#${id}_edge)`}
          />
          <path
            d={`
              M ${faceCX + faceRX} ${faceCY - faceRY * 0.12}
              C ${faceCX + faceRX + edgeW*0.3} ${faceCY - faceRY*0.5},
                ${faceCX + faceRX + edgeW*0.6} ${faceCY - faceRY*0.2},
                ${faceCX + faceRX + edgeW}     ${faceCY - faceRY * 0.08}
              L ${faceCX + faceRX + edgeW}     ${faceCY + faceRY * 0.88}
              C ${faceCX + faceRX + edgeW*0.6} ${faceCY + faceRY*1.05},
                ${faceCX + faceRX + edgeW*0.3} ${faceCY + faceRY*1.02},
                ${faceCX + faceRX}             ${faceCY + faceRY * 0.92}
              Z
            `}
            fill={`url(#${id}_edge_shine)`}
            opacity="0.5"
          />

          {/* Рифление на торце */}
          {Array.from({ length: 22 }, (_, i) => {
            if (i % 2 !== 0) return null;
            const t = i / 21;
            const y = faceCY - faceRY * 0.1 + t * (faceRY * 1.02);
            return (
              <line key={i}
                x1={faceCX + faceRX + edgeW*0.05} y1={y}
                x2={faceCX + faceRX + edgeW*0.92} y2={y + size*0.01}
                stroke="rgba(255,200,50,0.22)" strokeWidth={H*0.008}
              />
            );
          })}

          {/* Лицевая сторона */}
          <ellipse cx={faceCX} cy={faceCY} rx={faceRX} ry={faceRY} fill={`url(#${id}_face)`}/>

          {/* Рифлёный ободок */}
          {Array.from({ length: 60 }, (_, i) => {
            const a1 = (i / 60) * Math.PI * 2;
            const a2 = ((i + 0.38) / 60) * Math.PI * 2;
            const bright = Math.cos(a1 - Math.PI * 0.3) > 0.3;
            return (
              <line key={i}
                x1={faceCX + faceRX*0.89 * Math.cos(a1)} y1={faceCY + faceRY*0.89 * Math.sin(a1)}
                x2={faceCX + faceRX*0.975 * Math.cos(a2)} y2={faceCY + faceRY*0.975 * Math.sin(a2)}
                stroke={bright ? '#e8c840' : '#7a5008'}
                strokeWidth={W*0.008}
                opacity={bright ? '0.8' : '0.5'}
              />
            );
          })}

          {/* Кольца обода */}
          <ellipse cx={faceCX} cy={faceCY} rx={faceRX} ry={faceRY}
            fill="none" stroke="#c9a030" strokeWidth={W*0.018} opacity="0.6"/>
          <ellipse cx={faceCX} cy={faceCY} rx={faceRX*0.86} ry={faceRY*0.86}
            fill="none" stroke="#e8d060" strokeWidth={W*0.006} opacity="0.3"/>

          {/* Знак ₽ — тиснение */}
          <g clipPath={`url(#${id}_clip)`}>
            {/* Тёмная подложка — углубление */}
            <text
              x={faceCX + W*0.016} y={faceCY + H*0.022}
              textAnchor="middle" dominantBaseline="middle"
              fontFamily="'Arial Black', 'Arial Bold', Arial, sans-serif"
              fontWeight="900"
              fontSize={faceRY * 1.05}
              fill="rgba(70,35,0,0.8)"
              style={{ userSelect: 'none' }}
            >₽</text>
            {/* Основной символ — тёмно-золотой как на фото */}
            <text
              x={faceCX} y={faceCY + H*0.005}
              textAnchor="middle" dominantBaseline="middle"
              fontFamily="'Arial Black', 'Arial Bold', Arial, sans-serif"
              fontWeight="900"
              fontSize={faceRY * 1.05}
              fill="#b87c08"
              opacity="0.88"
              style={{ userSelect: 'none' }}
            >₽</text>
            {/* Блик на выступающих гранях символа */}
            <text
              x={faceCX - W*0.007} y={faceCY - H*0.012}
              textAnchor="middle" dominantBaseline="middle"
              fontFamily="'Arial Black', 'Arial Bold', Arial, sans-serif"
              fontWeight="900"
              fontSize={faceRY * 1.05}
              fill="rgba(255,225,60,0.22)"
              style={{ userSelect: 'none' }}
            >₽</text>
          </g>

          {/* Большой мягкий блик сверху-слева */}
          <ellipse
            cx={faceCX - faceRX*0.15} cy={faceCY - faceRY*0.32}
            rx={faceRX*0.55} ry={faceRY*0.38}
            fill={`url(#${id}_shine1)`}
            clipPath={`url(#${id}_clip)`}
            style={{ transform: 'rotate(-12deg)', transformOrigin: `${faceCX - faceRX*0.15}px ${faceCY - faceRY*0.32}px` }}
          />

          {/* Зеркальный блик — яркая точка */}
          <ellipse
            cx={faceCX - faceRX*0.32} cy={faceCY - faceRY*0.52}
            rx={faceRX*0.1} ry={faceRY*0.07}
            fill="rgba(255,255,230,0.95)"
            clipPath={`url(#${id}_clip)`}
            style={{ transform: 'rotate(-15deg)', transformOrigin: `${faceCX - faceRX*0.32}px ${faceCY - faceRY*0.52}px` }}
          />
        </svg>
      </div>
    </div>
  );
}
