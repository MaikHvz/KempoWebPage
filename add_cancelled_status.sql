-- ============================================
-- Agregar estado 'cancelled' a student_subscriptions
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- Eliminar constraint existente si existe
ALTER TABLE public.student_subscriptions
DROP CONSTRAINT IF EXISTS student_subscriptions_status_check;

-- Agregar nuevo constraint con 'cancelled'
ALTER TABLE public.student_subscriptions
ADD CONSTRAINT student_subscriptions_status_check
CHECK (status IN ('pending_payment', 'active', 'expired', 'cancelled'));
