interface Props {
  numAmount: number;
  payError: string;
  checkingStatus: boolean;
  handleCheckStatus: () => void;
  setStep: (step: "form" | "paying" | "done") => void;
  setPayError: (v: string) => void;
}

export default function WishPayingStep({
  numAmount,
  payError,
  checkingStatus,
  handleCheckStatus,
  setStep,
  setPayError,
}: Props) {
  return (
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
  );
}
