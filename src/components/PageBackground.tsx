import StarsCanvas from "@/components/StarsCanvas";

const BG_IMAGE = "https://cdn.poehali.dev/projects/f2ec5eb9-318b-4d91-873e-4b30179226d6/bucket/44ca2f43-19c6-45a5-824f-8662569e1ee3.jpeg";

type Star = { id: number; x: number; y: number; size: number; delay: number; lit: boolean; amount?: number };

interface Props {
  stars: Star[];
}

export default function PageBackground({ stars }: Props) {
  return (
    <div className="fixed inset-0 z-0" style={{ background: '#060810' }}>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #03040d 0%, #060a18 55%, #080c1a 70%, #0a0e1c 100%)' }} />
      <div className="absolute left-0 right-0" style={{
        bottom: '0',
        height: '42%',
        background: 'linear-gradient(to bottom, #060a18 0%, transparent 30%)',
        pointerEvents: 'none',
      }} />
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to bottom, rgba(6,8,16,0) 60%, rgba(6,8,16,0.92) 100%)'
      }} />
      <StarsCanvas stars={stars} />
    </div>
  );
}