-- 1. Create Table
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. Indexes
create index notes_user_id_idx on public.notes(user_id);
create index notes_created_at_idx on public.notes(created_at);

-- 3. Enable RLS
alter table public.notes enable row level security;

-- 4. RLS Policies

-- SELECT: Users can read ONLY their notes
create policy "Users can read own notes" 
on public.notes for select 
using (auth.uid() = user_id);

-- INSERT: Users can insert notes ONLY for themselves
create policy "Users can insert own notes" 
on public.notes for insert 
with check (auth.uid() = user_id);

-- UPDATE: Users can update ONLY their notes
create policy "Users can update own notes" 
on public.notes for update 
using (auth.uid() = user_id);

-- DELETE: Users can delete ONLY their notes
create policy "Users can delete own notes" 
on public.notes for delete 
using (auth.uid() = user_id);

-- 5. Trigger for updated_at
-- Function to update timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger execution
create trigger on_note_updated
  before update on public.notes
  for each row execute procedure public.handle_updated_at();

-- Documentation / Verification:
-- verify policies with:
-- select * from pg_policies where tablename = 'notes';
