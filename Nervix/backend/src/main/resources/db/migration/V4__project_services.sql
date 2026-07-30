CREATE TABLE services (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id),
  owner_user_id UUID REFERENCES users(id),
  name VARCHAR(150) NOT NULL,
  description TEXT,
  service_type VARCHAR(30) NOT NULL,
  version_label VARCHAR(50) NOT NULL,
  health_status VARCHAR(30) NOT NULL DEFAULT 'UNKNOWN',
  lifecycle_status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
  repository_url TEXT,
  endpoint_url TEXT,
  technology VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  created_by UUID,
  updated_by UUID,
  version BIGINT NOT NULL DEFAULT 0,
  soft_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  CONSTRAINT chk_service_type CHECK (service_type IN ('API','DATABASE','GATEWAY','CACHE','QUEUE','EVENT','WORKER','EXTERNAL')),
  CONSTRAINT chk_service_health CHECK (health_status IN ('HEALTHY','WARNING','ERROR','UNKNOWN')),
  CONSTRAINT chk_service_lifecycle CHECK (lifecycle_status IN ('ACTIVE','DEPRECATED','RETIRED'))
);

CREATE TABLE service_tags (
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  tag VARCHAR(50) NOT NULL,
  PRIMARY KEY (service_id, tag)
);

CREATE UNIQUE INDEX uq_services_project_name_ci
  ON services(project_id, LOWER(name))
  WHERE soft_deleted = FALSE;
CREATE INDEX idx_services_project
  ON services(project_id, updated_at DESC)
  WHERE soft_deleted = FALSE;
CREATE INDEX idx_services_owner
  ON services(owner_user_id)
  WHERE soft_deleted = FALSE;
CREATE INDEX idx_services_health
  ON services(project_id, health_status)
  WHERE soft_deleted = FALSE;
