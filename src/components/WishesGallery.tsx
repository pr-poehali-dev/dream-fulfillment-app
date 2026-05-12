import { useEffect, useState } from "react";
import WishStar, { WishItem, calcBrightness, getCategory } from "@/components/WishStar";

const TEST_WISHES: Omit<WishItem, 'brightness' | 'category'>[] = [
  { id: 1, x: 8,  y: 8,  amount: 10,   name: "Алина М.",    avatar: "https://i.pravatar.cc/100?img=1",  wish: "Хочу найти работу мечты в большой компании" },
  { id: 2, x: 18, y: 14, amount: 50,   name: "Дмитрий К.",  avatar: "https://i.pravatar.cc/100?img=2",  wish: "Мечтаю о своей квартире в Москве" },
  { id: 3, x: 30, y: 6,  amount: 120,  name: "Мария С.",    avatar: "https://i.pravatar.cc/100?img=3",  wish: "Хочу объехать всю Европу за лето" },
  { id: 4, x: 55, y: 10, amount: 300,  name: "Игорь Л.",    avatar: "https://i.pravatar.cc/100?img=4",  wish: "Хочу открыть свой ресторан" },
  { id: 5, x: 72, y: 7,  amount: 500,  name: "Светлана Р.", avatar: "https://i.pravatar.cc/100?img=5",  wish: "Мечтаю о счастливой семье и большом доме" },
  { id: 6, x: 85, y: 15, amount: 800,  name: "Андрей П.",   avatar: "https://i.pravatar.cc/100?img=6",  wish: "Хочу запустить стартап и стать миллионером" },
  { id: 7, x: 42, y: 18, amount: 1200, name: "Елена В.",    avatar: "https://i.pravatar.cc/100?img=7",  wish: "Хочу победить в международном конкурсе" },
  { id: 8, x: 63, y: 22, amount: 2500, name: "Николай Ф.",  avatar: "https://i.pravatar.cc/100?img=8",  wish: "Мечтаю о собственной яхте" },
  { id: 9, x: 22, y: 25, amount: 5000, name: "Ольга Т.",    avatar: "https://i.pravatar.cc/100?img=9",  wish: "Хочу чтобы вся семья была здорова и счастлива" },
  { id: 10, x: 90, y: 28, amount: 10000, name: "Артём Ш.", avatar: "https://i.pravatar.cc/100?img=10", wish: "Мечтаю изменить мир к лучшему" },
];

function computeWishes(raw: typeof TEST_WISHES): WishItem[] {
  const amounts = raw.map(w => w.amount);
  const minA = Math.max(Math.min(...amounts), 10);
  const maxA = Math.max(...amounts);
  return raw.map(w => {
    const brightness = calcBrightness(w.amount, minA, maxA);
    return { ...w, brightness, category: getCategory(brightness) };
  });
}

export default function WishesGallery() {
  const [wishes, setWishes] = useState<WishItem[]>(() => computeWishes(TEST_WISHES));

  useEffect(() => {
    const interval = setInterval(() => {
      setWishes(computeWishes(TEST_WISHES));
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'absolute', top: 80, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'auto' }}>
        {wishes.map(wish => (
          <WishStar key={wish.id} wish={wish} />
        ))}
      </div>
    </div>
  );
}