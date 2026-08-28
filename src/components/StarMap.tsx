import { useStarMapEngine } from "./star-map/useStarMapEngine";
import StarMapHeader from "./star-map/StarMapHeader";
import StarMapCanvas from "./star-map/StarMapCanvas";

interface Props {
  onClose: () => void;
  focusStarId?: number;
}

export default function StarMap({ onClose, focusStarId }: Props) {
  const {
    canvasRef,
    stars,
    loading,
    starNotFound,
    dragRef,
    tooltip,
    closeTooltip,
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useStarMapEngine(focusStarId);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(2,4,14,0.97)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <StarMapHeader loading={loading} starsCount={stars.length} onClose={onClose} />

      <StarMapCanvas
        canvasRef={canvasRef}
        dragRef={dragRef}
        loading={loading}
        tooltip={tooltip}
        onCloseTooltip={closeTooltip}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {!loading && starNotFound && (
        <div
          style={{
            position: "absolute",
            top: 90,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 60,
            background: "rgba(20,6,8,0.95)",
            border: "1px solid rgba(220,80,80,0.4)",
            borderRadius: 99,
            padding: "10px 20px",
            color: "rgba(220,120,120,0.95)",
            fontFamily: "'Golos Text', sans-serif",
            fontSize: 13,
          }}
        >
          Звезда №{focusStarId} не найдена
        </div>
      )}
    </div>
  );
}