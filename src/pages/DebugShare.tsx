import { useState } from "react";
import func2url from "../../backend/func2url.json";

const STAR_PREVIEW_URL = func2url["star-preview"];

type CheckResult = {
  label: string;
  url: string;
  status: "idle" | "loading" | "ok" | "error";
  info: string;
  ogTags?: Record<string, string | null>;
};

function extractOg(html: string): Record<string, string | null> {
  const tags = ["og:title", "og:description", "og:image", "og:url", "og:type"];
  const result: Record<string, string | null> = {};
  for (const tag of tags) {
    const re1 = new RegExp(
      `<meta[^>]+property=["']${tag}["'][^>]+content=["']([^"']*)["']`,
      "i",
    );
    const re2 = new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]+property=["']${tag}["']`,
      "i",
    );
    const m = html.match(re1) || html.match(re2);
    result[tag] = m ? m[1] : null;
  }
  return result;
}

export default function DebugShare() {
  const [starId, setStarId] = useState("1");
  const [results, setResults] = useState<CheckResult[]>([]);
  const [running, setRunning] = useState(false);

  const runChecks = async () => {
    setRunning(true);
    const id = starId.trim() || "1";
    const domainUrl = `https://zagadai.online/star/${id}`;
    const functionUrl = `${STAR_PREVIEW_URL}?id=${id}`;

    const checks: CheckResult[] = [
      { label: "1. zagadai.online/star/{id} (как видит браузер)", url: domainUrl, status: "loading", info: "" },
      { label: "2. Функция star-preview напрямую (что должен видеть бот)", url: functionUrl, status: "loading", info: "" },
    ];
    setResults([...checks]);

    for (let i = 0; i < checks.length; i++) {
      try {
        const resp = await fetch(checks[i].url, { mode: "cors" });
        const text = await resp.text();
        const looksLikeSpa = text.includes('<script type="module"') || text.includes('id="root"');
        const og = extractOg(text);
        checks[i] = {
          ...checks[i],
          status: "ok",
          info: `HTTP ${resp.status} · ${looksLikeSpa ? "⚠️ Это обычный сайт (SPA), НЕ og-страница" : "Похоже на og-страницу"} · размер ${text.length} байт`,
          ogTags: og,
        };
      } catch (e) {
        checks[i] = {
          ...checks[i],
          status: "error",
          info: `Ошибка запроса: ${e instanceof Error ? e.message : String(e)} (возможно, блокировка CORS — это нормально для браузера, но не для бота ВК)`,
        };
      }
      setResults([...checks]);
    }

    // Проверка картинки отдельно
    const imgCheck: CheckResult = {
      label: "3. Картинка og:image (из функции star-preview)",
      url: "",
      status: "loading",
      info: "",
    };
    setResults((prev) => [...prev, imgCheck]);
    try {
      const resp = await fetch(functionUrl, { mode: "cors" });
      const text = await resp.text();
      const og = extractOg(text);
      const imgUrl = og["og:image"];
      if (!imgUrl) {
        setResults((prev) =>
          prev.map((r) =>
            r.label === imgCheck.label
              ? { ...r, status: "error", info: "og:image не найден в HTML функции" }
              : r,
          ),
        );
      } else {
        const imgResp = await fetch(imgUrl, { mode: "cors" });
        setResults((prev) =>
          prev.map((r) =>
            r.label === imgCheck.label
              ? {
                  ...r,
                  url: imgUrl,
                  status: imgResp.ok ? "ok" : "error",
                  info: `HTTP ${imgResp.status} · ${imgResp.headers.get("content-type") || ""}`,
                }
              : r,
          ),
        );
      }
    } catch (e) {
      setResults((prev) =>
        prev.map((r) =>
          r.label === imgCheck.label
            ? { ...r, status: "error", info: `Ошибка: ${e instanceof Error ? e.message : String(e)}` }
            : r,
        ),
      );
    }

    setRunning(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#060810", color: "#e8e2d0", padding: "40px 20px", fontFamily: "monospace" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontSize: 22, color: "#c9a84c", marginBottom: 8 }}>
          🔧 Отладка репоста в ВКонтакте
        </h1>
        <p style={{ color: "rgba(200,210,240,0.6)", fontSize: 13, marginBottom: 24 }}>
          Эта страница проверяет, что реально отдаётся по ссылкам шаринга — те же данные,
          которые пытается прочитать бот ВКонтакте при репосте.
        </p>

        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          <input
            value={starId}
            onChange={(e) => setStarId(e.target.value)}
            placeholder="Номер звезды"
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid rgba(201,168,76,0.3)",
              background: "rgba(255,255,255,0.05)",
              color: "#e8e2d0",
              width: 160,
            }}
          />
          <button
            onClick={runChecks}
            disabled={running}
            style={{
              padding: "10px 24px",
              borderRadius: 8,
              border: "none",
              background: "linear-gradient(135deg, #c9a84c, #8a6a20)",
              color: "#060810",
              fontWeight: 600,
              cursor: running ? "not-allowed" : "pointer",
              opacity: running ? 0.6 : 1,
            }}
          >
            {running ? "Проверяю…" : "Запустить проверку"}
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {results.map((r, i) => (
            <div
              key={i}
              style={{
                border: `1px solid ${r.status === "ok" ? "rgba(80,200,120,0.4)" : r.status === "error" ? "rgba(220,80,80,0.4)" : "rgba(201,168,76,0.25)"}`,
                borderRadius: 10,
                padding: 16,
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 6, color: "#f0e8d0" }}>
                {r.status === "loading" ? "⏳" : r.status === "ok" ? "✅" : "❌"} {r.label}
              </div>
              {r.url && (
                <div style={{ fontSize: 12, color: "rgba(200,210,240,0.5)", marginBottom: 6, wordBreak: "break-all" }}>
                  {r.url}
                </div>
              )}
              <div style={{ fontSize: 13, color: r.status === "error" ? "#ff8080" : "rgba(220,225,245,0.85)" }}>
                {r.info}
              </div>
              {r.ogTags && (
                <div style={{ marginTop: 10, fontSize: 12, color: "rgba(200,210,240,0.7)" }}>
                  {Object.entries(r.ogTags).map(([k, v]) => (
                    <div key={k}>
                      <span style={{ color: "#c9a84c" }}>{k}:</span> {v ?? "(не найден)"}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {results.length > 0 && !running && (
          <div
            style={{
              marginTop: 24,
              padding: 16,
              borderRadius: 10,
              background: "rgba(201,168,76,0.08)",
              border: "1px solid rgba(201,168,76,0.25)",
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            <strong style={{ color: "#c9a84c" }}>Как читать результат:</strong>
            <br />
            Если проверка №1 (zagadai.online/star/id) показывает «⚠️ Это обычный сайт (SPA)» —
            значит боту ВКонтакте по этой ссылке отдаётся не og-страница, а обычный сайт, и репост не подтянет картинку.
            В этом случае нужно на уровне платформы poehali.dev подключить правило: заходы ботов соцсетей
            на путь /star/{"{id}"} должны направляться на функцию star-preview.
            <br /><br />
            Если проверка №2 (функция star-preview) работает и отдаёт og-теги и картинку — значит сама функция исправна,
            проблема именно в правиле маршрутизации на домене.
          </div>
        )}
      </div>
    </div>
  );
}
