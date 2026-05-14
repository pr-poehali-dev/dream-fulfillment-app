import { useState } from "react";
import Icon from "@/components/ui/icon";

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

const MOCK_WISHES = [
  {
    id: 1,
    text: "Купить квартиру в Москве для своей семьи",
    amount: 500,
    status: "pending",
    date: "12 мар 2024",
    star: "⭐",
  },
  {
    id: 2,
    text: "Поехать в путешествие на Байкал",
    amount: 100,
    status: "fulfilled",
    date: "5 фев 2024",
    star: "🔴",
  },
  {
    id: 3,
    text: "Открыть собственную кофейню",
    amount: 1000,
    status: "pending",
    date: "1 янв 2024",
    star: "⭐",
  },
];

const MOCK_FULFILLED = [
  {
    id: 1,
    text: "Олег Д.: Новый ноутбук для учёбы",
    amount: 15000,
    date: "20 мар 2024",
  },
];

export default function Cabinet() {
  const [tab, setTab] = useState<"wishes" | "fulfilled">("wishes");
  const [isLoggedIn] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "#060810" }}>
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
          <a
            href="/contacts"
            className="transition-colors"
            style={{ color: "rgba(200,210,240,0.6)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a84c")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(200,210,240,0.6)")
            }
          >
            Контакты
          </a>
        </nav>
        <MobileNav />
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {!isLoggedIn ? (
          /* Login screen */
          <div className="text-center py-16">
            <div className="text-5xl mb-6">🔑</div>
            <h1
              className="font-cormorant text-3xl md:text-4xl mb-4"
              style={{ color: "#f0e8d0" }}
            >
              Войди через ВКонтакте
            </h1>
            <p
              className="font-golos text-sm mb-8 max-w-sm mx-auto"
              style={{ color: "rgba(200,210,240,0.5)" }}
            >
              Войди через VK ID, чтобы увидеть свои желания, историю и
              статистику
            </p>
            <button
              className="inline-flex items-center gap-3 px-8 py-3 rounded-full font-golos font-semibold text-sm transition-all"
              style={{ background: "#0077ff", color: "#fff" }}
            >
              <Icon name="LogIn" size={16} />
              Войти через ВКонтакте
            </button>
            <div className="mt-6">
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
          </div>
        ) : (
          /* Dashboard */
          <div>
            {/* User card */}
            <div
              className="glass-panel rounded-2xl p-6 mb-6 flex items-center gap-5"
              style={{ border: "1px solid rgba(201,168,76,0.15)" }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                style={{
                  background: "rgba(201,168,76,0.1)",
                  border: "1px solid rgba(201,168,76,0.3)",
                }}
              >
                👤
              </div>
              <div>
                <h2
                  className="font-cormorant text-2xl mb-1"
                  style={{ color: "#f0e8d0" }}
                >
                  Имя Пользователя
                </h2>
                <p
                  className="font-golos text-sm"
                  style={{ color: "rgba(200,210,240,0.45)" }}
                >
                  Мечтатель · Зарегистрирован 01.01.2024
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { value: "3", label: "Загадано желаний" },
                { value: "1", label: "Исполнено" },
                { value: "1 100 ₽", label: "Монеток брошено" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="glass-panel rounded-xl p-4 text-center"
                  style={{ border: "1px solid rgba(201,168,76,0.1)" }}
                >
                  <div className="font-cormorant text-2xl gold-text font-semibold mb-1">
                    {s.value}
                  </div>
                  <div
                    className="font-golos text-xs"
                    style={{ color: "rgba(200,210,240,0.4)" }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-5">
              {[
                { key: "wishes", label: "Мои желания" },
                { key: "fulfilled", label: "Исполнил сам" },
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
                    border: `1px solid ${tab === t.key ? "rgba(201,168,76,0.5)" : "rgba(201,168,76,0.15)"}`,
                    color: tab === t.key ? "#c9a84c" : "rgba(200,210,240,0.5)",
                    cursor: "pointer",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {tab === "wishes" && (
              <div className="space-y-3">
                {MOCK_WISHES.map((wish) => (
                  <div
                    key={wish.id}
                    className="glass-panel rounded-xl p-4 flex items-start gap-4"
                    style={{ border: "1px solid rgba(201,168,76,0.1)" }}
                  >
                    <div className="text-xl mt-0.5">{wish.star}</div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-golos text-sm mb-1 leading-snug"
                        style={{ color: "#f0e8d0" }}
                      >
                        {wish.text}
                      </p>
                      <div className="flex items-center gap-3">
                        <span
                          className="font-golos text-xs"
                          style={{ color: "rgba(200,210,240,0.35)" }}
                        >
                          {wish.date}
                        </span>
                        <span
                          className="font-golos text-xs"
                          style={{ color: "rgba(201,168,76,0.6)" }}
                        >
                          {wish.amount} ₽
                        </span>
                        <span
                          className="font-golos text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background:
                              wish.status === "fulfilled"
                                ? "rgba(255,60,60,0.15)"
                                : "rgba(255,255,200,0.1)",
                            color:
                              wish.status === "fulfilled"
                                ? "#ff6060"
                                : "rgba(200,210,240,0.5)",
                          }}
                        >
                          {wish.status === "fulfilled" ? "Исполнено" : "Ждёт"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "fulfilled" && (
              <div className="space-y-3">
                {MOCK_FULFILLED.map((item) => (
                  <div
                    key={item.id}
                    className="glass-panel rounded-xl p-4 flex items-start gap-4"
                    style={{ border: "1px solid rgba(201,168,76,0.1)" }}
                  >
                    <div className="text-xl mt-0.5">🤝</div>
                    <div>
                      <p
                        className="font-golos text-sm mb-1"
                        style={{ color: "#f0e8d0" }}
                      >
                        {item.text}
                      </p>
                      <div className="flex items-center gap-3">
                        <span
                          className="font-golos text-xs"
                          style={{ color: "rgba(200,210,240,0.35)" }}
                        >
                          {item.date}
                        </span>
                        <span
                          className="font-golos text-xs"
                          style={{ color: "rgba(201,168,76,0.6)" }}
                        >
                          {item.amount.toLocaleString("ru-RU")} ₽
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
