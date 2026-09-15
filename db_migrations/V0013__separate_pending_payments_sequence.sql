-- Разделяем нумерацию: у заявок на оплату (pending_payments) теперь свой
-- собственный счётчик, независимый от номеров звёзд (stars_id_seq).
-- Раньше обе таблицы использовали одну последовательность stars_id_seq,
-- из-за чего неоплаченные/брошенные заявки "съедали" номера будущих звёзд.
CREATE SEQUENCE t_p75577017_dream_fulfillment_ap.pending_payments_id_seq;

ALTER TABLE t_p75577017_dream_fulfillment_ap.pending_payments
  ALTER COLUMN id SET DEFAULT nextval('t_p75577017_dream_fulfillment_ap.pending_payments_id_seq');

SELECT setval(
  't_p75577017_dream_fulfillment_ap.pending_payments_id_seq',
  1,
  false
);