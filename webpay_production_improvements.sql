-- ============================================
-- MEJORAS DE PRODUCCIÓN PARA WEBPAY PLUS
-- ============================================

-- 1. Tabla de Logs de Auditoría
-- Registra cada transacción para troubleshooting y auditoría
CREATE TABLE IF NOT EXISTS webpay_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    buy_order text NOT NULL,
    token text NOT NULL,
    status text NOT NULL,
    response_code int,
    amount int,
    raw_response jsonb,
    created_at timestamptz DEFAULT now()
);

-- Índice para búsquedas rápidas por buy_order
CREATE INDEX IF NOT EXISTS idx_webpay_logs_buy_order ON webpay_logs(buy_order);
CREATE INDEX IF NOT EXISTS idx_webpay_logs_created_at ON webpay_logs(created_at DESC);

-- 2. Actualizar tabla de payments para soportar más estados
-- Agregar estados: 'refunded' y 'failed'
ALTER TABLE payments 
DROP CONSTRAINT IF EXISTS payments_status_check;

ALTER TABLE payments 
ADD CONSTRAINT payments_status_check 
CHECK (status IN ('pending', 'paid', 'failed', 'refunded'));

-- 3. Agregar columna para tracking de procesamiento
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS processed_at timestamptz;

-- 4. RLS para webpay_logs (solo admins pueden ver)
ALTER TABLE webpay_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins pueden ver logs de WebPay"
  ON webpay_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 5. Función para limpiar suscripciones abandonadas (ejecutar diariamente)
CREATE OR REPLACE FUNCTION cleanup_abandoned_subscriptions()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- Marcar suscripciones pendientes de más de 24 horas como expiradas
    UPDATE student_subscriptions
    SET status = 'expired'
    WHERE status = 'pending_payment'
      AND created_at < NOW() - INTERVAL '24 hours';
    
    -- Marcar pagos pendientes como fallidos
    UPDATE payments
    SET status = 'failed'
    WHERE status = 'pending'
      AND payment_date < NOW() - INTERVAL '24 hours';
END;
$$;

-- Comentarios para documentación
COMMENT ON TABLE webpay_logs IS 'Registro de auditoría de todas las transacciones WebPay';
COMMENT ON FUNCTION cleanup_abandoned_subscriptions IS 'Limpia suscripciones y pagos abandonados (ejecutar diariamente vía cron)';
