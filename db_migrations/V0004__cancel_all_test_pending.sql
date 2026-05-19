UPDATE t_p75577017_dream_fulfillment_ap.stars
SET status = 'cancelled'
WHERE status = 'pending';

UPDATE t_p75577017_dream_fulfillment_ap.transactions
SET status = 'cancelled'
WHERE status = 'pending';