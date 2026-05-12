import StarsCanvas from "@/components/StarsCanvas";
import WishesGallery from "@/components/WishesGallery";

const BG_IMAGE = "https://cdn.poehali.dev/projects/f2ec5eb9-318b-4d91-873e-4b30179226d6/bucket/44ca2f43-19c6-45a5-824f-8662569e1ee3.jpeg";

type Star = { id: number; x: number; y: number; size: number; delay: number; lit: boolean; amount?: number; wish?: string };

interface Props {
  stars: Star[];
}

export default function PageBackground({ stars }: Props) {
  return (
    <div className="bg-root fixed inset-0 z-0" style={{ background: '#060810' }}>
      {/* Картинка — прибита к низу */}
      <img
        ref={imgRef}
        src={BG_IMAGE}
        alt=""
        onLoad={updateRect}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'bottom center',
          display: 'block',
          filter: 'brightness(0.8) contrast(1.05)',
        }}
      />

      {/* Звёзды поверх фона */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <WishesGallery />
        <StarsCanvas stars={stars} />
      </div>
    </div>
  );
}