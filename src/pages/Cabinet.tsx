import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { useUser } from "@/context/UserContext";
import func2url from "../../backend/func2url.json";

const cabinetUrl = func2url["get-random-wish"];

interface Wish {
  id: number;
  wish: string;
  amount: number;
  status: "active" | "fulfilled" | "pending";
  created_at: string | null;
  fulfilled_at: string | null;
}

interface CabinetData {
  wishes: Wish[];
  fulfilled_count: number;
  altruist_count: number;
  total_donated: number;
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(n: number) {
  return n.toLocaleString("ru-RU") + " ₽";
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    fulfilled: {
      label: "Исполнено",
      color: "#c9a84c",
      bg: "rgba(201,168,76,0.12)",
    },
    active: {
      label: "Ждёт чуда",
      color: "rgba(200,210,240,0.5)",
      bg: "rgba(200,210,240,0.06)",
    },
    pending: {
      label: "Ждёт чуда",
      color: "rgba(200,210,240,0.5)",
      bg: "rgba(200,210,240,0.06)",
    },
  };
  const s = map[status] ?? map.pending;
  return (
    <span
      className="font-golos text-xs px-2 py-0.5 rounded-full"
      style={{ color: s.color, background: s.bg, whiteSpace: "nowrap" }}
    >
      {s.label}
    </span>
  );
}

const MobileNav = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="md:hidden"
        onClick={() => setOpen((o) => !o)}
        style={{
          color: "rgba(200,210,240,0.7)",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 4,
        }}
      >
        <Icon name={open ? "X" : "Menu"} size={22} />
      </button>
      {open && (
        <div
          className="md:hidden absolute top-full left-0 right-0 z-20 flex flex-col gap-4 px-6 py-5 font-golos text-sm"
          style={{
            background: "rgba(6,8,16,0.97)",
            borderBottom: "1px solid rgba(201,168,76,0.15)",
          }}
        >
          <a
            href="/rules"
            onClick={() => setOpen(false)}
            style={{ color: "rgba(200,210,240,0.7)" }}
          >
            Правила
          </a>
          <a
            href="/about"
            onClick={() => setOpen(false)}
            style={{ color: "rgba(200,210,240,0.7)" }}
          >
            О проекте
          </a>
          <a
            href="/contacts"
            onClick={() => setOpen(false)}
            style={{ color: "rgba(200,210,240,0.7)" }}
          >
            Контакты
          </a>
        </div>
      )}
    </>
  );
};

export default function Cabinet() {
  const { user, logout } = useUser();
  const [data, setData] = useState<CabinetData | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"wishes" | "fulfilled">("wishes");

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(`${cabinetUrl}?action=cabinet&user_id=${user.id}`)
      .then((r) => r.json())
      .then((d) => {
        const parsed = typeof d === "string" ? JSON.parse(d) : d;
        setData(parsed);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, rgba(6,8,16,0.85) 0%, rgba(6,8,16,0.92) 100%)",
      }}
    >
      {/* Header */}
      <header
        className="relative flex items-center justify-between px-6 py-5 md:px-12"
        style={{ borderBottom: "1px solid rgba(201,168,76,0.1)" }}
      >
        <a
          href="/"
          className="flex items-center gap-2"
          style={{ textDecoration: "none" }}
        >
          <span style={{ color: "#c9a84c" }}>✦</span>
          <span
            className="font-cormorant text-xl font-medium tracking-widest uppercase"
            style={{ color: "#c9a84c" }}
          >
            Загадай.Онлайн
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm font-golos">
          {["Правила:/rules", "О проекте:/about", "Контакты:/contacts"].map(
            (item) => {
              const [label, href] = item.split(":");
              return (
                <a
                  key={href}
                  href={href}
                  className="transition-colors"
                  style={{ color: "rgba(200,210,240,0.6)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#c9a84c")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(200,210,240,0.6)")
                  }
                >
                  {label}
                </a>
              );
            },
          )}
        </nav>
        <MobileNav />
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {!user ? (
          /* Экран входа */
          <div className="text-center py-16">
            <div className="text-5xl mb-6">✦</div>
            <h1
              className="font-cormorant text-3xl md:text-4xl mb-4"
              style={{ color: "#f0e8d0" }}
            >
              Личный кабинет
            </h1>
            <p
              className="font-golos text-sm mb-8 max-w-sm mx-auto"
              style={{ color: "rgba(200,210,240,0.5)" }}
            >
              Войди через VK ID, чтобы увидеть свои желания и статистику
            </p>
            <p
              className="font-golos text-xs mb-6"
              style={{ color: "rgba(200,210,240,0.35)" }}
            >
              Кнопка входа через ВКонтакте появится в шапке сайта после загрузки
              VK SDK
            </p>
            <a
              href="/"
              className="font-golos text-xs"
              style={{
                color: "rgba(200,210,240,0.35)",
                textDecoration: "none",
              }}
            >
              ← Вернуться на главную
            </a>
          </div>
        ) : (
          /* Дашборд */
          <div>
            {/* Профиль */}
            <div
              className="glass-panel rounded-2xl p-5 mb-5 flex items-center justify-between gap-4"
              style={{ border: "1px solid rgba(201,168,76,0.15)" }}
            >
              <div className="flex items-center gap-4">
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "1px solid rgba(201,168,76,0.3)",
                  }}
                />
                <div>
                  <h2
                    className="font-cormorant text-2xl mb-0.5"
                    style={{ color: "#f0e8d0" }}
                  >
                    {user.name}
                  </h2>
                  <p
                    className="font-golos text-xs"
                    style={{ color: "rgba(200,210,240,0.4)" }}
                  >
                    Мечтатель
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                className="font-golos text-xs flex items-center gap-1.5 px-3 py-2 rounded-full transition-all"
                style={{
                  color: "rgba(200,210,240,0.4)",
                  border: "1px solid rgba(200,210,240,0.1)",
                  background: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(200,210,240,0.1)")
                }
              >
                <Icon name="LogOut" size={13} />
                Выйти
              </button>
            </div>

            {/* 4 блока статистики */}
            {loading ? (
              <div
                className="text-center py-8 font-golos text-sm"
                style={{ color: "rgba(200,210,240,0.3)" }}
              >
                Загружаем данные...
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {[
                    {
                      icon: "⭐",
                      value: data?.wishes.length ?? 0,
                      label: "Загадано желаний",
                    },
                    {
                      icon: "🔴",
                      value: data?.fulfilled_count ?? 0,
                      label: "Исполнено моих желаний",
                    },
                    {
                      icon: "🌟",
                      value: data?.altruist_count ?? 0,
                      label: "Я исполнил",
                    },
                    {
                      icon: "💫",
                      value: data ? formatAmount(data.total_donated) : "0 ₽",
                      label: "Пожертвовал в колодец",
                    },
                  ].map((s, i) => (
                    <div
                      key={i}
                      className="glass-panel rounded-xl p-4 text-center"
                      style={{ border: "1px solid rgba(201,168,76,0.1)" }}
                    >
                      <div className="text-xl mb-1">{s.icon}</div>
                      <div
                        className="font-cormorant text-2xl font-semibold mb-1"
                        style={{ color: "#c9a84c" }}
                      >
                        {s.value}
                      </div>
                      <div
                        className="font-golos text-xs leading-tight"
                        style={{ color: "rgba(200,210,240,0.4)" }}
                      >
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Вкладки */}
                <div className="flex gap-2 mb-5">
                  {[
                    { key: "wishes", label: "Мои желания" },
                    { key: "fulfilled", label: "Исполнены другими" },
                  ].map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setTab(t.key as "wishes" | "fulfilled")}
                      className="px-5 py-2 rounded-full font-golos text-sm transition-all"
                      style={{
                        background:
                          tab === t.key
                            ? "linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.05))"
                            : "transparent",
                        border: `1px solid ${tab === t.key ? "rgba(201,168,76,0.4)" : "rgba(201,168,76,0.12)"}`,
                        color:
                          tab === t.key ? "#c9a84c" : "rgba(200,210,240,0.4)",
                        cursor: "pointer",
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Список желаний */}
                {tab === "wishes" && (
                  <div className="flex flex-col gap-3">
                    {!data?.wishes.length ? (
                      <div
                        className="glass-panel rounded-xl p-8 text-center font-golos text-sm"
                        style={{
                          color: "rgba(200,210,240,0.3)",
                          border: "1px solid rgba(201,168,76,0.08)",
                        }}
                      >
                        Ты ещё не загадал ни одного желания
                      </div>
                    ) : (
                      data.wishes.map((w) => (
                        <div
                          key={w.id}
                          className="glass-panel rounded-xl p-4"
                          style={{ border: "1px solid rgba(201,168,76,0.1)" }}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <p
                              className="font-golos text-sm leading-relaxed"
                              style={{ color: "#f0e8d0" }}
                            >
                              {w.wish}
                            </p>
                            <StatusBadge status={w.status} />
                          </div>
                          <div
                            className="flex items-center gap-3 font-golos text-xs"
                            style={{ color: "rgba(200,210,240,0.35)" }}
                          >
                            <span>{formatAmount(w.amount)}</span>
                            <span>·</span>
                            <span>{formatDate(w.created_at)}</span>
                            {w.status === "fulfilled" && w.fulfilled_at && (
                              <>
                                <span>·</span>
                                <span style={{ color: "#c9a84c" }}>
                                  Исполнено {formatDate(w.fulfilled_at)}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {tab === "fulfilled" && (
                  <div className="flex flex-col gap-3">
                    {!data?.fulfilled_count ? (
                      <div
                        className="glass-panel rounded-xl p-8 text-center font-golos text-sm"
                        style={{
                          color: "rgba(200,210,240,0.3)",
                          border: "1px solid rgba(201,168,76,0.08)",
                        }}
                      >
                        Ни одно из твоих желаний пока не исполнено — но всё
                        впереди ✦
                      </div>
                    ) : (
                      data.wishes
                        .filter((w) => w.status === "fulfilled")
                        .map((w) => (
                          <div
                            key={w.id}
                            className="glass-panel rounded-xl p-4"
                            style={{
                              border: "1px solid rgba(201,168,76,0.18)",
                            }}
                          >
                            <p
                              className="font-golos text-sm leading-relaxed mb-2"
                              style={{ color: "#f0e8d0" }}
                            >
                              {w.wish}
                            </p>
                            <div
                              className="font-golos text-xs"
                              style={{ color: "rgba(201,168,76,0.7)" }}
                            >
                              🔴 Исполнено {formatDate(w.fulfilled_at)}
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
