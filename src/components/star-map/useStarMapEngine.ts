import { useRef, useEffect, useState, useCallback } from "react";
import func2url from "../../../backend/func2url.json";
import { StarData, MAP_W, MAP_H, bgStars } from "./constants";

export function useStarMapEngine() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stars, setStars] = useState<StarData[]>([]);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState<{ star: StarData; sx: number; sy: number; pinned: boolean } | null>(null);

  const camRef = useRef({ x: MAP_W / 2, y: MAP_H / 2, zoom: 0.25 });
  const dragRef = useRef<{ active: boolean; startX: number; startY: number; camX: number; camY: number }>({
    active: false, startX: 0, startY: 0, camX: 0, camY: 0,
  });
  const hoveredRef = useRef<StarData | null>(null);
  const clickedRef = useRef<StarData | null>(null);
  const rafRef = useRef<number>(0);
  const starsRef = useRef<StarData[]>([]);
  const lastClickTime = useRef(0);
  const lastClickStar = useRef<StarData | null>(null);
  const flyRef = useRef<{ tx: number; ty: number; tz: number } | null>(null);
  const lastTooltipPos = useRef<{ sx: number; sy: number } | null>(null);

  useEffect(() => {
    fetch(`${func2url["get-wish-by-number"]}?action=all`)
      .then((r) => r.json())
      .then((raw) => {
        const data = typeof raw === "string" ? JSON.parse(raw) : raw;
        const list: StarData[] = (data.stars || []).map((s: StarData) => ({
          ...s,
          x: s.x * (MAP_W / 100),
          y: s.y * (MAP_H / 100),
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.6 + 0.2,
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
    const safeBrightness = Number.isFinite(brightness) ? brightness : 0.8;
    const base = 2 + safeBrightness * 6;
    return Math.max(3, base * Math.min(zoom, 2));
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const t = performance.now() / 1000;
    const { zoom } = camRef.current;
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = "rgba(4,6,18,1)";
    ctx.fillRect(0, 0, W, H);

    bgStars.forEach((s) => {
      const { sx, sy } = worldToScreen(s.x, s.y, canvas);
      if (sx < -2 || sx > W + 2 || sy < -2 || sy > H + 2) return;
      const twinkle = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinklePhase);
      ctx.globalAlpha = s.baseOpacity * (0.5 + 0.5 * twinkle);
      ctx.fillStyle = "#c8d4ff";
      ctx.beginPath();
      ctx.arc(sx, sy, s.r * (0.85 + 0.15 * twinkle) * Math.min(zoom * 1.5, 1.8), 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;

    starsRef.current.forEach((star) => {
      const { sx, sy } = worldToScreen(star.x, star.y, canvas);
      if (sx < -20 || sx > W + 20 || sy < -20 || sy > H + 20) return;

      const phase = (star as StarData & { twinklePhase?: number }).twinklePhase ?? 0;
      const speed = (star as StarData & { twinkleSpeed?: number }).twinkleSpeed ?? 0.4;
      const twinkle = 0.5 + 0.5 * Math.sin(t * speed + phase);
      const twinkleFactor = 0.82 + 0.18 * twinkle;

      const r = getStarRadius(star.brightness, zoom);
      const isHovered = hoveredRef.current?.id === star.id;
      const isClicked = clickedRef.current?.id === star.id;
      const displayR = (isHovered ? r * 1.4 : r) * twinkleFactor;

      const hue = star.brightness > 0.7 ? 45 : star.brightness > 0.4 ? 200 : 220;
      const sat = star.brightness > 0.7 ? "80%" : "60%";
      const color = `hsl(${hue}, ${sat}, 90%)`;

      const glowAlpha = (0.45 + 0.25 * twinkle).toFixed(2);
      const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, displayR * 3.5);
      glow.addColorStop(0, color.replace(")", `, ${glowAlpha})`).replace("hsl", "hsla"));
      glow.addColorStop(0.5, color.replace(")", ", 0.12)").replace("hsl", "hsla"));
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(sx, sy, displayR * 3.5, 0, Math.PI * 2);
      ctx.fill();

      const core = ctx.createRadialGradient(sx, sy, 0, sx, sy, displayR);
      core.addColorStop(0, "#ffffff");
      core.addColorStop(0.4, color);
      core.addColorStop(1, color.replace(")", ", 0)").replace("hsl", "hsla"));
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(sx, sy, displayR, 0, Math.PI * 2);
      ctx.fill();

      if (isHovered || isClicked) {
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(sx, sy, displayR + 3, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    ctx.globalAlpha = 1;
  }, [worldToScreen]);

  useEffect(() => {
    const loop = () => {
      if (flyRef.current && !dragRef.current.active) {
        const { tx, ty, tz } = flyRef.current;
        const speed = 0.072;
        camRef.current.x += (tx - camRef.current.x) * speed;
        camRef.current.y += (ty - camRef.current.y) * speed;
        camRef.current.zoom += (tz - camRef.current.zoom) * speed;
        const dx = Math.abs(camRef.current.x - tx);
        const dy = Math.abs(camRef.current.y - ty);
        const dz = Math.abs(camRef.current.zoom - tz);
        if (dx < 0.5 && dy < 0.5 && dz < 0.005) {
          camRef.current.x = tx;
          camRef.current.y = ty;
          camRef.current.zoom = tz;
          flyRef.current = null;
        }
      }
      draw();

      const pinned = clickedRef.current;
      const active = pinned || hoveredRef.current;
      const canvas = canvasRef.current;
      if (active && canvas) {
        const { sx, sy } = worldToScreen(active.x, active.y, canvas);
        const last = lastTooltipPos.current;
        if (!last || Math.abs(last.sx - sx) > 0.5 || Math.abs(last.sy - sy) > 0.5) {
          lastTooltipPos.current = { sx, sy };
          setTooltip({ star: active, sx, sy, pinned: !!pinned });
        }
      } else if (lastTooltipPos.current !== null) {
        lastTooltipPos.current = null;
        setTooltip(null);
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw, worldToScreen]);

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
      canvas.style.cursor = "grabbing";
      return;
    }

    const hit = getHitStar(sx, sy, canvas);
    hoveredRef.current = hit;
    canvas.style.cursor = hit ? "pointer" : "grab";
  }, [getHitStar]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    flyRef.current = null;
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
          flyRef.current = { tx: hit.x, ty: hit.y, tz: Math.max(camRef.current.zoom, 1.8) };
        }
      } else {
        clickedRef.current = null;
        flyRef.current = null;
      }
    }
  }, [getHitStar]);

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
          flyRef.current = { tx: hit.x, ty: hit.y, tz: Math.max(camRef.current.zoom, 1.8) };
        }
      } else {
        clickedRef.current = null;
        flyRef.current = null;
      }
    }
  }, [getHitStar]);

  const closeTooltip = useCallback(() => {
    clickedRef.current = null;
    hoveredRef.current = null;
  }, []);

  return {
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
  };
}