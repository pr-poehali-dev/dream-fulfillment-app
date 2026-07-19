import { RefObject } from "react";

interface Props {
  canvasRef: RefObject<HTMLCanvasElement>;
  dragRef: RefObject<{ active: boolean; startX: number; startY: number; camX: number; camY: number }>;
  loading: boolean;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onWheel: (e: React.WheelEvent<HTMLCanvasElement>) => void;
  onTouchStart: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  onTouchMove: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  onTouchEnd: (e: React.TouchEvent<HTMLCanvasElement>) => void;
}

export default function StarMapCanvas({
  canvasRef,
  dragRef,
  loading,
  onMouseMove,
  onMouseDown,
  onMouseUp,
  onWheel,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: Props) {
  return (
    <>
      {loading && (
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(200,210,255,0.4)",
          fontFamily: "'Golos Text', sans-serif",
          fontSize: 14,
          zIndex: 5,
        }}>
          Загружаю звёзды…
        </div>
      )}

      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block", cursor: "grab", touchAction: "none" }}
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={() => { if (dragRef.current) dragRef.current.active = false; }}
        onWheel={onWheel}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />

      <div style={{
        position: "absolute",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        color: "rgba(160,170,210,0.35)",
        fontFamily: "'Golos Text', sans-serif",
        fontSize: 11,
        pointerEvents: "none",
        textAlign: "center",
      }}>
        Скролл / pinch — масштаб · тащи — перемещение
      </div>
    </>
  );
}