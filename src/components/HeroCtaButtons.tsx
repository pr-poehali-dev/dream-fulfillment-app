import { useState } from "react";

interface Props {
  starsCount: number;
  onWellClick: () => void;
  onRandomStar: () => void;
  onFindStar: (number: number) => Promise<"ok" | "out_of_range" | "error">;
  onOpenMap: () => void;
}

export default function HeroCtaButtons({
  starsCount,
  onWellClick,
  onRandomStar,
  onFindStar,
  onOpenMap,
}: Props) {
  const [findOpen, setFindOpen] = useState(false);
  const [findValue, setFindValue] = useState("");
  const [findError, setFindError] = useState("");
  const [findLoading, setFindLoading] = useState(false);

  return (
    <div
      className="animate-fade-in"
      style={{
        animationDelay: "1s",
        opacity: 0,
        position: "absolute",
        bottom: "8%",
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        zIndex: 20,
      }}
    >
      {/* Панель поиска по номеру — всегда над кнопками */}
      {findOpen && (
        <div
          className="animate-fade-in"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            className="font-golos"
            style={{
              fontSize: 12,
              color: "rgba(200,210,240,0.85)",
              letterSpacing: "0.04em",
            }}
          >
            Введите номер от 1 до{" "}
            <span style={{ color: "#c9a84c" }}>
              {starsCount > 0 ? starsCount : "..."}
            </span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              autoFocus
              type="number"
              min={1}
              max={starsCount || undefined}
              value={findValue}
              onChange={(e) => {
                setFindValue(e.target.value);
                setFindError("");
              }}
              onKeyDown={async (e) => {
                if (e.key === "Enter" && findValue) {
                  setFindLoading(true);
                  const result = await onFindStar(Number(findValue));
                  setFindLoading(false);
                  if (result === "ok") {
                    setFindOpen(false);
                    setFindValue("");
                  } else if (result === "out_of_range")
                    setFindError(`Введите номер от 1 до ${starsCount}`);
                  else setFindError("Что-то пошло не так");
                }
              }}
              placeholder="№"
              style={{
                width: 90,
                padding: "8px 14px",
                borderRadius: 99,
                background: "rgba(20,25,40,0.9)",
                border: `1px solid ${findError ? "rgba(255,80,80,0.5)" : "rgba(201,168,76,0.3)"}`,
                color: "#f0e8d0",
                fontFamily: '"Golos Text", sans-serif',
                fontSize: 14,
                outline: "none",
                textAlign: "center",
              }}
            />
            <button
              disabled={!findValue || findLoading}
              onClick={async () => {
                if (!findValue) return;
                setFindLoading(true);
                const result = await onFindStar(Number(findValue));
                setFindLoading(false);
                if (result === "ok") {
                  setFindOpen(false);
                  setFindValue("");
                } else if (result === "out_of_range")
                  setFindError(`Введите номер от 1 до ${starsCount}`);
                else setFindError("Что-то пошло не так");
              }}
              className="font-golos"
              style={{
                padding: "8px 18px",
                borderRadius: 99,
                fontSize: 13,
                background:
                  findValue && !findLoading
                    ? "rgba(201,168,76,0.15)"
                    : "rgba(201,168,76,0.05)",
                border: "1px solid rgba(201,168,76,0.3)",
                color:
                  findValue && !findLoading
                    ? "#c9a84c"
                    : "rgba(201,168,76,0.35)",
                cursor: findValue && !findLoading ? "pointer" : "default",
              }}
            >
              {findLoading ? "..." : "→"}
            </button>
          </div>
          {findError && (
            <div
              className="font-golos"
              style={{ fontSize: 12, color: "rgba(255,100,100,0.85)" }}
            >
              {findError}
            </div>
          )}
        </div>
      )}

      {/* CTA кнопки */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-golos font-semibold transition-all"
          style={{
            background: "linear-gradient(135deg, #c9a84c, #8a6a20)",
            color: "#060810",
          }}
          onClick={onWellClick}
        >
          ✦ Загадать желание
        </button>
        <button
          onClick={onRandomStar}
          className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-golos glass-panel transition-all"
          style={{ color: "rgba(200,210,240,0.75)" }}
        >
          🎲 Случайная звезда
        </button>
        <button
          onClick={() => {
            setFindOpen((o) => !o);
            setFindValue("");
            setFindError("");
          }}
          className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-golos glass-panel transition-all"
          style={{ color: "rgba(200,210,240,0.75)" }}
        >
          🔍 Найти звезду
        </button>
        <button
          onClick={onOpenMap}
          className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-golos glass-panel transition-all"
          style={{ color: "rgba(200,210,240,0.75)" }}
        >
          🗺 Карта звёзд
        </button>
      </div>
    </div>
  );
}