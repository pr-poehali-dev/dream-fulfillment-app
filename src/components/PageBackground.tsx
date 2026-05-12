import { useRef, useState, useEffect } from "react";
import StarsCanvas from "@/components/StarsCanvas";
import WishesGallery from "@/components/WishesGallery";

const BG_IMAGE = "https://cdn.poehali.dev/projects/f2ec5eb9-318b-4d91-873e-4b30179226d6/bucket/44ca2f43-19c6-45a5-824f-8662569e1ee3.jpeg";

type Star = { id: number; x: number; y: number; size: number; delay: number; lit: boolean; amount?: number; wish?: string };

interface Props {
  stars: Star[];
}

export default function PageBackground({ stars }: Props) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgRect, setImgRect] = useState<{ top: number; height: number } | null>(null);

  const updateRect = () => {
    const img = imgRef.current;
    if (!img) return;
    const rect = img.getBoundingClientRect();
    // fixed-контейнер всегда top=0, поэтому top картинки = rect.top
    setImgRect({ top: rect.top, height: rect.height });
  };

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete) updateRect();
    img.addEventListener('load', updateRect);
    window.addEventListener('resize', updateRect);
    return () => {
      img.removeEventListener('load', updateRect);
      window.removeEventListener('resize', updateRect);
    };
  }, []);

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
          bottom: 0,
          left: 0,
          width: '100%',
          height: 'auto',
          display: 'block',
          filter: 'brightness(0.8) contrast(1.05)',
        }}
      />

      {/* Звёзды — позиционируются внутри картинки */}
      {imgRect && (
        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: imgRect.top,
          height: imgRect.height,
          pointerEvents: 'none',
        }}>
          <WishesGallery />
          <StarsCanvas stars={stars} />
        </div>
      )}
    </div>
  );
}