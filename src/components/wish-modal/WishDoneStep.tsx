interface Props {
  tier: { label: string; icon: string; desc: string };
  numAmount: number;
  wish: string;
}

export default function WishDoneStep({ tier, numAmount, wish }: Props) {
  return (
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
  );
}
