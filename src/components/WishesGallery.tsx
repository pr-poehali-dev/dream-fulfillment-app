import { useEffect, useState } from "react";
import WishStar, { WishItem } from "@/components/WishStar";

export default function WishesGallery() {
  const [wishes, setWishes] = useState<WishItem[]>([]);

  useEffect(() => {
    // wishes will be loaded from backend
  }, []);

  return (
    <div style={{ position: 'absolute', top: 80, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 5 }}>
      {wishes.map(wish => (
        <WishStar key={wish.id} wish={wish} />
      ))}
    </div>
  );
}