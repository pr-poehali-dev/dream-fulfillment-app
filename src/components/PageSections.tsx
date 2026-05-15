const PARTNERS = [
  { name: "Место для ангела-партнёра", subtitle: "Стать партнёром" },
  { name: "Место для ангела-партнёра", subtitle: "Стать партнёром" },
  { name: "Место для ангела-партнёра", subtitle: "Стать партнёром" },
];

interface Props {
  starsCount: number;
  copilkaAmount: number;
  angelsCount: number;
  altruistsCount: number;
}

export default function PageSections({
  starsCount,
  copilkaAmount,
  angelsCount,
  altruistsCount,
}: Props) {
  return (
    <>
      {/* Stats */}
      <section className="relative z-10 py-14 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              value: starsCount.toLocaleString("ru-RU"),
              label: "Звёзд зажжено",
              icon: "⭐",
            },
            {
              value: `${copilkaAmount.toLocaleString("ru-RU")} ₽`,
              label: "В Копилке Ангела",
              icon: "💰",
            },
            {
              value: angelsCount.toString(),
              label: "Исполнено Ангелами",
              icon: "👼",
            },
            {
              value: altruistsCount.toString(),
              label: "Исполнено Альтруистами",
              icon: "🤝",
            },
          ].map((stat, i) => (
            <div key={i} className="glass-panel rounded-2xl p-5 text-center">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="font-cormorant text-2xl md:text-3xl gold-text font-semibold mb-1">
                {stat.value}
              </div>
              <div
                className="font-golos text-xs"
                style={{ color: "rgba(200,210,240,0.45)" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h2
            className="font-cormorant text-3xl md:text-4xl text-center mb-10"
            style={{ color: "#f0e8d0" }}
          >
            Ритуал в четырёх шагах
          </h2>
          <div className="space-y-4">
            {[
              {
                num: "I",
                title: "Брось монетку",
                text: "Нажми на ЗАГАДАТЬ ЖЕЛАНИЕ, напиши о нем в поле и выбери сумму. 50% уходит в Копилку Ангела — фонд исполнения мечт.",
              },
              {
                num: "II",
                title: "Расскажи миру",
                text: "Опубликуй пост ВКонтакте — так твоя звезда зажигается на небосводе. Только публичные мечты исполняются.",
              },
              {
                num: "III",
                title: "Жди Ангела",
                text: "Когда в Копилке Ангела набирается сумма, достаточная для исполнения одного желания — Рука Ангела выбирает мечту и исполняет её. Периодичность зависит от активности участников. Чем больше монеток — тем чаще исполняются желания. Белая звезда ждёт — красная уже исполнена.",
              },
              {
                num: "IV",
                title: "Стань Альтруистом",
                text: "Любой может исполнить чужую мечту. Нажимай «Случайная звезда», читай желания и, если какое-то отзовётся в сердце — свяжись с мечтателем через ВК и подари чудо.",
              },
            ].map((step, i) => (
              <div key={i} className="flex gap-6 glass-panel rounded-2xl p-6">
                <div
                  className="font-cormorant text-4xl font-light shrink-0 w-10 leading-none"
                  style={{ color: "rgba(201,168,76,0.45)" }}
                >
                  {step.num}
                </div>
                <div>
                  <h3
                    className="font-cormorant text-xl mb-2"
                    style={{ color: "#f0e8d0" }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="font-golos text-sm leading-relaxed"
                    style={{ color: "rgba(200,210,240,0.55)" }}
                  >
                    {step.text}
                  </p>
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
          <h2
            className="font-cormorant text-2xl mb-3"
            style={{ color: "#f0e8d0" }}
          >
            Поддержать проект
          </h2>
          <p
            className="font-golos text-sm mb-6"
            style={{ color: "rgba(200,210,240,0.45)" }}
          >
            Помоги нам зажечь все 146 745 098 звёзд
          </p>
          <button
            onClick={() =>
              (window.location.href = "mailto:zagadai.online@yandex.ru")
            }
            className="w-full py-3 rounded-full font-golos font-semibold text-sm animate-glow-pulse transition-all"
            style={{
              background: "linear-gradient(135deg, #c9a84c, #8a6a20)",
              color: "#060810",
              cursor: "pointer",
            }}
          >
            Помочь-Ангелам
          </button>
        </div>
      </section>

      {/* Partners */}
      <section className="relative z-10 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h2
            className="font-cormorant text-2xl text-center mb-8"
            style={{ color: "rgba(201,168,76,0.6)" }}
          >
            Ангелы-партнёры
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {PARTNERS.map((p, i) => (
              <a
                key={i}
                href="/contacts"
                className="glass-panel rounded-2xl px-8 py-5 text-center transition-all hover:scale-105"
                style={{
                  minWidth: "160px",
                  textDecoration: "none",
                  border: "1px solid rgba(201,168,76,0.15)",
                  cursor: "pointer",
                }}
              >
                <div
                  className="text-2xl mb-2"
                  style={{ color: "rgba(201,168,76,0.4)" }}
                >
                  ✦
                </div>
                <div
                  className="font-golos text-sm font-medium"
                  style={{ color: "rgba(200,210,240,0.5)" }}
                >
                  {p.name}
                </div>
                <div
                  className="font-golos text-xs mt-1"
                  style={{ color: "#c9a84c" }}
                >
                  {p.subtitle} →
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SEO текст */}
      <section className="relative z-10 py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1
            className="font-cormorant text-3xl mb-4"
            style={{ color: "#c9a84c" }}
          >
            Загадай желание в Колодце Желаний
          </h1>
          <p
            className="font-golos text-sm leading-relaxed"
            style={{ color: "rgba(200,210,240,0.5)" }}
          >
            «Загадай Онлайн» — это платформа, где каждый может загадать желание
            онлайн, бросить виртуальную монетку в Колодец Желаний и зажечь свою
            звезду на небе. Присоединяйтесь к сообществу мечтателей, чтобы ваше
            желание было услышано и исполнено.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="relative z-10 py-8 px-4 text-center mt-4"
        style={{ borderTop: "1px solid rgba(201,168,76,0.08)" }}
      >
        <div className="flex flex-wrap justify-center gap-6 mb-4">
          {[
            { label: "Правила", href: "/rules" },
            { label: "Конфиденциальность", href: "/privacy" },
            { label: "Техподдержка", href: "/contacts" },
            { label: "О проекте", href: "/about" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-golos text-xs transition-colors"
              style={{ color: "#ffffff", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a84c")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#ffffff")}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 mb-3">
          {["ИП ХАБИБУЛЛИН РР", "ИНН 027411103939", "ОГРН 317028000155545"].map(
            (r) => (
              <span
                key={r}
                className="font-golos text-xs"
                style={{ color: "#ffffff" }}
              >
                {r}
              </span>
            ),
          )}
          <a
            href="mailto:zagadai.online@yandex.ru"
            className="font-golos text-xs"
            style={{ color: "#ffffff", textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a84c")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#ffffff")}
          >
            zagadai.online@yandex.ru
          </a>
        </div>
        <p className="font-golos text-sm" style={{ color: "#ffffff" }}>
          © 2026 Загадай Онлайн · zagadai.online
        </p>
      </footer>
    </>
  );
}
