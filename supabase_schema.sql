-- ============================================================
-- 사주온도 — Supabase 스키마 (온도살롱 커뮤니티)
-- 실행 방법: Supabase 대시보드 → SQL Editor → 붙여넣고 Run
-- ============================================================

-- 1. 사용자 사주 데이터 (분석 결과 영속화)
create table if not exists public.user_saju (
  user_id uuid primary key references auth.users(id) on delete cascade,
  ilju text not null,                  -- 한자 일주 (예: '乙丑')
  ilju_kr text not null,               -- 한글 일주 (예: '을축')
  temperature numeric(5,1) not null,   -- 사주 온도
  yongsin text,                        -- 용신 오행
  strongest text,                      -- 가장 강한 오행
  geukguk_name text,                   -- 격국명
  distribution jsonb,                  -- 오행 분포
  input_year int, input_month int, input_day int, input_hour int,
  gender text,
  updated_at timestamptz default now()
);

-- 2. 사용자 프로필 (닉네임)
create table if not exists public.user_profile (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nickname text unique not null,
  email text,
  bio text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. 게시글 (온도살롱)
create table if not exists public.posts (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,

  -- 작성 시점 스냅샷 (사주 정보가 바뀌어도 글에는 그대로)
  nickname text not null,
  ilju_kr text,            -- '을축' (익명글은 null)
  temperature numeric(5,1),-- 36.5 (익명글은 null)

  -- 게시판 분류
  room_type text not null check (room_type in ('temp', 'topic', 'free')),
  -- temp: 'cool' / 'mild' / 'hot'
  -- topic: 'love' / 'career' / 'money' / 'health' / 'family'
  -- free: 'free'
  room_value text not null,

  title text not null,
  content text not null,
  is_anonymous boolean default false,  -- 고민방(topic)에서만 true 허용

  view_count int default 0,
  like_count int default 0,
  comment_count int default 0,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists posts_room_idx on public.posts(room_type, room_value, created_at desc);
create index if not exists posts_user_idx on public.posts(user_id, created_at desc);

-- 4. 댓글
create table if not exists public.comments (
  id bigserial primary key,
  post_id bigint not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  nickname text not null,
  ilju_kr text,
  temperature numeric(5,1),
  content text not null,
  is_anonymous boolean default false,
  created_at timestamptz default now()
);
create index if not exists comments_post_idx on public.comments(post_id, created_at);

-- 5. 좋아요
create table if not exists public.likes (
  user_id uuid not null references auth.users(id) on delete cascade,
  post_id bigint not null references public.posts(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, post_id)
);

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================

alter table public.user_saju enable row level security;
alter table public.user_profile enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;

-- user_saju: 본인만 읽고 쓰기
drop policy if exists "own saju select" on public.user_saju;
create policy "own saju select" on public.user_saju
  for select using (auth.uid() = user_id);
drop policy if exists "own saju upsert" on public.user_saju;
create policy "own saju upsert" on public.user_saju
  for insert with check (auth.uid() = user_id);
drop policy if exists "own saju update" on public.user_saju;
create policy "own saju update" on public.user_saju
  for update using (auth.uid() = user_id);

-- user_profile: 본인은 전체, 다른 사람은 닉네임만 (단순화: 모두 select 가능)
drop policy if exists "profile select all" on public.user_profile;
create policy "profile select all" on public.user_profile
  for select using (true);
drop policy if exists "own profile upsert" on public.user_profile;
create policy "own profile upsert" on public.user_profile
  for insert with check (auth.uid() = user_id);
drop policy if exists "own profile update" on public.user_profile;
create policy "own profile update" on public.user_profile
  for update using (auth.uid() = user_id);

-- posts: 누구나 읽기, 본인만 쓰기/수정/삭제
drop policy if exists "posts read all" on public.posts;
create policy "posts read all" on public.posts
  for select using (true);
drop policy if exists "posts insert own" on public.posts;
create policy "posts insert own" on public.posts
  for insert with check (
    auth.uid() = user_id
    and exists (select 1 from public.user_saju where user_id = auth.uid())
  );
drop policy if exists "posts update own" on public.posts;
create policy "posts update own" on public.posts
  for update using (auth.uid() = user_id);
drop policy if exists "posts delete own" on public.posts;
create policy "posts delete own" on public.posts
  for delete using (auth.uid() = user_id);

-- comments: 누구나 읽기, 본인만 쓰기/삭제
drop policy if exists "comments read all" on public.comments;
create policy "comments read all" on public.comments
  for select using (true);
drop policy if exists "comments insert own" on public.comments;
create policy "comments insert own" on public.comments
  for insert with check (
    auth.uid() = user_id
    and exists (select 1 from public.user_saju where user_id = auth.uid())
  );
drop policy if exists "comments delete own" on public.comments;
create policy "comments delete own" on public.comments
  for delete using (auth.uid() = user_id);

-- likes: 누구나 읽기, 본인만 쓰기/삭제
drop policy if exists "likes read all" on public.likes;
create policy "likes read all" on public.likes for select using (true);
drop policy if exists "likes insert own" on public.likes;
create policy "likes insert own" on public.likes
  for insert with check (auth.uid() = user_id);
drop policy if exists "likes delete own" on public.likes;
create policy "likes delete own" on public.likes
  for delete using (auth.uid() = user_id);

-- ============================================================
-- 좋아요/댓글 카운트 자동 동기화 (트리거)
-- ============================================================
create or replace function bump_like_count() returns trigger language plpgsql as $$
begin
  if (tg_op = 'INSERT') then
    update public.posts set like_count = like_count + 1 where id = new.post_id;
    return new;
  elsif (tg_op = 'DELETE') then
    update public.posts set like_count = greatest(like_count - 1, 0) where id = old.post_id;
    return old;
  end if;
  return null;
end; $$;

drop trigger if exists trg_like_count on public.likes;
create trigger trg_like_count after insert or delete on public.likes
  for each row execute function bump_like_count();

create or replace function bump_comment_count() returns trigger language plpgsql as $$
begin
  if (tg_op = 'INSERT') then
    update public.posts set comment_count = comment_count + 1 where id = new.post_id;
    return new;
  elsif (tg_op = 'DELETE') then
    update public.posts set comment_count = greatest(comment_count - 1, 0) where id = old.post_id;
    return old;
  end if;
  return null;
end; $$;

drop trigger if exists trg_comment_count on public.comments;
create trigger trg_comment_count after insert or delete on public.comments
  for each row execute function bump_comment_count();

-- 끝.
