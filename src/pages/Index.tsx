import { useState, useEffect } from "react";
import WishModal from "@/components/WishModal";
import VideoPreview from "@/components/VideoPreview";
import PageBackground from "@/components/PageBackground";
import HeroSection from "@/components/HeroSection";
import PageSections from "@/components/PageSections";
import { useSound } from "@/hooks/useSound";

type Star = { id: number; x: number; y: number; size: number; delay: number; lit: boolean; amount?: number };

export default function Index() {
  const { playCoin, playSplash, playMagic, playStarAppear } = useSound();
  const [showModal, setShowModal] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [coinAnim, setCoinAnim] = useState(false);
  const [smokeAnim, setSmokeAnim] = useState(false);
  const [rippleAnim, setRippleAnim] = useState(false);
  const [stars, setStars] = useState<Star[]>([]);
  const [introPhase, setIntroPhase] = useState<'line1' | 'line2' | 'out' | 'done'>('line1');
  const [starsCount, setStarsCount] = useState(0);
  const [copilkaAmount] = useState(34580);
  const [angelsCount] = useState(89);
  const [altruistsCount] = useState(23);

  useEffect(() => {
    const hasSeenVideo = localStorage.getItem("zagadai_seen_video");
    if (!hasSeenVideo) {
      setTimeout(() => setShowVideo(true), 500);
    }
    setStars([]);
    const t1 = setTimeout(() => setIntroPhase('line2'), 2500);
    const t2 = setTimeout(() => setIntroPhase('out'), 5000);
    const t3 = setTimeout(() => setIntroPhase('done'), 6200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
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

  const handleWishSent = (amount: number) => {
    setShowModal(false);
    setStarsCount(prev => prev + 1);
    setTimeout(() => playStarAppear(), 300);
    const baseSize = amount >= 1000 ? 3.5 : amount >= 500 ? 2.8 : amount >= 100 ? 2.2 : amount >= 50 ? 1.8 : 1.3;
    const newStar: Star = {
      id: Date.now(),
      x: 5 + Math.random() * 85,
      y: 2 + Math.random() * 45,
      size: baseSize + Math.random() * 0.5,
      delay: Math.random() * 3,
      lit: true,
      amount,
    };
    setStars(prev => {
      const updated = prev.map(s => ({ ...s, isNew: false }));
      return [...updated, { ...newStar, isNew: true }];
    });
    setTimeout(() => {
      setStars(prev => prev.map(s => s.id === newStar.id ? { ...s, isNew: false } : s));
    }, 3000);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: '#060810' }}>

      {showVideo && (
        <VideoPreview onClose={() => {
          localStorage.setItem("zagadai_seen_video", "1");
          setShowVideo(false);
        }} />
      )}

      <PageBackground stars={stars} />

      <HeroSection
        introPhase={introPhase}
        starsCount={starsCount}
        onWellClick={handleWellClick}
        onShowVideo={() => setShowVideo(true)}
      />

      <PageSections
        starsCount={starsCount}
        copilkaAmount={copilkaAmount}
        angelsCount={angelsCount}
        altruistsCount={altruistsCount}
        onShowVideo={() => setShowVideo(true)}
      />

      {showModal && (
        <WishModal onClose={() => setShowModal(false)} onSent={handleWishSent} />
      )}
    </div>
  );
}