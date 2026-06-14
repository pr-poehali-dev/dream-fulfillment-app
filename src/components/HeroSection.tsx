import { useState } from "react";
import FulfilledModal from "@/components/FulfilledModal";
import HeroHeader from "@/components/HeroHeader";
import HeroIntro from "@/components/HeroIntro";
import HeroCtaButtons from "@/components/HeroCtaButtons";

type IntroPhase = "line1" | "line2" | "out" | "done";

interface Props {
  introPhase: IntroPhase;
  starsCount: number;
  onWellClick: () => void;
  onRandomStar: () => void;
  onFindStar: (number: number) => Promise<"ok" | "out_of_range" | "error">;
  onOpenMap: () => void;
}

export default function HeroSection({
  introPhase,
  starsCount,
  onWellClick,
  onRandomStar,
  onFindStar,
  onOpenMap,
}: Props) {
  const [showFulfilled, setShowFulfilled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <HeroHeader
        starsCount={starsCount}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onShowFulfilled={() => setShowFulfilled(true)}
      />

      {/* Hero */}
      <main
        className="relative z-10 flex flex-col items-center justify-center px-4 text-center"
        style={{
          minHeight: "calc(100vh - 80px)",
          paddingTop: "40px",
          paddingBottom: "40px",
        }}
      >
        <HeroIntro introPhase={introPhase} />

        <style>{`
          @keyframes starFlashBig {
            0%   { opacity: 0; transform: scale(0.6); filter: brightness(3); }
            15%  { opacity: 1; transform: scale(1.12); filter: brightness(2.5); }
            40%  { transform: scale(1.03); filter: brightness(1.4); }
            100% { opacity: 1; transform: scale(1); filter: brightness(1); }
          }
        `}</style>

        <HeroCtaButtons
          starsCount={starsCount}
          onWellClick={onWellClick}
          onRandomStar={onRandomStar}
          onFindStar={onFindStar}
          onOpenMap={onOpenMap}
        />
      </main>

      {showFulfilled && (
        <FulfilledModal onClose={() => setShowFulfilled(false)} />
      )}
    </>
  );
}