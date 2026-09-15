import { useState } from "react";
import Icon from "@/components/ui/icon";
import func2url from "../../backend/func2url.json";

const STAR_PREVIEW_URL = func2url["star-preview"];

export default function DebugShare() {
  const [starId, setStarId] = useState("1");

  const domainUrl = `https://zagadai.online/star/${starId}`;
  const functionUrl = `${STAR_PREVIEW_URL}?id=${starId}`;
  const vkCheckerUrl = `https://vk.com/dev/pages/preview?act=a_check&url=${encodeURIComponent(domainUrl)}`;

  return (
    <div className="min-h-screen" style={{ background: "#060810" }}>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <a href="/" className="flex items-center gap-2 mb-8" style={{ textDecoration: "none" }}>
          <span style={{ color: "#c9a84c" }}>✦</span>
          <span className="font-cormorant text-xl font-medium tracking-widest uppercase" style={{ color: "#c9a84c" }}>
            Загадай.Онлайн
          </span>
        </a>

        <h1 className="font-cormorant text-3xl mb-2" style={{ color: "#f0e8d0" }}>
          Отладка репоста в ВКонтакте
        </h1>
        <p className="font-golos text-sm mb-8" style={{ color: "rgba(200,210,240,0.5)" }}>
          Введи номер звезды и проверь каждый шаг: что отдаёт функция превью,
          что видит ВК по ссылке на домене, и картинку сертификата.
        </p>

        <div className="mb-8">
          <label className="block font-golos text-xs uppercase mb-2" style={{ color: "rgba(201,168,76,0.6)" }}>
            Номер звезды
          </label>
          <input
            value={starId}
            onChange={(e) => setStarId(e.target.value.replace(/\D/g, ""))}
            className="w-full px-4 py-3 rounded-lg font-golos text-sm"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(201,168,76,0.2)",
              color: "#f0e8d0",
              outline: "none",
            }}
            placeholder="1"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div
            className="rounded-xl p-5"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.15)" }}
          >
            <div className="font-golos text-sm font-semibold mb-1" style={{ color: "#f0e8d0" }}>
              1. Ссылка, которую вставляем в ВК
            </div>
            <div className="font-golos text-xs mb-3" style={{ color: "rgba(200,210,240,0.5)" }}>
              Именно её мы отправляем в vk.com/share.php — красивая ссылка на сайт
            </div>
            <a
              href={domainUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-golos text-sm break-all"
              style={{ color: "#c9a84c" }}
            >
              {domainUrl}
            </a>
          </div>

          <div
            className="rounded-xl p-5"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.15)" }}
          >
            <div className="font-golos text-sm font-semibold mb-1" style={{ color: "#f0e8d0" }}>
              2. Сырой HTML с og-тегами (что должен увидеть бот)
            </div>
            <div className="font-golos text-xs mb-3" style={{ color: "rgba(200,210,240,0.5)" }}>
              Открой эту ссылку — если видишь теги og:title, og:image и картинку сертификата, функция работает исправно
            </div>
            <a
              href={functionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-golos text-sm break-all"
              style={{ color: "#c9a84c" }}
            >
              {functionUrl}
            </a>
          </div>

          <div
            className="rounded-xl p-5"
            style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.3)" }}
          >
            <div className="font-golos text-sm font-semibold mb-1 flex items-center gap-2" style={{ color: "#f0e8d0" }}>
              <Icon name="Sparkles" size={16} style={{ color: "#c9a84c" }} />
              3. Официальный VK-инструмент проверки ссылки
            </div>
            <div className="font-golos text-xs mb-3" style={{ color: "rgba(200,210,240,0.6)" }}>
              Показывает именно то, что видит бот ВК по ссылке на домене — самый точный способ найти проблему
            </div>
            <a
              href={vkCheckerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 rounded-full font-golos text-sm font-semibold"
              style={{ background: "#0077ff", color: "#fff", textDecoration: "none" }}
            >
              Открыть проверку ВКонтакте →
            </a>
          </div>

          <div
            className="rounded-xl p-5"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.15)" }}
          >
            <div className="font-golos text-sm font-semibold mb-2" style={{ color: "#f0e8d0" }}>
              Как читать результат
            </div>
            <ul className="font-golos text-xs space-y-2" style={{ color: "rgba(200,210,240,0.6)" }}>
              <li>• Если ссылка из пункта 2 открывается и показывает og:image, og:title — функция превью работает</li>
              <li>• Если в пункте 3 (проверка ВК) картинка и текст НЕ подтягиваются — значит домен zagadai.online не перенаправляет ботов на функцию превью, это надо чинить на уровне маршрутизации домена (обратиться в поддержку поехали.dev)</li>
              <li>• Если картинка не грузится нигде — проблема в самой генерации og:image (шрифты, S3)</li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-10">
          <a href="/" className="font-golos text-sm" style={{ color: "rgba(200,210,240,0.35)", textDecoration: "none" }}>
            ← Вернуться на главную
          </a>
        </div>
      </div>
    </div>
  );
}
