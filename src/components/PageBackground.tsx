import StarsCanvas from "@/components/StarsCanvas";

const BG_IMAGE = "https://cdn.poehali.dev/projects/f2ec5eb9-318b-4d91-873e-4b30179226d6/bucket/44ca2f43-19c6-45a5-824f-8662569e1ee3.jpeg";

type Star = { id: number; x: number; y: number; size: number; delay: number; lit: boolean; amount?: number };

interface Props {
  stars: Star[];
}

export default function PageBackground({ stars }: Props) {
  return (
    <div className="fixed inset-0 z-0" style={{ background: '#060810' }}>
      <img
        src={BG_IMAGE}
        alt=""
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
      <StarsCanvas stars={stars} />
    </div>
  );
}