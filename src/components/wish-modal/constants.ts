export function getStarTier(amount: number) {
  if (amount >= 1000)
    return { label: "Звездопад", icon: "🌟", desc: "Мощный и незабываемый" };
  if (amount >= 500)
    return { label: "Созвездие", icon: "✨", desc: "Центр притяжения" };
  if (amount >= 100)
    return { label: "Яркая звезда", icon: "⭐", desc: "Видно издалека" };
  if (amount >= 50)
    return { label: "Звезда", icon: "💫", desc: "Уверенная и заметная" };
  return { label: "Звёздочка", icon: "·", desc: "Скромная, но заметная" };
}

export const QUICK_AMOUNTS = [10, 50, 100, 500, 1000];
