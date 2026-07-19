interface Props {
  loading: boolean;
  starsCount: number;
  onClose: () => void;
}

export default function StarMapHeader({ loading, starsCount, onClose }: Props) {
  return (
    <div style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 20px",
      background: "linear-gradient(to bottom, rgba(2,4,14,0.9) 0%, transparent 100%)",
      pointerEvents: "none",
    }}>
      <div style={{ pointerEvents: "auto" }}>
        <div style={{ color: "rgba(200,210,255,0.9)", fontFamily: "'Golos Text', sans-serif", fontSize: 15, fontWeight: 600 }}>
          ✦ Карта звёздного неба
        </div>
        {!loading && (
          <div style={{ color: "rgba(160,170,210,0.5)", fontFamily: "'Golos Text', sans-serif", fontSize: 12, marginTop: 2 }}>
            {starsCount} звёзд · тык — желание · двойной тык — перейти в ВК
          </div>
        )}
      </div>
      <button
        onClick={onClose}
        style={{
          pointerEvents: "auto",
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(200,210,255,0.15)",
          borderRadius: 99,
          color: "rgba(200,210,255,0.7)",
          fontFamily: "'Golos Text', sans-serif",
          fontSize: 13,
          padding: "6px 16px",
          cursor: "pointer",
        }}
      >
        Закрыть
      </button>
    </div>
  );
}
