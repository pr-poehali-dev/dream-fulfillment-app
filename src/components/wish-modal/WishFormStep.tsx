import { QUICK_AMOUNTS } from "./constants";

interface Props {
  wish: string;
  setWish: (v: string) => void;
  story: string;
  setStory: (v: string) => void;
  amountInput: string;
  handleQuick: (v: number) => void;
  numAmount: number;
  tier: { label: string; icon: string; desc: string };
  email: string;
  setEmail: (v: string) => void;
  isEmailValid: boolean;
  agreeToRules: boolean;
  setAgreeToRules: (v: boolean) => void;
  payError: string;
  isValid: string | boolean;
  saving: boolean;
  user: unknown;
  handleSubmit: () => void;
}

export default function WishFormStep({
  wish,
  setWish,
  story,
  setStory,
  handleQuick,
  numAmount,
  tier,
  email,
  setEmail,
  isEmailValid,
  agreeToRules,
  setAgreeToRules,
  payError,
  isValid,
  saving,
  user,
  handleSubmit,
}: Props) {
  return (
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
            Выберите тариф
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
                  ? "Звёздочка · 10 ₽"
                  : q === 50
                    ? "Звезда · 50 ₽"
                    : q === 100
                      ? "Яркая звезда · 100 ₽"
                      : q === 500
                        ? "Созвездие · 500 ₽"
                        : "Звездопад · 1000 ₽"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
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
              {tier.desc}
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

        <label
          className="flex items-start gap-2.5 cursor-pointer select-none"
          style={{ color: "rgba(200,210,240,0.55)" }}
        >
          <input
            type="checkbox"
            checked={agreeToRules}
            onChange={(e) => setAgreeToRules(e.target.checked)}
            className="mt-0.5"
            style={{
              width: 16,
              height: 16,
              accentColor: "#c9a84c",
              cursor: "pointer",
              flexShrink: 0,
            }}
          />
          <span className="font-golos text-xs leading-snug">
            Согласен с{" "}
            <a
              href="/rules"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#c9a84c", textDecoration: "underline" }}
            >
              правилами размещения рекламы
            </a>
          </span>
        </label>

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
              : !wish.trim()
                ? "Введи желание"
                : !isEmailValid
                  ? "Введи email для чека"
                  : !agreeToRules
                    ? "Согласись с правилами"
                    : `Оплатить ${numAmount} ₽ и зажечь звезду`}
        </button>
      </div>
    </>
  );
}