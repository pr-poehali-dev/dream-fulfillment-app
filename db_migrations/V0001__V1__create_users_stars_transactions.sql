
CREATE TABLE t_p75577017_dream_fulfillment_ap.users (
  id          BIGSERIAL PRIMARY KEY,
  vk_id       BIGINT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE t_p75577017_dream_fulfillment_ap.stars (
  id           BIGSERIAL PRIMARY KEY,
  user_id      BIGINT NOT NULL REFERENCES t_p75577017_dream_fulfillment_ap.users(id),
  wish         TEXT NOT NULL,
  story        TEXT,
  amount       NUMERIC(12,2) NOT NULL,
  angel_fund   NUMERIC(12,2) NOT NULL,
  status       TEXT NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'paid', 'fulfilled')),
  x            NUMERIC(5,2),
  y            NUMERIC(5,2),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at      TIMESTAMPTZ,
  fulfilled_at TIMESTAMPTZ
);

CREATE TABLE t_p75577017_dream_fulfillment_ap.transactions (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT NOT NULL REFERENCES t_p75577017_dream_fulfillment_ap.users(id),
  star_id     BIGINT REFERENCES t_p75577017_dream_fulfillment_ap.stars(id),
  amount      NUMERIC(12,2) NOT NULL,
  angel_fund  NUMERIC(12,2) NOT NULL,
  payment_id  TEXT,
  status      TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'succeeded', 'canceled')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ON t_p75577017_dream_fulfillment_ap.stars(user_id);
CREATE INDEX ON t_p75577017_dream_fulfillment_ap.stars(status);
CREATE INDEX ON t_p75577017_dream_fulfillment_ap.transactions(user_id);
