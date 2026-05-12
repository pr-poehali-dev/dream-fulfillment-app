import { useState } from "react";
import Icon from "@/components/ui/icon";
import func2url from "../../backend/func2url.json";

export default function Contacts() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(func2url["send-contact"], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Ошибка отправки");
      setSent(true);
    } catch {
      setError("Не удалось отправить. Напишите напрямую: zagadai.online@yandex.ru");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(20,25,40,0.8)',
    border: '1px solid rgba(201,168,76,0.2)',
    borderRadius: '12px',
    padding: '12px 16px',
    color: '#f0e8d0',
    fontFamily: '"Golos Text", sans-serif',
    fontSize: '14px',
    outline: 'none',
    caretColor: '#c9a84c',
    transition: 'border-color 0.2s',
  };

  return (
    <div className="min-h-screen" style={{ background: '#060810' }}>
      <header className="flex items-center justify-between px-6 py-5 md:px-12"
        style={{ borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
        <a href="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
          <span style={{ color: '#c9a84c' }}>✦</span>
          <span className="font-cormorant text-xl font-medium tracking-widest uppercase" style={{ color: '#c9a84c' }}>Загадай</span>
        </a>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="font-cormorant text-4xl md:text-5xl mb-2" style={{ color: '#f0e8d0' }}>Техподдержка</h1>
        <p className="font-golos text-sm mb-10" style={{ color: 'rgba(200,210,240,0.4)' }}>
          Мы отвечаем в течение 24 часов
        </p>

        {/* Contacts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: "Mail", label: "Email", value: "zagadai.online@yandex.ru", href: "mailto:zagadai.online@yandex.ru" },
            { icon: "MessageCircle", label: "ВКонтакте", value: "vk.com/zagadai", href: "https://vk.com" },
            { icon: "Send", label: "Telegram", value: "@zagadai_bot", href: "https://t.me" },
          ].map((contact, i) => (
            <a key={i} href={contact.href}
              className="glass-panel rounded-xl p-5 text-center transition-all hover:scale-105"
              style={{ border: '1px solid rgba(201,168,76,0.1)', textDecoration: 'none' }}>
              <div className="flex justify-center mb-3">
                <Icon name={contact.icon as "Mail"} size={22} style={{ color: '#c9a84c' }} />
              </div>
              <div className="font-golos text-xs mb-1" style={{ color: 'rgba(200,210,240,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {contact.label}
              </div>
              <div className="font-golos text-sm" style={{ color: '#f0e8d0' }}>{contact.value}</div>
            </a>
          ))}
        </div>

        {/* Form */}
        {!sent ? (
          <div className="glass-panel rounded-2xl p-6 md:p-8"
            style={{ border: '1px solid rgba(201,168,76,0.12)' }}>
            <h2 className="font-cormorant text-2xl mb-6" style={{ color: '#f0e8d0' }}>Написать нам</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-golos text-xs mb-2 block"
                  style={{ color: 'rgba(201,168,76,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Ваше имя
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Иван Иванов"
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = 'rgba(201,168,76,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')}
                />
              </div>
              <div>
                <label className="font-golos text-xs mb-2 block"
                  style={{ color: 'rgba(201,168,76,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.ru"
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = 'rgba(201,168,76,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')}
                />
              </div>
              <div>
                <label className="font-golos text-xs mb-2 block"
                  style={{ color: 'rgba(201,168,76,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Сообщение
                </label>
                <textarea
                  value={form.message}
                  onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Опишите вашу проблему или вопрос..."
                  rows={5}
                  style={{ ...inputStyle, resize: 'none' }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(201,168,76,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')}
                />
              </div>
              {error && (
                <p className="font-golos text-xs text-center" style={{ color: '#ff6b6b' }}>{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full font-golos font-semibold text-sm transition-all"
                style={{
                  background: 'linear-gradient(135deg, #c9a84c, #8a6a20)',
                  color: '#060810',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  border: 'none',
                  opacity: loading ? 0.7 : 1,
                }}>
                {loading ? "Отправляем..." : "Отправить сообщение"}
              </button>
            </form>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-8 text-center"
            style={{ border: '1px solid rgba(201,168,76,0.12)' }}>
            <div className="text-4xl mb-4">✉️</div>
            <h2 className="font-cormorant text-2xl mb-3" style={{ color: '#f0e8d0' }}>Сообщение отправлено</h2>
            <p className="font-golos text-sm" style={{ color: 'rgba(200,210,240,0.5)' }}>
              Мы ответим на ваш email в течение 24 часов
            </p>
          </div>
        )}

        <div className="text-center mt-8">
          <a href="/" className="font-golos text-sm" style={{ color: 'rgba(200,210,240,0.35)', textDecoration: 'none' }}>
            ← Вернуться на главную
          </a>
        </div>
      </div>
    </div>
  );
}