import { useState, useEffect } from "react";
import WishModal from "@/components/WishModal";
import WishCardModal from "@/components/WishCardModal";
import PageBackground from "@/components/PageBackground";
import HeroSection from "@/components/HeroSection";
import PageSections from "@/components/PageSections";
import { useSound } from "@/hooks/useSound";
import { getCategory, calcBrightness } from "@/components/WishStar";
import type { WishItem } from "@/components/WishStar";
import func2url from "../../backend/func2url.json";

type Star = {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  lit: boolean;
  amount?: number;
  wish?: string;
};

export default function Index() {
  const { playCoin, playSplash, playMagic, playStarAppear } = useSound();

  const [showModal, setShowModal] = useState(false);
  const [coinAnim, setCoinAnim] = useState(false);
  const [smokeAnim, setSmokeAnim] = useState(false);
  const [rippleAnim, setRippleAnim] = useState(false);
  const [stars, setStars] = useState<Star[]>([]);
  const [introPhase, setIntroPhase] = useState<
    "line1" | "line2" | "out" | "done"
  >("line1");
  const [starsCount, setStarsCount] = useState(0);
  const [copilkaAmount] = useState(0);
  const [angelsCount] = useState(0);
  const [altruistsCount] = useState(0);
  const [randomWish, setRandomWish] = useState<WishItem | null>(null);
  const [randomLoading, setRandomLoading] = useState(false);

  useEffect(() => {
    setStars([]);
    const t1 = setTimeout(() => setIntroPhase("line2"), 2500);
    const t2 = setTimeout(() => setIntroPhase("out"), 5000);
    const t3 = setTimeout(() => setIntroPhase("done"), 6200);

    // Загружаем реальный счётчик из БД
    fetch(func2url["get-wish-by-number"])
      .then((r) => r.json())
      .then((data) => {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
        if (parsed.total !== undefined) setStarsCount(parsed.total);
      })
      .catch(() => {});

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleWellClick = () => {
    if (coinAnim) return;
    playCoin();
    setCoinAnim(true);
    setTimeout(() => {
      playSplash();
      setRippleAnim(true);
    }, 1100);
    setTimeout(() => {
      playMagic();
      setSmokeAnim(true);
    }, 1300);
    setTimeout(() => {
      setCoinAnim(false);
      setRippleAnim(false);
      setSmokeAnim(false);
      setShowModal(true);
    }, 2200);
  };

  const handleRandomStar = async () => {
    if (randomLoading) return;
    setRandomLoading(true);
    try {
      const excludeParam = randomWish ? `?exclude=${randomWish.id}` : "";
      const res = await fetch(`${func2url["get-random-wish"]}${excludeParam}`);
      const raw = await res.json();
      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      const brightness = calcBrightness(parsed.amount, 10, 1000);
      const category = getCategory(Math.max(0.1, brightness));
      setRandomWish({
        id: parsed.id,
        x: parsed.x ?? 50,
        y: parsed.y ?? 50,
        amount: parsed.amount,
        wish: parsed.wish,
        name: parsed.name,
        avatar: parsed.avatar,
        brightness,
        category,
      });
    } catch {
      setRandomWish(null);
    } finally {
      setRandomLoading(false);
    }
  };

  const handleFindStar = async (
    number: number,
  ): Promise<"ok" | "out_of_range" | "error"> => {
    try {
      const res = await fetch(
        `${func2url["get-wish-by-number"]}?number=${number}`,
      );
      const raw = await res.json();
      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (res.status === 404 || parsed.error === "out_of_range")
        return "out_of_range";
      if (!res.ok) return "error";
      const brightness = calcBrightness(parsed.amount, 10, 1000);
      const category = getCategory(Math.max(0.1, brightness));
      setRandomWish({
        id: parsed.id,
        x: parsed.x ?? 50,
        y: parsed.y ?? 50,
        amount: parsed.amount,
        wish: parsed.wish,
        name: parsed.name,
        avatar: parsed.avatar,
        brightness,
        category,
      });
      return "ok";
    } catch {
      return "error";
    }
  };

  const handleWishSent = (amount: number, wish: string, starX?: number, starY?: number) => {
    setShowModal(false);
    setStarsCount((prev) => prev + 1);
    setTimeout(() => playStarAppear(), 300);
    const baseSize =
      amount >= 1000
        ? 3.5
        : amount >= 500
          ? 2.8
          : amount >= 100
            ? 2.2
            : amount >= 50
              ? 1.8
              : 1.3;
    const newStar: Star = {
      id: Date.now(),
      x: starX ?? (5 + Math.random() * 85),
      y: starY ?? (2 + Math.random() * 45),
      size: baseSize + Math.random() * 0.5,
      delay: Math.random() * 3,
      lit: true,
      amount,
      wish,
    };
    setStars((prev) => {
      const updated = prev.map((s) => ({ ...s, isNew: false }));
      return [...updated, { ...newStar, isNew: true }];
    });
    setTimeout(() => {
      setStars((prev) =>
        prev.map((s) => (s.id === newStar.id ? { ...s, isNew: false } : s)),
      );
    }, 3000);
  };

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: "#060810" }}
    >
      <PageBackground stars={stars} />

      <HeroSection
        introPhase={introPhase}
        starsCount={starsCount}
        onWellClick={handleWellClick}
        onRandomStar={handleRandomStar}
        onFindStar={handleFindStar}
      />

      <PageSections
        starsCount={starsCount}
        copilkaAmount={copilkaAmount}
        angelsCount={angelsCount}
        altruistsCount={altruistsCount}
      />

      {showModal && (
        <WishModal
          onClose={() => setShowModal(false)}
          onSent={handleWishSent}
        />
      )}

      {randomWish && (
        <WishCardModal wish={randomWish} onClose={() => setRandomWish(null)} />
      )}

      {randomLoading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              padding: "14px 24px",
              background: "rgba(6,8,22,0.9)",
              border: "1px solid rgba(201,168,76,0.3)",
              borderRadius: 99,
              color: "#c9a84c",
              fontFamily: '"Golos Text", sans-serif',
              fontSize: 14,
            }}
          >
            ✦ Ищем звезду...
          </div>
        </div>
      )}
    </div>
  );
}