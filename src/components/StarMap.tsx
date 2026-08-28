import { useStarMapEngine } from "./star-map/useStarMapEngine";
import StarMapHeader from "./star-map/StarMapHeader";
import StarMapCanvas from "./star-map/StarMapCanvas";

interface Props {
  onClose: () => void;
}

export default function StarMap({ onClose }: Props) {
  const {
    canvasRef,
    stars,
    loading,
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
  } = useStarMapEngine();

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
    </div>
  );
}