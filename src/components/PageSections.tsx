const PARTNERS = [
  { name: "Ангел №1", subtitle: "Первый партнёр", url: "#" },
  { name: "Ангел №2", subtitle: "Стать партнёром", url: "#" },
  { name: "Ангел №3", subtitle: "Стать партнёром", url: "#" },
];

interface Props {
  starsCount: number;
  copilkaAmount: number;
  angelsCount: number;
  altruistsCount: number;
  onShowVideo: () => void;
}

export default function PageSections({ starsCount, copilkaAmount, angelsCount, altruistsCount, onShowVideo }: Props) {
  return (
    <>
      {/* Stats */}
      <section className="relative z-10 py-14 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: starsCount.toLocaleString('ru-RU'), label: "Звёзд зажжено", icon: "⭐" },
            { value: `${copilkaAmount.toLocaleString('ru-RU')} ₽`, label: "В Копилке Ангела", icon: "💰" },
            { value: angelsCount.toString(), label: "Исполнено Ангелами", icon: "👼" },
            { value: altruistsCount.toString(), label: "Исполнено Альтруистами", icon: "🤝" },
          ].map((stat, i) => (
            <div key={i} className="glass-panel rounded-2xl p-5 text-center">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="font-cormorant text-2xl md:text-3xl gold-text font-semibold mb-1">{stat.value}</div>
              <div className="font-golos text-xs" style={{ color: 'rgba(200,210,240,0.45)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-cormorant text-3xl md:text-4xl text-center mb-10" style={{ color: '#f0e8d0' }}>
            Ритуал в трёх шагах
          </h2>
          <div className="space-y-4">
            {[
              { num: "I", title: "Брось монетку", text: "Нажми на колодец, загадай желание и выбери сумму. 50% уходит в Копилку Ангела — фонд исполнения мечт." },
              { num: "II", title: "Расскажи миру", text: "Опубликуй пост ВКонтакте — так твоя звезда зажигается на небосводе. Только публичные мечты исполняются." },
              { num: "III", title: "Жди Ангела", text: "Ангел или Альтруист увидит твою звезду и исполнит желание. Белая звезда ждёт — красная уже исполнена." },
            ].map((step, i) => (
              <div key={i} className="flex gap-6 glass-panel rounded-2xl p-6">
                <div className="font-cormorant text-4xl font-light shrink-0 w-10 leading-none" style={{ color: 'rgba(201,168,76,0.45)' }}>
                  {step.num}
                </div>
                <div>
                  <h3 className="font-cormorant text-xl mb-2" style={{ color: '#f0e8d0' }}>{step.title}</h3>
                  <p className="font-golos text-sm leading-relaxed" style={{ color: 'rgba(200,210,240,0.55)' }}>{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support CTA */}
      <section className="relative z-10 py-10 px-4 text-center">
        <div className="max-w-md mx-auto glass-panel rounded-3xl p-8">
          <div className="text-4xl mb-4">🙏</div>
          <h2 className="font-cormorant text-2xl mb-3" style={{ color: '#f0e8d0' }}>Поддержать проект</h2>
          <p className="font-golos text-sm mb-6" style={{ color: 'rgba(200,210,240,0.45)' }}>
            Помоги нам зажечь все 146 745 098 звёзд
          </p>
          <button
            className="w-full py-3 rounded-full font-golos font-semibold text-sm animate-glow-pulse transition-all"
            style={{ background: 'linear-gradient(135deg, #c9a84c, #8a6a20)', color: '#060810' }}>
            Стать Ангелом-партнёром
          </button>
        </div>
      </section>

      {/* Partners */}
      <section className="relative z-10 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-cormorant text-2xl text-center mb-8" style={{ color: 'rgba(201,168,76,0.6)' }}>
            Ангелы-партнёры
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {PARTNERS.map((p, i) => (
              <a key={i} href={p.url}
                className="glass-panel rounded-2xl px-8 py-5 text-center transition-all hover:scale-105"
                style={{ minWidth: '130px', textDecoration: 'none' }}>
                <div className="text-2xl mb-2" style={{ color: 'rgba(201,168,76,0.5)' }}>✦</div>
                <div className="font-golos text-sm font-medium" style={{ color: '#f0e8d0' }}>{p.name}</div>
                <div className="font-golos text-xs mt-1" style={{ color: 'rgba(200,210,240,0.35)' }}>{p.subtitle}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-4 text-center mt-4"
        style={{ borderTop: '1px solid rgba(201,168,76,0.08)' }}>
        <div className="flex flex-wrap justify-center gap-6 mb-4">
          {[
            { label: "Правила", href: "/rules" },
            { label: "Конфиденциальность", href: "/privacy" },
            { label: "Техподдержка", href: "/contacts" },
          ].map(link => (
            <a key={link.href} href={link.href}
              className="font-golos text-xs transition-colors"
              style={{ color: 'rgba(200,210,240,0.35)', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#c9a84c')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(200,210,240,0.35)')}>
              {link.label}
            </a>
          ))}
          <button
            onClick={onShowVideo}
            className="font-golos text-xs transition-colors"
            style={{ color: 'rgba(200,210,240,0.35)', background: 'none', border: 'none', cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#c9a84c')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(200,210,240,0.35)')}>
            О проекте
          </button>
        </div>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 mb-3">
          {[
            'ИНН 027411103939',
            'ОГРН 317028000155545',
          ].map(r => (
            <span key={r} className="font-golos text-xs" style={{ color: 'rgba(200,210,240,0.22)' }}>{r}</span>
          ))}
          <a href="mailto:help@zagadai.online" className="font-golos text-xs" style={{ color: 'rgba(200,210,240,0.22)', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#c9a84c')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(200,210,240,0.22)')}>
            help@zagadai.online
          </a>
        </div>
        <p className="font-golos text-xs" style={{ color: 'rgba(200,210,240,0.18)' }}>© 2026 Загадай Онлайн · zagadai.online</p>
      </footer>
    </>
  );
}