import { useEffect } from "react";
import Icon from "@/components/ui/icon";
import { useUser } from "@/context/UserContext";
import func2url from "../../backend/func2url.json";

const vkAuthUrl = func2url["vk-auth"];

interface Props {
  starsCount: number;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean | ((o: boolean) => boolean)) => void;
  onShowFulfilled: () => void;
}

export default function HeroHeader({
  starsCount,
  mobileMenuOpen,
  setMobileMenuOpen,
  onShowFulfilled,
}: Props) {
  const { user, logout, login } = useUser();

  useEffect(() => {
    if (!window.VKIDSDK) return;
    const VKID = window.VKIDSDK;

    const array = new Uint8Array(48);
    crypto.getRandomValues(array);
    const codeVerifier = btoa(String.fromCharCode(...array))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
    localStorage.setItem("vk_code_verifier", codeVerifier);

    crypto.subtle
      .digest("SHA-256", new TextEncoder().encode(codeVerifier))
      .then((hashBuffer) => {
        const codeChallenge = btoa(
          String.fromCharCode(...new Uint8Array(hashBuffer)),
        )
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=/g, "");

        VKID.Config.init({
          app: 54589468,
          redirectUrl: "https://zagadai.online/vk-callback",
          source: VKID.ConfigSource.LOWCODE,
          scope: "email",
          codeChallenge,
        });

        const oneTap = new VKID.OneTap();
        oneTap
          .render({
            container: document.getElementById("vkAuthDesktop"),
            scheme: "dark",
            showAlternativeLogin: false,
            styles: {
              button: {
                background: "rgba(201,168,76,0.1)",
                border: "1px solid rgba(201,168,76,0.4)",
              },
              text: { color: "#c9a84c" },
            },
          })
          .on(VKID.WidgetEvents.ERROR, (error: unknown) =>
            console.error("VK ID Error:", error),
          )
          .on(
            VKID.OneTapInternalEvents.LOGIN_SUCCESS,
            (payload: { code: string; device_id: string; state?: string }) => {
              const storedVerifier =
                localStorage.getItem("vk_code_verifier") || "";
              fetch(vkAuthUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  code: payload.code,
                  device_id: payload.device_id,
                  code_verifier: storedVerifier,
                  state: payload.state,
                  redirect_uri: "https://zagadai.online/vk-callback",
                }),
              })
                .then((r) => r.json())
                .then((data) => {
                  if (data && data.id) {
                    localStorage.removeItem("vk_code_verifier");
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
                .catch((e) => console.error("Ошибка авторизации VK:", e));
            },
          );

        const oneTapMobile = new VKID.OneTap();
        oneTapMobile
          .render({
            container: document.getElementById("vkAuthMobile"),
            scheme: "dark",
            showAlternativeLogin: false,
            styles: {
              button: {
                background: "rgba(201,168,76,0.1)",
                border: "1px solid rgba(201,168,76,0.4)",
              },
              text: { color: "#c9a84c" },
            },
          })
          .on(VKID.WidgetEvents.ERROR, (error: unknown) =>
            console.error("VK ID Error:", error),
          )
          .on(
            VKID.OneTapInternalEvents.LOGIN_SUCCESS,
            (payload: { code: string; device_id: string; state?: string }) => {
              const storedVerifier =
                localStorage.getItem("vk_code_verifier") || "";
              fetch(vkAuthUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  code: payload.code,
                  device_id: payload.device_id,
                  code_verifier: storedVerifier,
                  state: payload.state,
                  redirect_uri: "https://zagadai.online/vk-callback",
                }),
              })
                .then((r) => r.json())
                .then((data) => {
                  if (data && data.id) {
                    localStorage.removeItem("vk_code_verifier");
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
                .catch((e) => console.error("Ошибка авторизации VK:", e));
            },
          );
      });
  }, []);

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
              onClick={onShowFulfilled}
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
              <div id="vkAuthDesktop"></div>
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
              onShowFulfilled();
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
            <div id="vkAuthMobile"></div>
          )}
        </div>
      )}
    </>
  );
}
