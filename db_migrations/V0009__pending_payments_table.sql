CREATE TABLE t_p75577017_dream_fulfillment_ap.pending_payments (
    id bigint PRIMARY KEY DEFAULT nextval('t_p75577017_dream_fulfillment_ap.stars_id_seq'),
    user_id bigint NOT NULL REFERENCES t_p75577017_dream_fulfillment_ap.users(id),
    wish text NOT NULL,
    story text NULL,
    amount numeric(12,2) NOT NULL,
    angel_fund numeric(12,2) NOT NULL,
    email text NOT NULL,
    x numeric(5,2) NULL,
    y numeric(5,2) NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

UPDATE t_p75577017_dream_fulfillment_ap.stars SET status = 'cancelled' WHERE status = 'pending';
UPDATE t_p75577017_dream_fulfillment_ap.transactions SET status = 'cancelled' WHERE status = 'pending';