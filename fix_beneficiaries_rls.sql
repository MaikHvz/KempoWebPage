-- Permitir que los administradores vean todos los beneficiarios
create policy "Admins ven todos los beneficiarios"
  on public.beneficiaries for select
  using ( exists ( select 1 from public.profiles where id = auth.uid() and role = 'admin' ) );
