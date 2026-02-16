import { createClient } from '@supabase/supabase-js';

// NOTA: Esta clave es secreta y solo debe usarse en el servidor (API Routes).
// Permite saltarse las reglas de seguridad RLS (Row Level Security).
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);

export default supabaseAdmin;
