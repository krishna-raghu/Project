CREATE TABLE project_invitations (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id),
  email VARCHAR(320) NOT NULL,
  role VARCHAR(30) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
  message VARCHAR(1000),
  invited_by_user_id UUID NOT NULL REFERENCES users(id),
  expires_at TIMESTAMPTZ NOT NULL,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  created_by UUID,
  updated_by UUID,
  version BIGINT NOT NULL DEFAULT 0,
  soft_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  CONSTRAINT chk_project_invitation_role CHECK (role IN ('ADMIN','EDITOR','VIEWER')),
  CONSTRAINT chk_project_invitation_status CHECK (status IN ('PENDING','ACCEPTED','REVOKED','EXPIRED'))
);

CREATE UNIQUE INDEX uq_pending_project_invitation_email
  ON project_invitations(project_id, LOWER(email))
  WHERE status = 'PENDING' AND soft_deleted = FALSE;

CREATE INDEX idx_project_invitations_project
  ON project_invitations(project_id, created_at DESC)
  WHERE soft_deleted = FALSE;

CREATE INDEX idx_project_invitations_email
  ON project_invitations(LOWER(email), created_at DESC)
  WHERE status = 'PENDING' AND soft_deleted = FALSE;
