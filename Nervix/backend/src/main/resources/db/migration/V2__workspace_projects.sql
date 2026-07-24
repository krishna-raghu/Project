CREATE TABLE projects (
  id UUID PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  name VARCHAR(150) NOT NULL,
  description TEXT,
  project_type VARCHAR(30) NOT NULL DEFAULT 'MICROSERVICES',
  visibility VARCHAR(30) NOT NULL DEFAULT 'PRIVATE',
  status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  created_by UUID,
  updated_by UUID,
  version BIGINT NOT NULL DEFAULT 0,
  soft_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  CONSTRAINT chk_project_type CHECK (project_type IN ('MICROSERVICES','MONOLITH','SERVERLESS','HYBRID')),
  CONSTRAINT chk_project_visibility CHECK (visibility IN ('PRIVATE','TEAM','ORGANIZATION')),
  CONSTRAINT chk_project_status CHECK (status IN ('ACTIVE','ARCHIVED'))
);

CREATE TABLE project_members (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id),
  user_id UUID NOT NULL REFERENCES users(id),
  role VARCHAR(30) NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  created_by UUID,
  updated_by UUID,
  version BIGINT NOT NULL DEFAULT 0,
  soft_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  CONSTRAINT uq_project_member UNIQUE (project_id, user_id),
  CONSTRAINT chk_project_role CHECK (role IN ('OWNER','ADMIN','EDITOR','VIEWER'))
);

CREATE TABLE project_tags (
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  tag VARCHAR(50) NOT NULL,
  PRIMARY KEY (project_id, tag)
);

CREATE INDEX idx_projects_workspace ON projects(organization_id) WHERE soft_deleted = FALSE;
CREATE INDEX idx_projects_workspace_updated ON projects(organization_id, updated_at DESC) WHERE soft_deleted = FALSE;
CREATE INDEX idx_project_members_user ON project_members(user_id) WHERE soft_deleted = FALSE;
CREATE INDEX idx_project_members_project ON project_members(project_id) WHERE soft_deleted = FALSE;
CREATE UNIQUE INDEX uq_projects_workspace_name_ci ON projects(organization_id, LOWER(name))
  WHERE soft_deleted = FALSE;
