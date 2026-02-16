-- 1. Crear tabla de Beneficiarios (Familiares/Alumnos a cargo)
create table public.beneficiaries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null, -- El usuario "padre" o dueño de la cuenta
  full_name text not null,
  birth_date date,
  relationship text, -- 'Hijo', 'Hija', 'Esposo', 'Otro'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS para Beneficiarios
alter table public.beneficiaries enable row level security;

create policy "Usuarios gestionan sus propios beneficiarios"
  on public.beneficiaries for all
  using ( auth.uid() = user_id );

-- 2. Modificar student_subscriptions para apuntar a un beneficiario (opcional)
-- Si beneficiary_id es NULL, la suscripción es para el mismo usuario dueño de la cuenta.
alter table public.student_subscriptions
add column beneficiary_id uuid references public.beneficiaries(id);
