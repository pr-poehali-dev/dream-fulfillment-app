import { useNavigate } from "react-router-dom";

interface Props {
  tier: { label: string; icon: string; desc: string };
  numAmount: number;
  wish: string;
  starId: number | null;
  onClose: () => void;
}

export default function WishDoneStep({ tier, numAmount, wish, starId, onClose }: Props) {
  const navigate = useNavigate();

  const handleGoToCabinet = () => {
    onClose();
    navigate("/cabinet");
  };

  const handleShareVk = () => {
    const starUrl = starId
      ? `https://zagadai.online/star/${starId}`
      : "https://zagadai.online";
    const shareText = encodeURIComponent(
      starId
        ? `Я зажёг звезду №${starId} на zagadai.online! Моё желание: ${wish}. Смотри: ${starUrl}`
        : `Я зажёг звезду на zagadai.online! Моё желание: ${wish}. Присоединяйся: ${starUrl}`,
    );
    window.open(
      `https://vk.com/share.php?url=${starUrl}&title=${shareText}`,
      "_blank",
    );
    onClose();
  };

  return (
    <div className="text-center py-8">
      <div className="text-5xl mb-4 animate-appear-star">✨</div>
      <h2
        className="font-cormorant text-2xl mb-5"
        style={{ color: "#f0e8d0" }}
      >
        Вселенная говорит:
      </h2>
      <p
        className="font-golos text-base md:text-lg leading-relaxed mb-8"
        style={{ color: "rgba(220,225,245,0.85)" }}
      >
        Мечтатель, скачай свой сертификат в личном кабинете.
        <br />
        <br />
        И помни — только те мечты, что звучат громко, доходят до Ангела.
      </p>

      <div className="flex flex-col gap-3">
        <button
          onClick={handleGoToCabinet}
          className="w-full py-3 rounded-full font-golos font-semibold text-sm transition-all"
          style={{
            background: "linear-gradient(135deg, #c9a84c, #8a6a20)",
            color: "#060810",
            border: "none",
            cursor: "pointer",
          }}
        >
          🎓 Перейти в личный кабинет
        </button>

        <button
          onClick={handleShareVk}
          className="w-full py-3 rounded-full font-golos font-semibold text-sm transition-all"
          style={{
            background: "#0077ff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          📢 Поделиться ВКонтакте
        </button>
      </div>
    </div>
  );
}