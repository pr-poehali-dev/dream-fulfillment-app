interface CertificateData {
  starId: number;
  wish: string;
  amount: number;
  tierLabel: string;
  x: number;
  y: number;
  ownerName: string;
  createdAt: string | null;
}

function formatCertDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function generateCertificateHtml(data: CertificateData): string {
  const { starId, wish, amount, tierLabel, x, y, ownerName, createdAt } = data;

  const escape = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const starUrl = `https://zagadai.online/star/${starId}`;
  const shareText = `Я зажёг звезду №${starId} на zagadai.online! Моё желание: ${wish}. Смотри: ${starUrl}`;

  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8" />
<title>Сертификат звезды №${starId} — Загадай.Онлайн</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Golos+Text:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    background:
      radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.6), transparent),
      radial-gradient(1px 1px at 80% 15%, rgba(255,255,255,0.5), transparent),
      radial-gradient(1.5px 1.5px at 25% 70%, rgba(255,255,255,0.5), transparent),
      radial-gradient(1px 1px at 60% 85%, rgba(255,255,255,0.4), transparent),
      radial-gradient(1.5px 1.5px at 90% 60%, rgba(255,255,255,0.5), transparent),
      radial-gradient(1px 1px at 40% 40%, rgba(255,255,255,0.4), transparent),
      radial-gradient(1px 1px at 15% 90%, rgba(255,255,255,0.4), transparent),
      linear-gradient(180deg, #05060d 0%, #0a0e1a 60%, #060810 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px 16px;
    font-family: 'Golos Text', sans-serif;
  }
  .certificate {
    width: 100%;
    max-width: 680px;
    border: 2px solid #c9a84c;
    border-radius: 16px;
    padding: 48px 40px;
    background: rgba(10, 12, 24, 0.6);
    box-shadow: 0 0 60px rgba(201,168,76,0.15), inset 0 0 40px rgba(201,168,76,0.05);
    text-align: center;
    position: relative;
  }
  .certificate::before {
    content: "";
    position: absolute;
    inset: 8px;
    border: 1px solid rgba(201,168,76,0.35);
    border-radius: 10px;
    pointer-events: none;
  }
  .logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #c9a84c;
    margin-bottom: 28px;
  }
  .logo span { margin-right: 8px; }
  h1 {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 500;
    font-size: 30px;
    color: #f0e8d0;
    margin: 0 0 6px;
  }
  .subtitle {
    font-size: 13px;
    color: rgba(200,210,240,0.5);
    margin-bottom: 32px;
    letter-spacing: 0.05em;
  }
  .star-number {
    font-family: 'Cormorant Garamond', serif;
    font-size: 46px;
    color: #c9a84c;
    margin-bottom: 4px;
  }
  .star-number-label {
    font-size: 11px;
    color: rgba(200,210,240,0.4);
    text-transform: uppercase;
    letter-spacing: 0.15em;
    margin-bottom: 28px;
  }
  .wish-text {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 19px;
    line-height: 1.5;
    color: #e8e2d0;
    margin: 0 0 32px;
    padding: 0 12px;
  }
  .details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 32px;
    text-align: left;
  }
  .detail {
    background: rgba(201,168,76,0.06);
    border: 1px solid rgba(201,168,76,0.15);
    border-radius: 10px;
    padding: 12px 16px;
  }
  .detail-label {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(201,168,76,0.6);
    margin-bottom: 4px;
  }
  .detail-value {
    font-size: 15px;
    color: #f0e8d0;
  }
  .legal {
    font-size: 11px;
    line-height: 1.6;
    color: rgba(200,210,240,0.35);
    border-top: 1px solid rgba(201,168,76,0.15);
    padding-top: 20px;
    margin-bottom: 28px;
    text-align: left;
  }
  .print-btn {
    background: linear-gradient(135deg, #c9a84c, #8a6a20);
    color: #060810;
    border: none;
    border-radius: 999px;
    padding: 12px 32px;
    font-family: 'Golos Text', sans-serif;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
  }
  .share-btn {
    background: #0077ff;
    color: #fff;
    border: none;
    border-radius: 999px;
    padding: 12px 32px;
    font-family: 'Golos Text', sans-serif;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
  }
  .actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
  }
  @media print {
    body { background: #060810 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .no-print { display: none !important; }
  }
</style>
</head>
<body>
  <div class="certificate">
    <div class="logo"><span>✦</span>Загадай.Онлайн</div>
    <h1>Сертификат владельца звезды</h1>
    <div class="subtitle">Цифровая собственность на небосводе</div>

    <div class="star-number">№ ${starId}</div>
    <div class="star-number-label">Номер звезды</div>

    <p class="wish-text">«${escape(wish)}»</p>

    <div class="details">
      <div class="detail">
        <div class="detail-label">Владелец</div>
        <div class="detail-value">${escape(ownerName)}</div>
      </div>
      <div class="detail">
        <div class="detail-label">Тариф</div>
        <div class="detail-value">${escape(tierLabel)} · ${amount} ₽</div>
      </div>
      <div class="detail">
        <div class="detail-label">Координаты на небе</div>
        <div class="detail-value">${x.toFixed(2)}, ${y.toFixed(2)}</div>
      </div>
      <div class="detail">
        <div class="detail-label">Дата зажжения</div>
        <div class="detail-value">${formatCertDate(createdAt)}</div>
      </div>
    </div>

    <div class="legal">
      Настоящий сертификат подтверждает символическое размещение цифрового
      объекта «звезда» на платформе Загадай.Онлайн и не является финансовым
      инструментом, ценной бумагой или гарантией исполнения желания.
      Администрация платформы выступает посредником и не несёт
      ответственности за действия третьих лиц. Звезда закрепляется за
      владельцем как цифровая собственность согласно правилам платформы,
      доступным на сайте zagadai.online.
    </div>

    <div class="actions no-print">
      <button class="print-btn" onclick="window.print()">🖨 Распечатать</button>
      <button class="share-btn" id="share-vk-btn" data-share-text="${escape(shareText)}" data-share-url="${escape(starUrl)}">📢 Поделиться ВКонтакте</button>
    </div>
  </div>
  <script>
    document.getElementById('share-vk-btn').addEventListener('click', function () {
      var text = this.getAttribute('data-share-text');
      var shareUrl = this.getAttribute('data-share-url');
      var url = 'https://vk.com/share.php?url=' + encodeURIComponent(shareUrl) + '&title=' + encodeURIComponent(text);
      window.open(url, '_blank');
    });
  </script>
</body>
</html>`;
}