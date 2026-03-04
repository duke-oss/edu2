import pg from "pg";
const { Client } = pg;

const SQL = `
create table if not exists chat_conversations (
  id             uuid default uuid_generate_v4() primary key,
  user_id        uuid not null references users(id) on delete cascade,
  status         text not null default 'open' check (status in ('open', 'closed')),
  last_message_at timestamptz not null default now(),
  created_at     timestamptz not null default now(),
  unique (user_id)
);

create table if not exists chat_messages (
  id              uuid default uuid_generate_v4() primary key,
  conversation_id uuid not null references chat_conversations(id) on delete cascade,
  sender_type     text not null check (sender_type in ('user', 'admin')),
  content         text not null,
  created_at      timestamptz not null default now(),
  read_at         timestamptz
);

create index if not exists chat_messages_conv_idx on chat_messages(conversation_id, created_at);
create index if not exists chat_conv_last_msg_idx on chat_conversations(last_message_at desc);
`;

const client = new Client({
  host: "db.lpnczrbbgzxqlwdijpwa.supabase.co",
  port: 5432,
  database: "postgres",
  user: "postgres",
  password: "3JCU3NDhYQf2GTBurrRjU2bDQhjllqjO",
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  await client.query(SQL);
  console.log("✅ chat_conversations, chat_messages 테이블 생성 완료");
} catch (e) {
  console.error("❌ 에러:", e.message);
} finally {
  await client.end();
}
