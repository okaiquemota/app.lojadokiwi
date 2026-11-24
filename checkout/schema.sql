-- Pedidos da loja (banco D1 "lojadokiwi"). Um pedido nasce quando o cliente
-- clica em comprar ("criado") e muda conforme o Mercado Pago avisa.
CREATE TABLE IF NOT EXISTS pedidos (
  ref            TEXT PRIMARY KEY,           -- código secreto do pedido (vai no link do cliente)
  produto_id     TEXT NOT NULL,
  produto_nome   TEXT NOT NULL,
  valor_centavos INTEGER NOT NULL,
  status         TEXT NOT NULL DEFAULT 'criado', -- criado | pendente | aprovado | recusado | cancelado | estornado
  preferencia_id TEXT,
  pagamento_id   TEXT,
  metodo         TEXT,                       -- pix, master, visa...
  email          TEXT,                       -- e-mail do comprador, informado pelo Mercado Pago
  downloads      INTEGER NOT NULL DEFAULT 0,
  criado_em      TEXT NOT NULL,
  atualizado_em  TEXT NOT NULL,
  aprovado_em    TEXT,
  conferido_em   TEXT                        -- última conferência no Mercado Pago
);
CREATE INDEX IF NOT EXISTS pedidos_status ON pedidos (status, aprovado_em);
CREATE INDEX IF NOT EXISTS pedidos_criado ON pedidos (criado_em);
CREATE INDEX IF NOT EXISTS pedidos_pagamento ON pedidos (pagamento_id);
