type Star = { id: number; x: number; y: number; size: number; delay: number; lit: boolean };

interface Props {
  stars: Star[];
}

export default function StarsCanvas({ stars }: Props) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {stars.map(star => (
        <div
          key={star.id}
          className="star-dot"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: star.lit ? '#fffdf0' : 'rgba(200,210,255,0.4)',
            boxShadow: star.lit
              ? `0 0 ${star.size * 3}px ${star.size}px rgba(255,253,200,0.6)`
              : 'none',
            animation: star.lit
              ? `twinkle ${2 + star.delay * 0.5}s ease-in-out ${star.delay}s infinite`
              : `twinkle ${4 + star.delay}s ease-in-out ${star.delay}s infinite`,
            opacity: star.lit ? 0.85 : 0.25,
          }}
        />
      ))}
    </div>
  );
}
