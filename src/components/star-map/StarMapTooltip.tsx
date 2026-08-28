import { StarData } from "./constants";

interface Props {
  tooltip: { star: StarData; sx: number; sy: number; pinned: boolean };
  containerWidth: number;
  containerHeight: number;
  onClose: () => void;
}

export default function StarMapTooltip({ tooltip, containerWidth, containerHeight, onClose }: Props) {
  const { star, sx, sy, pinned } = tooltip;
  const boxW = 260;
  const gap = 18;

  let left = sx - boxW / 2;
  left = Math.max(8, Math.min(left, containerWidth - boxW - 8));

  const showAbove = sy > 180;
  const top = showAbove ? undefined : sy + gap;
  const bottom = showAbove ? containerHeight - sy + gap : undefined;

  const avatar = star.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${star.id}`;

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        bottom,
        width: boxW,
        zIndex: 50,
        background: "rgba(6,8,20,0.97)",
        border: "1px solid rgba(201,168,76,0.35)",
        borderRadius: 14,
        padding: "14px 16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        backdropFilter: "blur(12px)",
        pointerEvents: pinned ? "auto" : "none",
      }}
    >
      {pinned && (
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: "none",
            border: "none",
            color: "rgba(200,210,240,0.4)",
            cursor: "pointer",
            fontSize: 14,
            lineHeight: 1,
            padding: 4,
          }}
        >
          ✕
        </button>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <img
          src={avatar}
          alt={star.name}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            objectFit: "cover",
            border: "1px solid rgba(201,168,76,0.4)",
            flexShrink: 0,
          }}
        />
        <div style={{ minWidth: 0 }}>
          {star.vk_id ? (
            <a
              href={`https://vk.com/id${star.vk_id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#c9a84c",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "'Golos Text', sans-serif",
                textDecoration: "none",
                pointerEvents: "auto",
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              {star.name}
            </a>
          ) : (
            <span
              style={{
                color: "#c9a84c",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "'Golos Text', sans-serif",
              }}
            >
              {star.name}
            </span>
          )}
          {star.amount !== undefined && (
            <div style={{ color: "rgba(201,168,76,0.6)", fontSize: 11, fontFamily: "'Golos Text', sans-serif" }}>
              {star.amount} ₽
            </div>
          )}
        </div>
      </div>

      <p
        style={{
          color: "rgba(230,232,250,0.9)",
          fontSize: 13,
          lineHeight: 1.5,
          margin: 0,
          fontStyle: "italic",
          fontFamily: "'Golos Text', sans-serif",
          wordBreak: "break-word",
        }}
      >
        «{star.wish}»
      </p>

      {star.vk_id && (
        <a
          href={`https://vk.com/id${star.vk_id}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            marginTop: 10,
            fontSize: 12,
            color: "#0077ff",
            textDecoration: "none",
            fontFamily: "'Golos Text', sans-serif",
            pointerEvents: "auto",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          Профиль ВКонтакте →
        </a>
      )}
    </div>
  );
}
