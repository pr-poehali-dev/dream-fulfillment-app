import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { useUser } from "@/context/UserContext";
import func2url from "../../backend/func2url.json";

interface Props {
  onClose: () => void;
  onSent: (amount: number, wish: string, x?: number, y?: number) => void;
}

function getStarTier(amount: number) {
  if (amount >= 1000)
    return { label: "Звездопад", icon: "🌟", desc: "Мощный и незабываемый" };
  if (amount >= 500)
    return { label: "Созвездие", icon: "✨", desc: "Центр притяжения" };
  if (amount >= 100)
    return { label: "Яркая звезда", icon: "⭐", desc: "Видно издалека" };
  if (amount >= 50)
    return { label: "Звезда", icon: "💫", desc: "Уверенная и заметная" };
  return { label: "Звёздочка", icon: "·", desc: "Скромная, но заметная" };
}

const QUICK_AMOUNTS = [10, 50, 100, 500, 1000];

export default function WishModal({ onClose, onSent }: Props) {
  const { user } = useUser();
  const [wish, setWish] = useState("");
  const [story, setStory] = useState("");
  const [amount, setAmount] = useState<number | "">(100);
  const [amountInput, setAmountInput] = useState("100");
  const [step, setStep] = useState<"form" | "paying" | "done">("form");
  const [saving, setSaving] = useState(false);
  const [pendingStarId, setPendingStarId] = useState<number | null>(null);
  const [pendingCoords, setPendingCoords] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [payError, setPayError] = useState("");
  const [email, setEmail] = useState(user?.email || "");

  useEffect(() => {
    if (user?.email && !email) setEmail(user.email);
  }, [user?.email]);

  const numAmount = typeof amount === "number" ? amount : 0;
  const tier = getStarTier(numAmount);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValid = wish.trim() && numAmount >= 10 && isEmailValid;

  const handleAmountInput = (val: string) => {
    setAmountInput(val);
    const n = parseInt(val, 10);
    setAmount(isNaN(n) ? "" : n);
  };

  const handleQuick = (val: number) => {
    setAmount(val);
    setAmountInput(String(val));
  };

  const handleSubmit = async () => {
    if (!isValid || !user) return;
    setSaving(true);
    setPayError("");
    try {
      const res = await fetch(func2url["save-wish"], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          wish,
          story,
          amount: numAmount,
          email,
        }),
      });
      const data = await res.json();
      if (data.id) {
        setPendingStarId(data.id);
        setPendingCoords({ x: data.x, y: data.y });
        window.open(
          `https://www.walletone.com/checkout/default?i=828301c3&m=zagadai.online&o=${data.id}&a=${numAmount}&c=RUB`,
          "_blank",
        );
        setStep("paying");
      } else {
        setPayError(data.error || "Не удалось создать звезду");
      }
    } catch {
      setPayError("Ошибка соединения. Попробуй ещё раз.");
    }
    setSaving(false);
  };

  const handleCheckStatus = async () => {
    if (!pendingStarId) return;
    setCheckingStatus(true);
    try {
      const res = await fetch(func2url["save-wish"], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "status", star_id: pendingStarId }),
      });
      const data = await res.json();
      if (data.status === "active") {
        setStep("done");
        setTimeout(
          () => onSent(numAmount, wish, pendingCoords?.x, pendingCoords?.y),
          1500,
        );
      } else {
        setPayError(
          "Оплата ещё не подтверждена. Подожди немного и попробуй снова.",
        );
      }
    } catch {
      setPayError("Ошибка проверки. Попробуй ещё раз.");
    }
    setCheckingStatus(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(6,8,16,0.92)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="animate-modal-in w-full max-w-lg glass-panel rounded-3xl p-6 md:p-8 relative"
        style={{
          border: "1px solid rgba(201,168,76,0.2)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 transition-colors"
          style={{
            color: "rgba(200,210,240,0.4)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a84c")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(200,210,240,0.4)")
          }
        >
          <Icon name="X" size={20} />
        </button>

        {step === "form" && (
          <>
            <div className="text-center mb-6">
              <div className="text-3xl mb-2"></div>
              <h2
                className="font-cormorant text-2xl md:text-3xl mb-1"
                style={{ color: "#f0e8d0" }}
              >
                Загадай желание
              </h2>
              <p
                className="font-golos text-xs"
                style={{ color: "rgba(200,210,240,0.45)" }}
              >
                Колодец слушает тебя
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className="font-golos text-xs mb-2 block"
                  style={{
                    color: "rgba(201,168,76,0.7)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Твоё желание
                </label>
                <textarea
                  value={wish}
                  onChange={(e) => setWish(e.target.value)}
                  placeholder="Опиши своё желание подробно и искренне..."
                  rows={3}
                  maxLength={300}
                  className="w-full rounded-xl px-4 py-3 font-golos text-sm resize-none focus:outline-none transition-all"
                  style={{
                    background: "rgba(20,25,40,0.8)",
                    border: "1px solid rgba(201,168,76,0.2)",
                    color: "#f0e8d0",
                    caretColor: "#c9a84c",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(201,168,76,0.5)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(201,168,76,0.2)")
                  }
                />
                <div
                  className="text-right mt-1 font-golos text-xs"
                  style={{ color: "rgba(200,210,240,0.3)" }}
                >
                  {wish.length}/300
                </div>
              </div>

              <div>
                <label
                  className="font-golos text-xs mb-2 block"
                  style={{
                    color: "rgba(201,168,76,0.7)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  История (необязательно)
                </label>
                <textarea
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="Расскажи, почему это желание важно для тебя..."
                  rows={2}
                  maxLength={500}
                  className="w-full rounded-xl px-4 py-3 font-golos text-sm resize-none focus:outline-none transition-all"
                  style={{
                    background: "rgba(20,25,40,0.8)",
                    border: "1px solid rgba(201,168,76,0.15)",
                    color: "#f0e8d0",
                    caretColor: "#c9a84c",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(201,168,76,0.5)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(201,168,76,0.15)")
                  }
                />
              </div>

              <div>
                <label
                  className="font-golos text-xs mb-3 block"
                  style={{
                    color: "rgba(201,168,76,0.7)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Размер монетки — любая сумма от 10 ₽
                </label>

                <div className="flex gap-2 mb-3 flex-wrap">
                  {QUICK_AMOUNTS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleQuick(q)}
                      className="px-3 py-1.5 rounded-full font-golos text-sm transition-all"
                      style={{
                        background:
                          numAmount === q
                            ? "linear-gradient(135deg, rgba(201,168,76,0.3), rgba(201,168,76,0.1))"
                            : "rgba(20,25,40,0.6)",
                        border: `1px solid ${numAmount === q ? "rgba(201,168,76,0.6)" : "rgba(201,168,76,0.15)"}`,
                        color:
                          numAmount === q
                            ? "#c9a84c"
                            : "rgba(200,210,240,0.55)",
                      }}
                    >
                      {q === 10
                        ? "Звёздочка"
                        : q === 50
                          ? "Звезда"
                          : q === 100
                            ? "Яркая звезда"
                            : q === 500
                              ? "Созвездие"
                              : "Звездопад"}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min={10}
                      value={amountInput}
                      onChange={(e) => handleAmountInput(e.target.value)}
                      placeholder="Своя сумма"
                      className="w-full rounded-xl px-4 py-3 font-golos text-sm focus:outline-none transition-all"
                      style={{
                        background: "rgba(20,25,40,0.8)",
                        border: `1px solid ${numAmount >= 10 ? "rgba(201,168,76,0.4)" : "rgba(201,168,76,0.15)"}`,
                        color: "#f0e8d0",
                        caretColor: "#c9a84c",
                      }}
                      onFocus={(e) =>
                        (e.target.style.borderColor = "rgba(201,168,76,0.6)")
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor =
                          numAmount >= 10
                            ? "rgba(201,168,76,0.4)"
                            : "rgba(201,168,76,0.15)")
                      }
                    />
                    <span
                      className="absolute right-4 top-1/2 -translate-y-1/2 font-golos text-sm"
                      style={{ color: "rgba(201,168,76,0.5)" }}
                    >
                      ₽
                    </span>
                  </div>

                  {numAmount >= 10 && (
                    <div className="flex flex-col items-center gap-1 min-w-[64px]">
                      <span
                        style={{
                          fontSize:
                            numAmount >= 1000 ? 28 : numAmount >= 100 ? 22 : 16,
                        }}
                      >
                        {tier.icon}
                      </span>
                      <span
                        className="font-golos text-xs text-center"
                        style={{
                          color: "rgba(201,168,76,0.7)",
                          lineHeight: 1.2,
                        }}
                      >
                        {tier.label}
                      </span>
                    </div>
                  )}
                </div>

                {numAmount >= 10 && (
                  <p
                    className="font-golos text-xs mt-2"
                    style={{ color: "rgba(200,210,240,0.4)" }}
                  >
                    {tier.desc} · чем крупнее монета, тем ярче звезда
                  </p>
                )}
                {numAmount > 0 && numAmount < 10 && (
                  <p
                    className="font-golos text-xs mt-2"
                    style={{ color: "rgba(220,80,80,0.7)" }}
                  >
                    Минимальная сумма — 10 ₽
                  </p>
                )}
              </div>

              <div>
                <label
                  className="font-golos text-xs mb-2 block"
                  style={{
                    color: "rgba(201,168,76,0.7)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Email для чека
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-xl px-4 py-3 font-golos text-sm focus:outline-none transition-all"
                  style={{
                    background: "rgba(20,25,40,0.8)",
                    border: `1px solid ${email && !isEmailValid ? "rgba(220,80,80,0.5)" : "rgba(201,168,76,0.2)"}`,
                    color: "#f0e8d0",
                    caretColor: "#c9a84c",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(201,168,76,0.5)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor =
                      email && !isEmailValid
                        ? "rgba(220,80,80,0.5)"
                        : "rgba(201,168,76,0.2)")
                  }
                />
                <p
                  className="font-golos text-xs mt-1"
                  style={{ color: "rgba(200,210,240,0.3)" }}
                >
                  Чек придёт на этот адрес
                </p>
              </div>

              {payError && (
                <p
                  className="font-golos text-xs text-center"
                  style={{ color: "rgba(220,80,80,0.85)" }}
                >
                  {payError}
                </p>
              )}

              <button
                onClick={handleSubmit}
                disabled={!isValid || saving || !user}
                className="w-full py-3 rounded-full font-golos font-semibold text-sm transition-all mt-2"
                style={{
                  background:
                    isValid && user
                      ? "linear-gradient(135deg, #c9a84c, #8a6a20)"
                      : "rgba(201,168,76,0.15)",
                  color: isValid && user ? "#060810" : "rgba(200,210,240,0.3)",
                  cursor:
                    isValid && user && !saving ? "pointer" : "not-allowed",
                }}
              >
                {saving
                  ? "Создаём платёж..."
                  : !user
                    ? "Войди, чтобы загадать желание"
                    : !wish.trim() || numAmount < 10
                      ? "Введи желание и сумму"
                      : !isEmailValid
                        ? "Введи email для чека"
                        : `Оплатить ${numAmount} ₽ и зажечь звезду`}
              </button>
            </div>
          </>
        )}

        {step === "paying" && (
          <div className="text-center py-6">
            <div className="text-5xl mb-4">💳</div>
            <h2
              className="font-cormorant text-2xl mb-3"
              style={{ color: "#f0e8d0" }}
            >
              Оплата открыта
            </h2>
            <p
              className="font-golos text-sm mb-1"
              style={{ color: "rgba(200,210,240,0.6)" }}
            >
              Оплати <strong style={{ color: "#c9a84c" }}>{numAmount} ₽</strong>{" "}
              в открывшейся вкладке Wallet One.
            </p>
            <p
              className="font-golos text-xs mb-6"
              style={{ color: "rgba(200,210,240,0.35)" }}
            >
              После оплаты вернись сюда и нажми кнопку ниже
            </p>

            {payError && (
              <p
                className="font-golos text-xs mb-4"
                style={{ color: "rgba(220,80,80,0.85)" }}
              >
                {payError}
              </p>
            )}

            <button
              onClick={handleCheckStatus}
              disabled={checkingStatus}
              className="w-full py-3 rounded-full font-golos font-semibold text-sm mb-3 transition-all"
              style={{
                background: checkingStatus
                  ? "rgba(201,168,76,0.3)"
                  : "linear-gradient(135deg, #c9a84c, #8a6a20)",
                color: checkingStatus ? "rgba(200,210,240,0.4)" : "#060810",
                cursor: checkingStatus ? "default" : "pointer",
                border: "none",
              }}
            >
              {checkingStatus
                ? "Проверяем оплату..."
                : "Я оплатил — зажечь звезду ✨"}
            </button>

            <button
              onClick={() => {
                setStep("form");
                setPayError("");
              }}
              className="w-full py-2 rounded-full font-golos text-xs transition-all"
              style={{
                background: "transparent",
                border: "1px solid rgba(200,210,240,0.1)",
                color: "rgba(200,210,240,0.35)",
                cursor: "pointer",
              }}
            >
              Назад
            </button>
          </div>
        )}

        {step === "done" && (
          <div className="text-center py-8">
            <div className="text-5xl mb-4 animate-appear-star">{tier.icon}</div>
            <h2
              className="font-cormorant text-2xl mb-3"
              style={{ color: "#f0e8d0" }}
            >
              Звезда зажглась!
            </h2>
            <p
              className="font-golos text-sm mb-2"
              style={{ color: "rgba(200,210,240,0.55)" }}
            >
              Твоё желание теперь ждёт своего Ангела.
            </p>
            <p
              className="font-golos text-xs"
              style={{ color: "rgba(201,168,76,0.6)" }}
            >
              {tier.label} · {numAmount} ₽ · {tier.desc}
            </p>
            <p className="mt-4">
              <button
                onClick={() => {
                  const shareText = encodeURIComponent(
                    `✨ Я только что зажёг ${tier.label} на «Загадай Онлайн»!\n\nМоё желание: ${wish}\n\nПрисоединяйтесь: https://zagadai.online\n\n#ЗагадайОнлайн #КолодецЖеланий`,
                  );
                  window.open(
                    `https://vk.com/share.php?url=https://zagadai.online&title=${shareText}`,
                    "_blank",
                  );
                }}
                className="px-5 py-2 rounded-full font-golos text-sm transition-all"
                style={{
                  background: "#0077ff",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                📢 Поделиться ВКонтакте
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}