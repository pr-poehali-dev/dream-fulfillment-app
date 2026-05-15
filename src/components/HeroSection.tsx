import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { useUser } from "@/context/UserContext";
import FulfilledModal from "@/components/FulfilledModal";
import func2url from "../../backend/func2url.json";

const vkAuthUrl = func2url["vk-auth"];

type IntroPhase = "line1" | "line2" | "out" | "done";

interface Props {
  introPhase: IntroPhase;
  starsCount: number;
  onWellClick: () => void;
  onRandomStar: () => void;
  onFindStar: (number: number) => Promise<"ok" | "out_of_range" | "error">;
}

export default function HeroSection({
  introPhase,
  starsCount,
  onWellClick,
  onRandomStar,
  onFindStar,
}: Props) {
  const { user, logout, login } = useUser();

  useEffect(() => {
    if (window.VKIDSDK) {
      const VKID = window.VKIDSDK;
      VKID.Config.init({
        app: 54589468,
        redirectUrl: "https://zagadai.online/vk-callback",
        responseMode: VKID.ConfigResponseMode.FormPost,
        source: VKID.ConfigSource.LOWCODE,
        scope: "email",
      });

      const oneTap = new VKID.OneTap();
      oneTap
        .render({
          container: document.getElementById("vkAuthContainer"),
          scheme: "dark",
          showAlternativeLogin: false,
        })
        .on(VKID.WidgetEvents.ERROR, (error) =>
          console.error("VK ID Error:", error),
        )
        .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, (payload) => {
          fetch(vkAuthUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              code: payload.code,
              device_id: payload.device_id,
              redirect_uri: "https://zagadai.online/vk-callback",
            }),
          })
            .then((r) => r.json())
            .then((data) => {
              if (data && data.id) {
                login({
                  id: data.id,
                  vk_id: data.vk_id,
                  name: data.name,
                  avatar_url: data.avatar_url,
                });
              } else {
                console.error("VK auth error:", data);
              }
            })
            .catch((error) => console.error("Ошибка авторизации VK:", error));
        });
    }
  }, []);

  const [showFulfilled, setShowFulfilled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [findOpen, setFindOpen] = useState(false);
  const [findValue, setFindValue] = useState("");
  const [findError, setFindError] = useState("");
  const [findLoading, setFindLoading] = useState(false);
  return (
    <>
      {/* Header */}
      <header className="relative z-10 px-6 py-5 md:px-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl" style={{ color: "#c9a84c" }}>
                ✦
              </span>
              <span
                className="font-cormorant text-xl font-medium tracking-widest uppercase"
                style={{ color: "#c9a84c" }}
              >
                ЗАГАДАЙ.ОНЛАЙН
              </span>
            </div>
            <div
              className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full"
              style={{
                background: "rgba(201,168,76,0.08)",
                border: "1px solid rgba(201,168,76,0.18)",
              }}
            >
              <span style={{ fontSize: 13 }}>⭐</span>
              <span className="font-golos text-xs">
                <span style={{ color: "#c9a84c", fontWeight: 600 }}>
                  {starsCount.toLocaleString("ru-RU")}
                </span>
                <span style={{ color: "rgba(200,210,240,0.35)" }}>
                  {" "}
                  / 146 745 098
                </span>
              </span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-golos">
            <a
              href="/rules"
              className="transition-colors"
              style={{ color: "rgba(200,210,240,0.6)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a84c")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(200,210,240,0.6)")
              }
            >
              Правила
            </a>
            <a
              href="/about"
              className="transition-colors"
              style={{ color: "rgba(200,210,240,0.6)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a84c")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(200,210,240,0.6)")
              }
            >
              О проекте
            </a>
            <button
              onClick={() => setShowFulfilled(true)}
              className="flex items-center gap-1.5 transition-colors font-golos text-sm"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgba(200,210,240,0.6)",
                padding: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a84c")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(200,210,240,0.6)")
              }
            >
              🔴 Исполненные мечты
            </button>
            {user ? (
              <div className="flex items-center gap-2">
                <a
                  href="/cabinet"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all font-golos"
                  style={{
                    border: "1px solid rgba(201,168,76,0.25)",
                    background: "rgba(201,168,76,0.06)",
                  }}
                >
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "1px solid rgba(201,168,76,0.4)",
                    }}
                  />
                  <span style={{ color: "#c9a84c", fontSize: 13 }}>
                    {user.name.split(" ")[0]}
                  </span>
                </a>
                <button
                  onClick={logout}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "rgba(200,210,240,0.4)",
                    padding: "4px",
                  }}
                  title="Выйти"
                >
                  <Icon name="LogOut" size={14} />
                </button>
              </div>
            ) : (
              <div id="vkAuthContainer"></div>
            )}
          </nav>
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen((o) => !o)}
            style={{
              color: "rgba(200,210,240,0.7)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
            }}
          >
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>

        {/* Счётчик звёзд — только мобильные */}
        <div className="md:hidden mt-2 flex items-center gap-1.5">
          <span style={{ fontSize: 13 }}>⭐</span>
          <span className="font-golos text-xs">
            <span style={{ color: "#c9a84c", fontWeight: 700 }}>
              {starsCount.toLocaleString("ru-RU")}
            </span>
            <span style={{ color: "rgba(200,210,240,0.4)" }}>
              {" "}
              / 146 745 098
            </span>
          </span>
        </div>
      </header>

      {/* Мобильное меню */}
      {mobileMenuOpen && (
        <div
          className="md:hidden relative z-20 flex flex-col gap-4 px-6 py-5 font-golos text-sm"
          style={{
            background: "rgba(6,8,16,0.97)",
            borderBottom: "1px solid rgba(201,168,76,0.15)",
          }}
        >
          <a
            href="/rules"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: "rgba(200,210,240,0.7)" }}
          >
            Правила
          </a>
          <a
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: "rgba(200,210,240,0.7)" }}
          >
            О проекте
          </a>
          <button
            onClick={() => {
              setShowFulfilled(true);
              setMobileMenuOpen(false);
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(200,210,240,0.7)",
              textAlign: "left",
              padding: 0,
              fontSize: 14,
              fontFamily: "inherit",
            }}
          >
            🔴 Исполненные мечты
          </button>
          {user ? (
            <div className="flex items-center gap-3">
              <a
                href="/cabinet"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "1px solid rgba(201,168,76,0.4)",
                  }}
                />
                <span style={{ color: "#c9a84c", fontSize: 13 }}>
                  {user.name.split(" ")[0]}
                </span>
              </a>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(200,210,240,0.4)",
                  padding: 0,
                }}
                title="Выйти"
              >
                <Icon name="LogOut" size={14} />
              </button>
            </div>
          ) : (
            <div id="vkAuthContainer"></div>
          )}
        </div>
      )}

      {/* Hero */}
      <main
        className="relative z-10 flex flex-col items-center justify-center px-4 text-center"
        style={{
          minHeight: "calc(100vh - 80px)",
          paddingTop: "40px",
          paddingBottom: "40px",
        }}
      >
        {/* Интро-вспышки */}
        {introPhase !== "done" && (
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
        )}

        <style>{`
          @keyframes starFlashBig {
            0%   { opacity: 0; transform: scale(0.6); filter: brightness(3); }
            15%  { opacity: 1; transform: scale(1.12); filter: brightness(2.5); }
            40%  { transform: scale(1.03); filter: brightness(1.4); }
            100% { opacity: 1; transform: scale(1); filter: brightness(1); }
          }
        `}</style>

        {/* CTA buttons */}
        <div
          className="animate-fade-in flex flex-wrap items-center justify-center gap-3"
          style={{
            animationDelay: "1s",
            opacity: 0,
            position: "absolute",
            bottom: "8%",
            left: 0,
            right: 0,
          }}
        >
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
        </div>

        {/* Панель поиска по номеру */}
        {findOpen && (
          <div
            className="animate-fade-in"
            style={{
              position: "absolute",
              bottom: "calc(8% + 56px)",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 20,
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
                color: "rgba(200,210,240,0.45)",
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
      </main>

      {showFulfilled && (
        <FulfilledModal onClose={() => setShowFulfilled(false)} />
      )}
    </>
  );
}
