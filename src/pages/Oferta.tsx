export default function Oferta() {
  return (
    <div className="min-h-screen" style={{ background: "#060810" }}>
      <header
        className="flex items-center justify-between px-6 py-5 md:px-12"
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
      </header>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1
          className="font-cormorant text-4xl md:text-5xl mb-2"
          style={{ color: "#f0e8d0" }}
        >
          Публичная оферта
        </h1>
        <p
          className="font-golos text-sm mb-10"
          style={{ color: "rgba(200,210,240,0.4)" }}
        >
          Редакция от 01.01.2026
        </p>

        <div
          className="glass-panel rounded-xl p-6 mb-6"
          style={{
            border: "1px solid rgba(201,168,76,0.08)",
            textAlign: "left",
          }}
        >
          <h2
            className="font-cormorant text-xl mb-3"
            style={{ color: "#c9a84c" }}
          >
            1. Общие положения
          </h2>
          <p
            className="font-golos text-sm leading-relaxed mb-4"
            style={{ color: "rgba(200,210,240,0.6)" }}
          >
            Настоящая Публичная оферта содержит условия заключения Договора на
            оказание цифровых услуг (далее — «Договор» и/или «Оферта»). Акцептом
            настоящей Оферты признается совершение Заказчиком действий по
            оформлению и оплате услуги на Сайте Исполнителя. Договор считается
            заключенным с момента акцепта Оферты Заказчиком. Сайт Исполнителя в
            сети «Интернет»: https://zagadai.online.
          </p>

          <h2
            className="font-cormorant text-xl mb-3"
            style={{ color: "#c9a84c" }}
          >
            2. Предмет Договора
          </h2>
          <p
            className="font-golos text-sm leading-relaxed mb-4"
            style={{ color: "rgba(200,210,240,0.6)" }}
          >
            2.1. Исполнитель обязуется оказать Заказчику цифровую услугу
            «Зажжение звезды» (далее — Услуга), а Заказчик обязуется оплатить
            её.
            <br />
            2.2. Суть услуги: после оплаты на онлайн-небосводе сайта
            zagadai.online загорается виртуальная звезда, с которой связывается
            желание Заказчика. Активация звезды происходит мгновенно после
            подтверждения факта оплаты.
            <br />
            2.3. Стоимость услуги определяется в соответствии с выбранным
            Заказчиком типом звезды и указана на Сайте.
          </p>

          <h2
            className="font-cormorant text-xl mb-3"
            style={{ color: "#c9a84c" }}
          >
            3. Права и обязанности Сторон
          </h2>
          <p
            className="font-golos text-sm leading-relaxed mb-4"
            style={{ color: "rgba(200,210,240,0.6)" }}
          >
            3.1. Исполнитель обязан: обеспечить мгновенную активацию виртуальной
            звезды на Сайте после успешной оплаты.
            <br />
            3.2. Заказчик обязан: указать достоверное желание в специальной
            форме на Сайте; произвести оплату Услуги в соответствии с выбранным
            типом звезды.
          </p>

          <h2
            className="font-cormorant text-xl mb-3"
            style={{ color: "#c9a84c" }}
          >
            4. Цена и порядок расчетов
          </h2>
          <p
            className="font-golos text-sm leading-relaxed mb-4"
            style={{ color: "rgba(200,210,240,0.6)" }}
          >
            4.1. Цена Услуги определяется на Сайте Исполнителя и фиксируется в
            момент оформления заявки.
            <br />
            4.2. Все расчеты производятся в безналичном порядке через платёжный
            сервис, указанный на Сайте.
            <br />
            4.3. Услуга считается оплаченной с момента поступления денежных
            средств на счёт Исполнителя.
          </p>

          <h2
            className="font-cormorant text-xl mb-3"
            style={{ color: "#c9a84c" }}
          >
            5. Надлежащее оказание услуг
          </h2>
          <p
            className="font-golos text-sm leading-relaxed mb-4"
            style={{ color: "rgba(200,210,240,0.6)" }}
          >
            5.1. Услуга считается оказанной надлежащим образом в момент
            активации виртуальной звезды на Сайте.
            <br />
            5.2. Возврат средств возможен в течение 24 часов с момента оплаты
            при условии, что звезда ещё не была активирована и желание не было
            опубликовано в социальных сетях. Для возврата необходимо обратиться
            в службу поддержки.
          </p>

          <h2
            className="font-cormorant text-xl mb-3"
            style={{ color: "#c9a84c" }}
          >
            6. Реквизиты Исполнителя
          </h2>
          <p
            className="font-golos text-sm leading-relaxed mb-4"
            style={{ color: "rgba(200,210,240,0.6)" }}
          >
            Полное наименование: ИП Хабибуллин Радик Ришатович
            <br />
            ИНН: 027411103939
            <br />
            ОГРН/ОГРНИП: 317028000155545
            <br />
            Контактный телефон: +7 917 425-14-39
            <br />
            Контактный e-mail: zagadai.online@yandex.ru
            <br />
            Адрес сайта: https://zagadai.online
          </p>
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
