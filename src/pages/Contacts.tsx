import { useState } from "react";
import Icon from "@/components/ui/icon";

const MobileNav = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="md:hidden"
        onClick={() => setOpen(o => !o)}
        style={{ color: 'rgba(200,210,240,0.7)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
        <Icon name={open ? "X" : "Menu"} size={22} />
      </button>
      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 z-20 flex flex-col gap-4 px-6 py-5 font-golos text-sm"
          style={{ background: 'rgba(6,8,16,0.97)', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
          <a href="/rules" onClick={() => setOpen(false)} style={{ color: 'rgba(200,210,240,0.7)' }}>Правила</a>
          <a href="/about" onClick={() => setOpen(false)} style={{ color: 'rgba(200,210,240,0.7)' }}>О проекте</a>
          <a href="/contacts" onClick={() => setOpen(false)} style={{ color: '#c9a84c' }}>Контакты</a>
        </div>
      )}
    </>
  );
};

export default function Contacts() {
  return (
    <div className="min-h-screen" style={{ background: "#060810" }}>
      <header
        className="relative flex items-center justify-between px-6 py-5 md:px-12"
        style={{ borderBottom: "1px solid rgba(201,168,76,0.1)" }}
      >
        <a href="/" className="flex items-center gap-2" style={{ textDecoration: "none" }}>
          <span style={{ color: "#c9a84c" }}>✦</span>
          <span className="font-cormorant text-xl font-medium tracking-widest uppercase" style={{ color: "#c9a84c" }}>
            Загадай.Онлайн
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm font-golos">
          <a href="/rules" className="transition-colors" style={{ color: 'rgba(200,210,240,0.6)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#c9a84c')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(200,210,240,0.6)')}>Правила</a>
          <a href="/about" className="transition-colors" style={{ color: 'rgba(200,210,240,0.6)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#c9a84c')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(200,210,240,0.6)')}>О проекте</a>
          <a href="/contacts" style={{ color: '#c9a84c' }}>Контакты</a>
        </nav>
        <MobileNav />
      </header>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1
          className="font-cormorant text-4xl md:text-5xl mb-2"
          style={{ color: "#f0e8d0" }}
        >
          Техподдержка
        </h1>
        <p
          className="font-golos text-sm mb-10"
          style={{ color: "rgba(200,210,240,0.4)" }}
        >
          Мы отвечаем в течение 24 часов
        </p>

        {/* Contacts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            {
              icon: "Mail",
              label: "Email",
              value: "zagadai.online@yandex.ru",
              href: "mailto:zagadai.online@yandex.ru",
            },
            {
              icon: "MessageCircle",
              label: "ВКонтакте",
              value: "vk.com/zagadai.online",
              href: "https://vk.com/club238641413",
            },
            {
              icon: "Send",
              label: "Telegram",
              value: "@zagadai_bot",
              href: "https://t.me",
            },
          ].map((contact, i) => (
            <a
              key={i}
              href={contact.href}
              className="glass-panel rounded-xl p-5 text-center transition-all hover:scale-105"
              style={{
                border: "1px solid rgba(201,168,76,0.1)",
                textDecoration: "none",
              }}
            >
              <div className="flex justify-center mb-3">
                <Icon
                  name={contact.icon as "Mail"}
                  size={22}
                  style={{ color: "#c9a84c" }}
                />
              </div>
              <div
                className="font-golos text-xs mb-1"
                style={{
                  color: "rgba(200,210,240,0.4)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {contact.label}
              </div>
              <div className="font-golos text-sm" style={{ color: "#f0e8d0" }}>
                {contact.value}
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="/"
            className="font-golos text-sm"
            style={{ color: "rgba(200,210,240,0.35)", textDecoration: "none" }}
          >
            ← Вернуться на главную
          </a>
        </div>
      </div>
    </div>
  );
}