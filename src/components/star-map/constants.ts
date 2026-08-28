export interface StarData {
  id: number;
  wish: string;
  x: number;
  y: number;
  brightness: number;
  name: string;
  vk_id: number;
  avatar_url: string | null;
  created_at: string | null;
  amount?: number;
}

export const MAP_W = 4000;
export const MAP_H = 4000;
export const BG_STARS = 600;

export function generateBgStars() {
  return Array.from({ length: BG_STARS }, (_, i) => ({
    id: i,
    x: Math.random() * MAP_W,
    y: Math.random() * MAP_H,
    r: Math.random() * 1.2 + 0.3,
    baseOpacity: Math.random() * 0.4 + 0.1,
    twinkleSpeed: Math.random() * 0.8 + 0.3,
    twinklePhase: Math.random() * Math.PI * 2,
  }));
}

export const bgStars = generateBgStars();