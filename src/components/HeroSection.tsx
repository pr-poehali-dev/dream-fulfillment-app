import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";
import { useUser } from "@/context/UserContext"; // Убедитесь, что useUser возвращает и setUser
import FulfilledModal from "@/components/FulfilledModal";

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
  // ВАЖНО: Если в вашем useUser нет setUser, замените эту строку на:
  // const { user, logout } = useUser();
  // И напишите мне, как вы обновляете пользователя, чтобы я поправил функцию vkidOnSuccess.
  const { user, logout, setUser } = useUser();

  const [showFulfilled, setShowFulfilled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [findOpen, setFindOpen] = useState(false);
  const [findValue, setFindValue] = useState("");
  const [findError, setFindError] = useState("");
  const [findLoading, setFindLoading] = useState(false);

  // --- НАЧАЛО БЛОКА АВТОРИЗАЦИИ ---

  // Создаем ссылку на контейнер для кнопки VK
  const vkButtonContainer = useRef<HTMLDivElement>(null);

  // Этот эффект сработает при монтировании компонента и при изменении user
  useEffect(() => {
    // Проверяем, что контейнер существует и пользователь не залогинен
    if (vkButtonContainer.current && !user) {
      // Создаем скрипт для загрузки SDK
      const script = document.createElement("script");
      script.src = "https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js";
      script.async = true;
      script.onload = () => {
        if ("VKIDSDK" in window) {
          const VKID = window.VKIDSDK;
          try {
            VKID.Config.init({
              app: 54589468,
              redirectUrl: "https://zagadai.online/vk-callback",
              responseMode: VKID.ConfigResponseMode.Callback,
              source: VKID.ConfigSource.LOWCODE,
              scope: "",
            });

            const oneTap = new VKID.OneTap();
            oneTap.render({
              container: vkButtonContainer.current,
              scheme: "dark",
              showAlternativeLogin: true,
              oauthList: ["mail_ru", "ok_ru"],
            });

            oneTap
              .on(VKID.WidgetEvents.ERROR, vkidOnError)
              .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, (payload) => {
                const code = payload.code;
                const deviceId = payload.deviceId;
                VKID.Auth.exchangeCode(code, deviceId)
                  .then(vkidOnSuccess)
                  .catch(vkidOnError);
              });
          } catch (error) {
            console.error("Ошибка инициализации VK ID:", error);
          }
        }
      };
      document.body.appendChild(script);
    }

    // Очистка: удаляем скрипт при размонтировании компонента
    return () => {
      const existingScript = document.querySelector(
        'script[src="https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js"]',
      );
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, [user]); // Зависимость от user

  function vkidOnSuccess(data) {
    console.log("Успешный вход:", data);
    // ВАЖНО: Обновляем состояние пользователя в контексте
    if (setUser && data.account) {
      const vkUser = {
        id: data.account.id,
        name: `${data.account.first_name} ${data.account.last_name}`,
        avatar_url: data.account.photo,
      };
      setUser(vkUser); // Это заставит компонент перерендериться и скрыть кнопку входа
    }
  }

  function vkidOnError(error) {
    console.error("Ошибка авторизации:", error);
    alert("Произошла ошибка при попытке входа через ВК. Попробуйте позже.");
  }

  // --- КОНЕЦ БЛОКА АВТОРИЗАЦИИ ---

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

            {/* БЛОК АВТОРИЗАЦИИ (ДЛЯ ДЕСКТОПА) */}
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
              // Если пользователя нет - показываем кнопку VK (или её контейнер)
              <div ref={vkButtonContainer} style={{ height: "38px" }} />
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
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              color: "rgba(255,255,255,.7)",
              padding: "unset",
              fontSize: "inherit",
              fontFamily: "inherit",
            }}
          >
            🔴 Исполненные мечты
          </button>
          {/* БЛОК АВТОРИЗАЦИИ (ДЛЯ МОБИЛЬНОГО МЕНЮ) */}
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
                    border: "1px solid rgba(255,179,99,.3)",
                  }}
                />
                <span style={{ color: "#ffb333", fontSize: "inherit" }}>
                  {user.name.split(" ")[0]}
                </span>
              </a>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(255,255,255,.4)",
                  padding: "unset",
                }}
                title="Выйти"
              >
                <Icon name="LogOut" size={14} />
              </button>
            </div>
          ) : (
            // Если пользователя нет - показываем кнопку VK в мобильном меню
            <div
              ref={vkButtonContainer}
              style={{ height: "auto", minHeight: "38px" }}
            />
          )}
        </div>
      )}

      {/* Hero */}
      <main
        className="relative z-10 flex flex-col items-center justify-center px-4 text-center"
        style={{
          minHeight: "calc(100vh - 88px)",
          paddingTop: "calc(4rem + env(safe-area-inset-top))",
          paddingBottom: "calc(4rem + env(safe-area-inset-bottom))",
        }}
      >
        {/* Интро-вспышки */}
        {introPhase !== "done" && (
          <div
            style={{
              position: "absolute",
              inset:
                "env(safe-area-inset-top) auto auto env(safe-area-inset-bottom)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              paddingTop: "calc(6vh + env(safe-area-inset-top))",
              zIndex: 3,
              pointerEvents: "none",
            }}
          >
            {/* Строка 1 */}
            <div
              style={{
                transition: "opacity .8s ease-out , transform .8s ease-out",
                opacity:
                  introPhase === "line1" ||
                  introPhase === "line2" ||
                  introPhase === "out"
                    ? "1"
                    : "none",
                transform:
                  introPhase === "line1" ||
                  introPhase === "line2" ||
                  introPhase === "out"
                    ? "translateY(calc(-5vh - env(safe-area-inset-top)))"
                    : "translateY(calc(-5vh - env(safe-area-inset-top)) - 3vh)",
                marginBottom: "calc(1.7rem + env(safe-area-inset-top))",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "calc(.7rem + env(safe-area-inset-top))",
                  animation: `starFlashBig .9s ease-out both`,
                }}
              >
                <span
                  style={{
                    fontSize:
                      "clamp(3rem , calc(3rem + (5 * (1vw - .7rem))) , calc(3rem + (5 * (7vw - .7rem))))",
                    lineHeight: 0.9,
                    filter: `drop-shadow(calc(4px + .3vw) calc(4px + .3vw) calc(9px + .7vw) #fffde) drop-shadow(calc(8px + .6vw) calc(8px + .6vw) calc(37px + .7vw) #ffd73d)`,
                  }}
                >
                  ✦
                </span>
              </div>
              <p
                className="font-cormorant"
                style={{
                  fontSize:
                    "clamp(1.7rem , calc(1.7rem + (5 * (1vw - .7rem))) , calc(1.7rem + (5 * (7vw - .7rem))))",
                  fontWeight: "var(--font-weight-light)",
                  color: "#fdeacf",
                  letterSpacing: "var(--letter-spacing-wider)",
                  animation: `starFlashBig .9s ease-out both`,
                  textShadow: `calc(4px + .3vw) calc(4px + .3vw) calc(9px + .7vw) rgba(255 , 255 , 255 , .9) , calc(8px + .6vw) calc(8px + .6vw) calc(37px + .7vw) rgba(255 , 196 , 67 , .7)`,
                }}
              >
                Мечтай вслух — тебя услышат
              </p>
            </div>

            {/* Строка 2 */}
            <div
              style={{
                transition: `opacity .9s ease-out , transform .9s ease-out`,
                opacity:
                  introPhase === "line2" || introPhase === "out" ? "1" : "none",
                transform:
                  introPhase === "line2" || introPhase === "out"
                    ? "translateY(calc(-5vh - env(safe-area-inset-top)))"
                    : "translateY(calc(-5vh - env(safe-area-inset-top)) - 3vh)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "calc(.7rem + env(safe-area-inset-top))",
                }}
              >
                <span
                  style={{
                    fontSize:
                      "clamp(3rem , calc(3rem + (5 * (1vw - .7rem))) , calc(3rem + (5 * (7vw - .7rem))))",
                    lineHeight: 0.9,
                    opacity:
                      introPhase === "line2" || introPhase === "out"
                        ? "1"
                        : "none",
                    transition: `opacity .9s ease-out`,
                    filter: `drop-shadow(calc(4px + .3vw) calc(4px + .3vw) calc(9px + .7vw) #fffde) drop-shadow(calc(8px + .6vw) calc(8px + .6vw) calc(37px + .7vw) #ffd73d)`,
                  }}
                >
                  ✦
                </span>
              </div>

              <p
                className="font-cormorant"
                style={{
                  fontSize:
                    "clamp(.9rem , calc(.9rem + (5 * (1vw - .7rem))) , calc(.9rem + (5 * (7vw - .7rem))))",
                  fontWeight: "var(--font-weight-light)",
                  fontStyle: "italic",
                  color: "#ffb333",
                  letterSpacing: "var(--letter-spacing-wider)",
                }}
              >
                И кто-то твою мечту исполнит
              </p>
            </div>
          </div>
        )}

        <style>{`
         @keyframes starFlashBig {
           from { opacity:.6; transform : scale(.9); filter:brightness(.9); }
           to   { opacity:.9; transform : scale(1); filter:brightness(.9); }
         }
       `}</style>

        {/* CTA buttons */}
        <div
          className="animate-fade-in flex flex-wrap items-center justify-center gap-3"
          style={{
            animationDelay: "calc(.8s)",
            opacity: "none",
            position: "absolute",
            bottom:
              "calc((env(safe-area-inset-bottom) + env(safe-area-inset-top)) / -4)",
            left: "env(safe-area-inset-left)",
            right: "env(safe-area-inset-right)",
          }}
        >
          <button
            onClick={onWellClick}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-golos font-semibold transition-all"
            style={{
              background:
                "linear-gradient(to bottom right , #ffb333 , #ffb333)",
              color: "#fff",
            }}
          >
            ✦ Загадать желание
          </button>

          <button
            onClick={onRandomStar}
            className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-golos glass-panel transition-all"
            style={{ color: "#fff" }}
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
            style={{ color: "#fff" }}
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
              bottom:
                "calc((env(safe-area-inset-bottom) + env(safe-area-inset-top)) / -4 + calc((env(safe-area-inset-bottom) + env(safe-area-inset-top)) / -8))",
              left: "calc(env(safe-area-inset-left) + env(safe-area-inset-right)) / -4",
              transform: "translateX(-5%)",
            }}
          ></div>
        )}
      </main>

      {showFulfilled && (
        <FulfilledModal onClose={() => setShowFulfilled(false)} />
      )}
    </>
  );
}
