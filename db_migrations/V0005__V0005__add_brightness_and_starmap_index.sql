-- Добавляем brightness для звёздной карты и индекс по координатам
ALTER TABLE t_p75577017_dream_fulfillment_ap.stars
  ADD COLUMN IF NOT EXISTS brightness NUMERIC(3,2) NOT NULL DEFAULT 0.8;

-- Индекс для быстрой выборки активных звёзд по координатам
CREATE INDEX IF NOT EXISTS stars_status_xy_idx
  ON t_p75577017_dream_fulfillment_ap.stars(status, x, y)
  WHERE status = 'paid';
