create extension if not exists pgcrypto;

create table if not exists wai_forum_users (
  id text primary key,
  customer_id text,
  display_name text not null,
  email text,
  roles jsonb not null default '[]'::jsonb,
  profile_pic text,
  color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists wai_forum_player_state (
  user_id text primary key references wai_forum_users(id) on delete cascade,
  gold integer not null default 12 check (gold >= 0),
  player_xp integer not null default 0 check (player_xp >= 0),
  home_xp integer not null default 0 check (home_xp >= 0),
  gold_xp_milestone integer not null default 0 check (gold_xp_milestone >= 0),
  resources jsonb not null default '{}'::jsonb,
  items jsonb not null default '{}'::jsonb,
  hotbar jsonb not null default '[]'::jsonb,
  active_hotbar_slot integer not null default 0,
  player_position jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists wai_forum_player_state_updated_idx on wai_forum_player_state(updated_at desc);

create table if not exists wai_forum_user_plots (
  user_id text not null references wai_forum_users(id) on delete cascade,
  x integer not null,
  y integer not null,
  source text not null default 'purchased',
  acquired_at timestamptz not null default now(),
  primary key (user_id, x, y)
);

create table if not exists wai_forum_boards (
  id uuid primary key default gen_random_uuid(),
  owner_user_id text not null references wai_forum_users(id) on delete cascade,
  parent_board_id uuid references wai_forum_boards(id) on delete set null,
  title text not null,
  slug text,
  description text,
  visibility text not null default 'public',
  sort_order integer not null default 0,
  professional_meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_user_id, slug)
);

create table if not exists wai_forum_buildings (
  id uuid primary key default gen_random_uuid(),
  board_id uuid unique references wai_forum_boards(id) on delete set null,
  owner_user_id text not null references wai_forum_users(id) on delete cascade,
  name text,
  tiles jsonb not null default '[]'::jsonb,
  image_url text,
  width integer not null default 0,
  height integer not null default 0,
  material_costs jsonb not null default '{}'::jsonb,
  art_meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists wai_forum_buildings_owner_idx on wai_forum_buildings(owner_user_id);

create table if not exists wai_forum_topics (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references wai_forum_boards(id) on delete cascade,
  author_user_id text references wai_forum_users(id) on delete set null,
  title text not null,
  slug text,
  status text not null default 'open',
  pinned boolean not null default false,
  locked boolean not null default false,
  professional_meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (board_id, slug)
);

create table if not exists wai_forum_rooms (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid unique references wai_forum_topics(id) on delete cascade,
  building_id uuid references wai_forum_buildings(id) on delete set null,
  owner_user_id text references wai_forum_users(id) on delete set null,
  name text,
  world_position jsonb not null default '{}'::jsonb,
  room_meta jsonb not null default '{}'::jsonb,
  art_meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists wai_forum_rooms_building_idx on wai_forum_rooms(building_id);

create table if not exists wai_forum_world_features (
  user_id text not null references wai_forum_users(id) on delete cascade,
  x integer not null,
  y integer not null,
  feature_type text not null,
  state text not null,
  planted_at bigint,
  next_check bigint,
  grown boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, x, y, feature_type)
);

create table if not exists wai_forum_messages (
  id uuid primary key default gen_random_uuid(),
  client_id text,
  author_user_id text references wai_forum_users(id) on delete set null,
  board_id uuid references wai_forum_boards(id) on delete cascade,
  topic_id uuid references wai_forum_topics(id) on delete cascade,
  room_id uuid references wai_forum_rooms(id) on delete cascade,
  building_id uuid references wai_forum_buildings(id) on delete set null,
  message_kind text not null default 'chat',
  body text not null,
  world_position jsonb not null default '{}'::jsonb,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  deleted_at timestamptz
);

create index if not exists wai_forum_messages_topic_idx on wai_forum_messages(topic_id, created_at);
create index if not exists wai_forum_messages_room_idx on wai_forum_messages(room_id, created_at);
create index if not exists wai_forum_messages_author_idx on wai_forum_messages(author_user_id, created_at);
create index if not exists wai_forum_messages_home_chat_created_idx on wai_forum_messages(message_kind, created_at desc) where deleted_at is null;

create table if not exists wai_forum_world_events (
  id uuid primary key default gen_random_uuid(),
  actor_user_id text references wai_forum_users(id) on delete set null,
  event_type text not null,
  entity_type text,
  entity_id text,
  position jsonb not null default '{}'::jsonb,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists wai_forum_world_events_type_idx on wai_forum_world_events(event_type, created_at);
