import { useState } from "react";
import { Link } from "react-router-dom";
import PageBackground from "@/components/PageBackground";
import Icon from "@/components/ui/icon";

export default function About() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: '#060810' }}>
      <PageBackground stars={[]} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12">
        <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
          <span className="text-xl" style={{ color: '#c9a84c' }}>✦</span>
          <span className="font-cormorant text-xl font-medium tracking-widest uppercase" style={{ color: '#c9a84c' }}>ЗАГАДАЙ.ОНЛАЙН</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-golos">
          <a href="/rules" className="transition-colors" style={{ color: 'rgba(200,210,240,0.6)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#c9a84c')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(200,210,240,0.6)')}>Правила</a>
          <Link to="/about" className="transition-colors" style={{ color: '#c9a84c', textDecoration: 'none' }}>О проекте</Link>
          <a href="/contacts" className="transition-colors" style={{ color: 'rgba(200,210,240,0.6)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#c9a84c')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(200,210,240,0.6)')}>Контакты</a>
        </nav>
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(o => !o)}
          style={{ color: 'rgba(200,210,240,0.7)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <Icon name={mobileMenuOpen ? "X" : "Menu"} size={22} />
        </button>
      </header>

      {mobileMenuOpen && (
        <div className="md:hidden relative z-20 flex flex-col gap-4 px-6 py-5 font-golos text-sm"
          style={{ background: 'rgba(6,8,16,0.97)', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
          <a href="/rules" onClick={() => setMobileMenuOpen(false)} style={{ color: 'rgba(200,210,240,0.7)' }}>Правила</a>
          <a href="/about" onClick={() => setMobileMenuOpen(false)} style={{ color: '#c9a84c' }}>О проекте</a>
          <a href="/contacts" onClick={() => setMobileMenuOpen(false)} style={{ color: 'rgba(200,210,240,0.7)' }}>Контакты</a>
        </div>
      )}

      {/* Content */}
      <main className="relative z-10 px-4 py-10 pb-20">
        <div className="max-w-2xl mx-auto">

          <div className="text-center mb-12">
            <span className="text-4xl" style={{ color: '#c9a84c', filter: 'drop-shadow(0 0 14px #ffd700)' }}>✦</span>
            <h1 className="font-cormorant mt-4 mb-2" style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', color: '#f0e8d0', fontWeight: 300, letterSpacing: '0.04em' }}>
              О проекте «Загадай.Онлайн»
            </h1>
          </div>

          <Section title="Что это за место?">
            <p>"Загадай Онлайн" — это цифровой ритуал на стыке надежды и технологии. Тысячелетиями люди бросали монеты в колодцы, фонтаны и моря, веря, что вода унесёт их просьбу в другой мир и кто-то её услышит. Мы оцифровали этот древний обычай, но не убили его душу.</p>
            <p className="mt-4">Забудьте про лайки и бесконечные ленты. Здесь ваша мечта обретает реальные координаты. Она становится звездой. И каждый, кто посмотрит на наше ночное небо, сможет её увидеть.</p>
          </Section>

          <Section title="Как исполняются мечты?">
            <p className="mb-6">У каждой звезды есть два пути, и это делает проект особенным:</p>

            <div className="glass-panel rounded-2xl p-6 mb-4">
              <h3 className="font-cormorant text-xl mb-3" style={{ color: '#c9a84c' }}>Путь Альтруиста</h3>
              <p>Представьте: вы открываете карту неба и видите тысячи сияющих точек. За каждой — живой человек и его история. Может быть, парень из соседнего города мечтает о гитаре, чтобы петь песни для своей девушки. Вы чувствуете, что можете помочь — и просто делаете это. Вы находите его через ВК, исполняете мечту и гасите звезду. Она становится красной, навсегда оставаясь памятником вашему доброму поступку. Никакой выгоды, только чистое желание сделать мир светлее.</p>
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <h3 className="font-cormorant text-xl mb-3" style={{ color: '#c9a84c' }}>Путь Ангела</h3>
              <p>Но даже если вашу звезду не заметят сразу, шанс остаётся. Ровно 50% от каждой монеты, брошенной в Колодец, падает в общую Копилку Ангела. Это наш коллективный магический резерв. Раз в период (например, в новолуние) Рука Ангела случайным образом выбирает из общего списка ту самую мечту, которая будет исполнена прямо сейчас. Ваш скромный вклад в 10 рублей, сложенный с тысячами других, превращается в реальный велосипед, оплаченный курс или билет на море для совершенно незнакомого человека.</p>
            </div>
          </Section>

          <Section title="Почему это работает?">
            <p>Потому что мы убрали всё лишнее и построили мост между мечтой и деньгами. Вы не платите за воздух. Вы платите за то, чтобы ваша история была услышана, а 50% вашего взноса тут же пошли в фонд реальной помощи. Это честная математика волшебства.</p>
          </Section>

          <Section title="Особенность проекта">
            <p>Эту платформу с нуля, в одиночку, построил реальный человек. Не команда программистов, не студия, не стартап с инвесторами. Её создал Радик — участник СВО отец двоих детей. Без знаний кода. Без бюджета на разработку. Только идея, искусственный интеллект и желание построить мост между мечтой и реальностью.</p>
            <p className="mt-4">Весь бюджет проекта на старте уместился в стоимость нескольких чашек кофе. Это не метафора. Это манифест. Доказательство того, что в современном мире можно построить настоящее чудо, если у тебя есть цель и воля.</p>
          </Section>

          <div className="text-center mt-14">
            <Link to="/"
              className="inline-block px-8 py-3 rounded-full font-golos font-semibold text-sm transition-all"
              style={{ border: '1px solid rgba(201,168,76,0.4)', color: '#c9a84c', textDecoration: 'none' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.1)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}>
              ✦ Загадать желание
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-4 text-center mt-4"
        style={{ borderTop: '1px solid rgba(201,168,76,0.08)' }}>
        <div className="flex flex-wrap justify-center gap-6 mb-4">
          {[
            { label: "Правила", href: "/rules" },
            { label: "Конфиденциальность", href: "/privacy" },
            { label: "Техподдержка", href: "/contacts" },
            { label: "О проекте", href: "/about" },
          ].map(link => (
            <a key={link.href} href={link.href}
              className="font-golos text-xs transition-colors"
              style={{ color: link.href === '/about' ? '#c9a84c' : '#ffffff', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#c9a84c')}
              onMouseLeave={e => (e.currentTarget.style.color = link.href === '/about' ? '#c9a84c' : '#ffffff')}>
              {link.label}
            </a>
          ))}
        </div>
        <p className="font-golos text-sm" style={{ color: '#ffffff' }}>© 2026 Загадай Онлайн · zagadai.online</p>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="font-cormorant text-2xl md:text-3xl mb-4" style={{ color: '#f0e8d0' }}>{title}</h2>
      <div className="font-golos text-sm leading-relaxed" style={{ color: 'rgba(200,210,240,0.7)' }}>
        {children}
      </div>
    </div>
  );
}