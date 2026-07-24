CREATE TABLE users (
  id UUID PRIMARY KEY,
  supabase_user_id UUID NOT NULL UNIQUE,
  email VARCHAR(320) NOT NULL,
  display_name VARCHAR(150) NOT NULL,
  username VARCHAR(50),
  avatar_url TEXT,
  timezone VARCHAR(100) NOT NULL DEFAULT 'UTC',
  locale VARCHAR(20) NOT NULL DEFAULT 'en',
  status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  created_by UUID,
  updated_by UUID,
  version BIGINT NOT NULL DEFAULT 0,
  soft_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  CONSTRAINT chk_user_status CHECK (status IN ('ACTIVE','SUSPENDED','DEACTIVATED'))
);

CREATE TABLE organizations (
  id UUID PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  created_by UUID,
  updated_by UUID,
  version BIGINT NOT NULL DEFAULT 0,
  soft_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE organization_members (
  id UUID PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  user_id UUID NOT NULL REFERENCES users(id),
  role VARCHAR(30) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
  joined_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  created_by UUID,
  updated_by UUID,
  version BIGINT NOT NULL DEFAULT 0,
  soft_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  CONSTRAINT uq_organization_member UNIQUE (organization_id, user_id),
  CONSTRAINT chk_organization_role CHECK (role IN ('OWNER','ADMIN','MEMBER','VIEWER'))
);

CREATE INDEX idx_users_supabase_user_id ON users(supabase_user_id) WHERE soft_deleted = FALSE;
CREATE UNIQUE INDEX uq_users_email_ci ON users(LOWER(email)) WHERE soft_deleted = FALSE;
CREATE UNIQUE INDEX uq_users_username_ci ON users(LOWER(username))
  WHERE username IS NOT NULL AND soft_deleted = FALSE;
CREATE UNIQUE INDEX uq_organizations_slug_ci ON organizations(LOWER(slug))
  WHERE soft_deleted = FALSE;
CREATE INDEX idx_org_members_user ON organization_members(user_id) WHERE soft_deleted = FALSE;
CREATE INDEX idx_org_members_org ON organization_members(organization_id) WHERE soft_deleted = FALSE;
