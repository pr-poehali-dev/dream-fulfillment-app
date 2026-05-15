type IntroPhase = "line1" | "line2" | "out" | "done";

interface Props {
  introPhase: IntroPhase;
}

export default function HeroIntro({ introPhase }: Props) {
  if (introPhase === "done") return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "6vh",
        zIndex: 30,
        pointerEvents: "none",
        transition: "opacity 1.2s ease",
        opacity: introPhase === "out" ? 0 : 1,
      }}
    >
      {/* Строка 1 */}
      <div
        style={{
          transition: "opacity 0.8s ease, transform 0.8s ease",
          opacity:
            introPhase === "line1" ||
            introPhase === "line2" ||
            introPhase === "out"
              ? 1
              : 0,
          transform:
            introPhase === "line1" ||
            introPhase === "line2" ||
            introPhase === "out"
              ? "translateY(0)"
              : "translateY(20px)",
          marginBottom: "1.2rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "0.5rem",
            animation: "starFlashBig 1.2s ease-out both",
          }}
        >
          <span
            style={{
              fontSize: 32,
              lineHeight: 1,
              filter:
                "drop-shadow(0 0 14px #fffde0) drop-shadow(0 0 30px #ffd700)",
            }}
          >
            ✦
          </span>
        </div>
        <p
          className="font-cormorant"
          style={{
            fontSize: "clamp(1.6rem, 5vw, 3.5rem)",
            fontWeight: 300,
            color: "#f0e8d0",
            letterSpacing: "0.05em",
            animation: "starFlashBig 1.0s ease-out both",
            textShadow:
              "0 0 40px rgba(255,220,80,0.5), 0 0 80px rgba(255,180,30,0.2)",
          }}
        >
          Мечтай вслух — тебя услышат
        </p>
      </div>

      {/* Строка 2 */}
      <div
        style={{
          transition: "opacity 1s ease, transform 1s ease",
          opacity: introPhase === "line2" || introPhase === "out" ? 1 : 0,
          transform:
            introPhase === "line2" || introPhase === "out"
              ? "translateY(0)"
              : "translateY(20px)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "0.5rem",
            animation:
              introPhase === "line2"
                ? "starFlashBig 1.2s ease-out both"
                : "none",
          }}
        >
          <span
            style={{
              fontSize: 28,
              lineHeight: 1,
              filter:
                "drop-shadow(0 0 12px #fffde0) drop-shadow(0 0 24px #ffd700)",
              opacity:
                introPhase === "line2" || introPhase === "out" ? 1 : 0,
              transition: "opacity 0.8s ease",
            }}
          >
            ✦
          </span>
        </div>
        <p
          className="font-cormorant"
          style={{
            fontSize: "clamp(1.2rem, 3.5vw, 2.2rem)",
            fontWeight: 300,
            fontStyle: "italic",
            color: "rgba(201,168,76,0.9)",
            letterSpacing: "0.04em",
            animation:
              introPhase === "line2"
                ? "starFlashBig 1.0s ease-out both"
                : "none",
            textShadow: "0 0 30px rgba(255,200,50,0.4)",
          }}
        >
          И кто-то твою мечту исполнит
        </p>
      </div>
    </div>
  );
}
