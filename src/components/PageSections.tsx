const PARTNERS = [
  { name: "Место для Ангела-Партнёра", subtitle: "Участие от 100 ₽ →" },
  { name: "Место для Ангела-Партнёра", subtitle: "Участие от 100 ₽ →" },
  { name: "Место для Ангела-Партнёра", subtitle: "Участие от 100 ₽ →" },
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
          <p
            className="font-golos text-sm leading-relaxed mb-3"
            style={{ color: "rgba(200,210,240,0.5)" }}
          >
            Всего 146 745 098 мест на небе. Звёздочка занимает 1 место,
            Звездопад — 100. Чем крупнее звезда, тем быстрее заполняется небо.
          </p>
          <h1
            className="font-cormorant text-3xl mb-4"
            style={{ color: "#c9a84c" }}
          >
            Загадай желание в Колодце Желаний
          </h1>
          <p
            className="font-golos text-sm leading-relaxed"
            style={{ color: "#ffffff" }}
          >
            «Загадай Онлайн» — это платформа, где каждый может загадать желание
            онлайн, бросить виртуальную монетку в Колодец Желаний и зажечь свою
            звезду на небе. Присоединяйтесь к сообществу мечтателей, чтобы ваше
            желание было услышано и исполнено. Проект не является магическим,
            экстрасенсорным или лотерейным сервисом. Это цифровая платформа для
            публикации желаний и продвижения товаров или услуг. Все звёзды —
            виртуальные цифровые активы. Каждая звезда — это рекламное место.
            Разместите информацию о своём сайте, товаре или услуге. Мы
            показываем звёзды в эфирах и отчётах, переходим по ссылкам и
            рассказываем о владельцах.
          </p>
        </div>
      </section>

      {/* Виджет сообщества ВК */}
      <section className="relative z-10 py-6 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div id="vk_groups"></div>
          <script type="text/javascript">
            {`
              VK.Widgets.Group("vk_groups", {mode: 3, width: "240", color1: "060810", color2: "c9a84c", color3: "c9a84c"}, 238641413);
            `}
          </script>
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
            { label: "Публичная оферта", href: "/oferta" },
            { label: "ВКонтакте", href: "https://vk.com/club238641413" },
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
          {["ИП ХАБИБУЛЛИН РР", "ИНН 027411103939", "Россия, г.Уфа ул. Нехаева 99", "ОГРН 317028000155545"].map(
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
              <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 mb-3">
          <span className="font-golos text-xs" style={{ color: "#ffffff" }}>
            Принимаем к оплате: Visa, Mastercard, МИР
          </span>
        </div>
        <p className="font-golos text-sm" style={{ color: "#ffffff" }}>
          © 2026 Загадай Онлайн · zagadai.online
        </p>
      </footer>
    </>
  );
}