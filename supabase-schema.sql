-- Run this SQL in the Supabase SQL Editor (supabase.com → your project → SQL Editor)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table
create table if not exists users (
  id            uuid not null default uuid_generate_v4(),
  name          text,
  email         text unique,
  email_verified timestamptz,
  image         text,
  password      text,        -- bcrypt hashed, NULL for OAuth-only users
  created_at    timestamptz  not null default now(),
  primary key (id)
);

-- OAuth accounts table (linked to users)
create table if not exists accounts (
  id                   uuid not null default uuid_generate_v4(),
  user_id              uuid not null references users(id) on delete cascade,
  type                 text not null,
  provider             text not null,
  provider_account_id  text not null,
  refresh_token        text,
  access_token         text,
  expires_at           bigint,
  token_type           text,
  scope                text,
  id_token             text,
  session_state        text,
  primary key (id),
  unique (provider, provider_account_id)
);

-- Sessions table (used by database strategy; with JWT strategy this stays empty)
create table if not exists sessions (
  id            uuid not null default uuid_generate_v4(),
  user_id       uuid not null references users(id) on delete cascade,
  session_token text not null unique,
  expires       timestamptz not null,
  primary key (id)
);

-- Email verification tokens
create table if not exists verification_tokens (
  identifier text not null,
  token      text not null unique,
  expires    timestamptz not null,
  primary key (token)
);
