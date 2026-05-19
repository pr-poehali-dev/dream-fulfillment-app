import Icon from "@/components/ui/icon";

interface FulfilledWish {
  id: number;
  name: string;
  avatar: string;
  wish: string;
  amount: number;
  fulfilledBy: string;
}

const MOCK: FulfilledWish[] = [];

interface Props {
  onClose: () => void;
}

export default function FulfilledModal({ onClose }: Props) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(6,8,16,0.97)",
        backdropFilter: "blur(12px)",
        display: "flex",
        flexDirection: "column",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Шапка модалки */}
      <div
        className="flex items-center justify-between px-6 py-5 md:px-12 shrink-0"
        style={{ borderBottom: "1px solid rgba(201,168,76,0.1)" }}
      >
        <div>
          <h2
            className="font-cormorant text-2xl md:text-3xl"
            style={{ color: "#f0e8d0" }}
          >
            ✦ Исполненные мечты
          </h2>
          <p
            className="font-golos text-xs mt-0.5"
            style={{ color: "rgba(200,210,240,0.35)" }}
          >
            Желания, которые уже сбылись
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(200,210,240,0.5)",
            padding: 8,
          }}
        >
          <Icon name="X" size={22} />
        </button>
      </div>

      {/* Горизонтальный скролл карточек */}
      <div
        className="flex-1 flex items-center"
        style={{ overflowX: "auto", overflowY: "hidden", padding: "40px 48px" }}
      >
        <div className="flex gap-5" style={{ minWidth: "max-content" }}>
          {MOCK.map((item) => (
            <div
              key={item.id}
              className="shrink-0 flex flex-col"
              style={{
                width: 260,
                background: "rgba(201,168,76,0.04)",
                border: "1px solid rgba(201,168,76,0.15)",
                borderRadius: 20,
                padding: "28px 24px",
              }}
            >
              {/* Аватар + имя */}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={item.avatar}
                  alt={item.name}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid rgba(201,168,76,0.4)",
                    filter: "drop-shadow(0 0 8px rgba(201,168,76,0.3))",
                  }}
                />
                <div>
                  <div
                    className="font-golos text-sm font-medium"
                    style={{ color: "#f0e8d0" }}
                  >
                    {item.name}
                  </div>
                  <div
                    className="font-golos text-xs"
                    style={{ color: "rgba(200,210,240,0.35)" }}
                  >
                    {item.amount.toLocaleString("ru-RU")} ₽
                  </div>
                </div>
              </div>

              {/* Желание */}
              <p
                className="font-cormorant text-lg leading-snug flex-1"
                style={{ color: "rgba(240,232,208,0.85)", fontStyle: "italic" }}
              >
                «{item.wish}»
              </p>

              {/* Кем исполнено */}
              <div
                className="flex items-center gap-1.5 mt-5 pt-4"
                style={{ borderTop: "1px solid rgba(201,168,76,0.08)" }}
              >
                <span style={{ fontSize: 14 }}>🔴</span>
                <span
                  className="font-golos text-xs"
                  style={{ color: "rgba(201,168,76,0.6)" }}
                >
                  Исполнено: {item.fulfilledBy}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        ::-webkit-scrollbar { height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.2); border-radius: 2px; }
      `}</style>
    </div>
  );
}
