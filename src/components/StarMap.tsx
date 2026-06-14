import { useRef, useEffect, useState, useCallback } from "react";
import func2url from "../../backend/func2url.json";

interface StarData {
  id: number;
  wish: string;
  x: number;
  y: number;
  brightness: number;
  name: string;
  vk_id: number;
  avatar_url: string | null;
  created_at: string | null;
}

interface Props {
  onClose: () => void;
}

const MAP_W = 4000;
const MAP_H = 4000;
const BG_STARS = 600;

function generateBgStars() {
  return Array.from({ length: BG_STARS }, (_, i) => ({
    id: i,
    x: Math.random() * MAP_W,
    y: Math.random() * MAP_H,
    r: Math.random() * 1.2 + 0.3,
    opacity: Math.random() * 0.5 + 0.15,
  }));
}

const bgStars = generateBgStars();

export default function StarMap({ onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stars, setStars] = useState<StarData[]>([]);
  const [loading, setLoading] = useState(true);

  const camRef = useRef({ x: MAP_W / 2, y: MAP_H / 2, zoom: 0.25 });
  const dragRef = useRef<{ active: boolean; startX: number; startY: number; camX: number; camY: number }>({
    active: false, startX: 0, startY: 0, camX: 0, camY: 0,
  });
  const hoveredRef = useRef<StarData | null>(null);
  const tooltipRef = useRef<{ star: StarData; cx: number; cy: number } | null>(null);
  const clickedRef = useRef<StarData | null>(null);
  const rafRef = useRef<number>(0);
  const starsRef = useRef<StarData[]>([]);
  const lastClickTime = useRef(0);
  const lastClickStar = useRef<StarData | null>(null);

  useEffect(() => {
    fetch(`${func2url["get-wish-by-number"]}?action=all`)
      .then((r) => r.json())
      .then((raw) => {
        const data = typeof raw === "string" ? JSON.parse(raw) : raw;
        const list: StarData[] = (data.stars || []).map((s: StarData) => ({
          ...s,
          x: s.x * (MAP_W / 100),
          y: s.y * (MAP_H / 100),
        }));
        setStars(list);
        starsRef.current = list;
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const worldToScreen = useCallback((wx: number, wy: number, canvas: HTMLCanvasElement) => {
    const { x, y, zoom } = camRef.current;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    return {
      sx: (wx - x) * zoom + cx,
      sy: (wy - y) * zoom + cy,
    };
  }, []);

  const screenToWorld = useCallback((sx: number, sy: number, canvas: HTMLCanvasElement) => {
    const { x, y, zoom } = camRef.current;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    return {
      wx: (sx - cx) / zoom + x,
      wy: (sy - cy) / zoom + y,
    };
  }, []);

  const getStarRadius = (brightness: number, zoom: number) => {
    const base = 2 + brightness * 6;
    return Math.max(3, base * Math.min(zoom, 2));
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { zoom } = camRef.current;
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = "rgba(4,6,18,1)";
    ctx.fillRect(0, 0, W, H);

    bgStars.forEach((s) => {
      const { sx, sy } = worldToScreen(s.x, s.y, canvas);
      if (sx < -2 || sx > W + 2 || sy < -2 || sy > H + 2) return;
      ctx.globalAlpha = s.opacity;
      ctx.fillStyle = "#c8d4ff";
      ctx.beginPath();
      ctx.arc(sx, sy, s.r * Math.min(zoom * 1.5, 1.8), 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;

    starsRef.current.forEach((star) => {
      const { sx, sy } = worldToScreen(star.x, star.y, canvas);
      if (sx < -20 || sx > W + 20 || sy < -20 || sy > H + 20) return;

      const r = getStarRadius(star.brightness, zoom);
      const isHovered = hoveredRef.current?.id === star.id;
      const isClicked = clickedRef.current?.id === star.id;
      const displayR = isHovered ? r * 1.4 : r;

      const hue = star.brightness > 0.7 ? 45 : star.brightness > 0.4 ? 200 : 220;
      const sat = star.brightness > 0.7 ? "80%" : "60%";
      const color = `hsl(${hue}, ${sat}, 90%)`;

      const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, displayR * 3);
      glow.addColorStop(0, color.replace(")", ", 0.6)").replace("hsl", "hsla"));
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(sx, sy, displayR * 3, 0, Math.PI * 2);
      ctx.fill();

      const core = ctx.createRadialGradient(sx, sy, 0, sx, sy, displayR);
      core.addColorStop(0, "#ffffff");
      core.addColorStop(0.4, color);
      core.addColorStop(1, color.replace(")", ", 0)").replace("hsl", "hsla"));
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(sx, sy, displayR, 0, Math.PI * 2);
      ctx.fill();

      if ((isHovered || isClicked) && tooltipRef.current?.star.id === star.id) {
        const t = tooltipRef.current;
        const tx = t.cx;
        const ty = t.cy;
        const maxW = 220;
        const pad = 12;
        const name = star.name;
        const wish = star.wish.length > 60 ? star.wish.slice(0, 57) + "…" : star.wish;

        ctx.font = "bold 13px 'Golos Text', sans-serif";
        const nameW = ctx.measureText(name).width;
        ctx.font = "12px 'Golos Text', sans-serif";
        const wishW = ctx.measureText(wish).width;
        const boxW = Math.min(Math.max(nameW, wishW) + pad * 2, maxW);
        const boxH = 56;

        let bx = tx - boxW / 2;
        let by = ty - boxH - displayR - 12;
        if (bx < 4) bx = 4;
        if (bx + boxW > W - 4) bx = W - boxW - 4;
        if (by < 4) by = ty + displayR + 12;

        ctx.globalAlpha = 0.93;
        ctx.fillStyle = "rgba(6,8,20,0.97)";
        ctx.strokeStyle = `${color}88`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(bx, by, boxW, boxH, 10);
        ctx.fill();
        ctx.stroke();
        ctx.globalAlpha = 1;

        ctx.fillStyle = color;
        ctx.font = "bold 12px 'Golos Text', sans-serif";
        ctx.fillText(name, bx + pad, by + 20);

        ctx.fillStyle = "rgba(220,228,255,0.75)";
        ctx.font = "11px 'Golos Text', sans-serif";
        const words = wish.split(" ");
        let line = "";
        let lineY = by + 36;
        for (const word of words) {
          const test = line ? line + " " + word : word;
          if (ctx.measureText(test).width > boxW - pad * 2) {
            ctx.fillText(line, bx + pad, lineY);
            line = word;
            lineY += 14;
            if (lineY > by + boxH - 4) { line = "…"; break; }
          } else {
            line = test;
          }
        }
        if (line) ctx.fillText(line, bx + pad, lineY);
      }
    });

    ctx.globalAlpha = 1;
  }, [worldToScreen]);

  useEffect(() => {
    const loop = () => {
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  const getHitStar = useCallback((sx: number, sy: number, canvas: HTMLCanvasElement) => {
    const { zoom } = camRef.current;
    const { wx, wy } = screenToWorld(sx, sy, canvas);
    let hit: StarData | null = null;
    let minDist = Infinity;
    for (const s of starsRef.current) {
      const dx = s.x - wx;
      const dy = s.y - wy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const threshold = getStarRadius(s.brightness, zoom) * 2.5 / zoom;
      if (dist < threshold && dist < minDist) {
        minDist = dist;
        hit = s;
      }
    }
    return hit;
  }, [screenToWorld]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    if (dragRef.current.active) {
      camRef.current.x = dragRef.current.camX - (sx - dragRef.current.startX) / camRef.current.zoom;
      camRef.current.y = dragRef.current.camY - (sy - dragRef.current.startY) / camRef.current.zoom;
      hoveredRef.current = null;
      tooltipRef.current = null;
      canvas.style.cursor = "grabbing";
      return;
    }

    const hit = getHitStar(sx, sy, canvas);
    hoveredRef.current = hit;
    if (hit) {
      const { sx: hsx, sy: hsy } = worldToScreen(hit.x, hit.y, canvas);
      tooltipRef.current = { star: hit, cx: hsx, cy: hsy };
      canvas.style.cursor = "pointer";
    } else {
      tooltipRef.current = null;
      canvas.style.cursor = "grab";
    }
  }, [getHitStar, worldToScreen]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    dragRef.current = {
      active: true,
      startX: e.clientX - rect.left,
      startY: e.clientY - rect.top,
      camX: camRef.current.x,
      camY: camRef.current.y,
    };
  }, []);

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const dx = Math.abs(sx - dragRef.current.startX);
    const dy = Math.abs(sy - dragRef.current.startY);
    dragRef.current.active = false;

    if (dx < 5 && dy < 5) {
      const hit = getHitStar(sx, sy, canvas);
      if (hit) {
        const now = Date.now();
        if (lastClickStar.current?.id === hit.id && now - lastClickTime.current < 400) {
          if (hit.vk_id) {
            window.open(`https://vk.com/id${hit.vk_id}`, "_blank");
          }
          lastClickStar.current = null;
        } else {
          lastClickTime.current = now;
          lastClickStar.current = hit;
          clickedRef.current = clickedRef.current?.id === hit.id ? null : hit;
          const { sx: hsx, sy: hsy } = worldToScreen(hit.x, hit.y, canvas);
          tooltipRef.current = { star: hit, cx: hsx, cy: hsy };
        }
      } else {
        clickedRef.current = null;
      }
    }
  }, [getHitStar, worldToScreen]);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const { wx, wy } = screenToWorld(mx, my, canvas);

    const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
    const newZoom = Math.max(0.1, Math.min(8, camRef.current.zoom * factor));
    camRef.current.zoom = newZoom;

    const { sx: newSx, sy: newSy } = worldToScreen(wx, wy, canvas);
    camRef.current.x += (newSx - mx) / newZoom;
    camRef.current.y += (newSy - my) / newZoom;
  }, [screenToWorld, worldToScreen]);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      const t = e.touches[0];
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      dragRef.current = {
        active: true,
        startX: t.clientX - rect.left,
        startY: t.clientY - rect.top,
        camX: camRef.current.x,
        camY: camRef.current.y,
      };
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      const t = e.touches[0];
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      const sx = t.clientX - rect.left;
      const sy = t.clientY - rect.top;
      camRef.current.x = dragRef.current.camX - (sx - dragRef.current.startX) / camRef.current.zoom;
      camRef.current.y = dragRef.current.camY - (sy - dragRef.current.startY) / camRef.current.zoom;
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    dragRef.current.active = false;
    const canvas = canvasRef.current;
    if (!canvas || e.changedTouches.length === 0) return;
    const t = e.changedTouches[0];
    const rect = canvas.getBoundingClientRect();
    const sx = t.clientX - rect.left;
    const sy = t.clientY - rect.top;
    const dx = Math.abs(sx - dragRef.current.startX);
    const dy = Math.abs(sy - dragRef.current.startY);
    if (dx < 8 && dy < 8) {
      const hit = getHitStar(sx, sy, canvas);
      if (hit) {
        const now = Date.now();
        if (lastClickStar.current?.id === hit.id && now - lastClickTime.current < 500) {
          if (hit.vk_id) window.open(`https://vk.com/id${hit.vk_id}`, "_blank");
          lastClickStar.current = null;
        } else {
          lastClickTime.current = now;
          lastClickStar.current = hit;
          clickedRef.current = clickedRef.current?.id === hit.id ? null : hit;
          const { sx: hsx, sy: hsy } = worldToScreen(hit.x, hit.y, canvas);
          tooltipRef.current = { star: hit, cx: hsx, cy: hsy };
        }
      } else {
        clickedRef.current = null;
        tooltipRef.current = null;
      }
    }
  }, [getHitStar, worldToScreen]);

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
              {stars.length} звёзд · тык — желание · двойной тык — перейти в ВК
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
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { dragRef.current.active = false; }}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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
    </div>
  );
}
