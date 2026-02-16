-- Agregamos 'webpay' a los métodos de pago permitidos
ALTER TABLE public.student_subscriptions
DROP CONSTRAINT IF EXISTS student_subscriptions_payment_method_check;

ALTER TABLE public.student_subscriptions
ADD CONSTRAINT student_subscriptions_payment_method_check 
CHECK (payment_method IN ('cash', 'transfer', 'stripe', 'webpay'));
