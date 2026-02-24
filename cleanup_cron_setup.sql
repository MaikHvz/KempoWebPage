-- ============================================
-- CRON JOB: Limpieza de Suscripciones Abandonadas
-- Ejecutar este SQL en Supabase SQL Editor
-- ============================================

-- 1. Habilitar la extensión pg_cron
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Programar limpieza diaria a las 4:00 AM Chile (UTC-3) = 7:00 AM UTC
SELECT cron.schedule(
    'cleanup-abandoned-subscriptions',   -- nombre del job
    '0 7 * * *',                         -- cron: 7 AM UTC = 4 AM Chile
    'SELECT cleanup_abandoned_subscriptions();'
);

-- ============================================
-- COMANDOS ÚTILES (no ejecutar, solo referencia)
-- ============================================

-- Ver todos los jobs programados:
-- SELECT * FROM cron.job;

-- Ver historial de ejecuciones:
-- SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;

-- Eliminar el job si es necesario:
-- SELECT cron.unschedule('cleanup-abandoned-subscriptions');

-- Probar la función manualmente:
-- SELECT cleanup_abandoned_subscriptions();
