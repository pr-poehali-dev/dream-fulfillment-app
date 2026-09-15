import StarsCanvas from "@/components/StarsCanvas";
import WishesGallery from "@/components/WishesGallery";

const MOON_IMAGE = "/moon-glow.png";
const WELL_STRIP_IMAGE = "/well-strip.png";

type Star = { id: number; x: number; y: number; size: number; delay: number; lit: boolean; amount?: number; wish?: string };

interface Props {
  stars: Star[];
}

export default function PageBackground({ stars }: Props) {
  return (
    <div
      className="bg-root fixed inset-0 z-0"
      style={{ background: '#05060d' }}
    >
      {/* Бесшовное небо на весь экран — никаких полос по бокам на любом
          соотношении сторон, потому что тут просто заливка цветом неба */}
      <div style={{ position: 'absolute', inset: 0, background: '#05060d' }} />

      {/* Луна — отдельная картинка с прозрачными краями, наложенная поверх
          неба справа сверху. Не привязана к квадратному боксу. */}
      <img
        src={MOON_IMAGE}
        alt=""
        style={{
          position: 'absolute',
          top: '4%',
          right: '4%',
          width: 'min(32vw, 32vh)',
          maxWidth: 420,
          height: 'auto',
          pointerEvents: 'none',
        }}
      />

      {/* Колодец + море — прижаты к низу экрана, высота зафиксирована в vh,
          поэтому линия горизонта всегда на одной и той же % высоты экрана
          на любом устройстве (важно для разметки зоны звёзд). Сверху —
          градиент-накладка того же цвета, что и небо: гарантированно
          прячет любой стык независимо от обрезки картинки. */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '46vh',
          maxHeight: '70%',
          overflow: 'hidden',
        }}
      >
        <img
          src={WELL_STRIP_IMAGE}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            objectFit: 'cover',
            objectPosition: 'center bottom',
            filter: 'brightness(0.85) contrast(1.05)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, #05060d 0%, rgba(5,6,13,0) 22%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Звёзды раскиданы по всему видимому небу */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <WishesGallery />
        <StarsCanvas stars={stars} />
      </div>
    </div>
  );
}