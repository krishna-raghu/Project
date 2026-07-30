CREATE TABLE service_dependencies (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id),
  source_service_id UUID NOT NULL REFERENCES services(id),
  target_service_id UUID NOT NULL REFERENCES services(id),
  dependency_type VARCHAR(30) NOT NULL,
  criticality VARCHAR(20) NOT NULL,
  communication_protocol VARCHAR(30) NOT NULL,
  direction VARCHAR(20) NOT NULL,
  latency_ms INTEGER,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  created_by UUID,
  updated_by UUID,
  version BIGINT NOT NULL DEFAULT 0,
  soft_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  CONSTRAINT chk_dependency_distinct_services CHECK (source_service_id <> target_service_id),
  CONSTRAINT chk_dependency_type CHECK (dependency_type IN
    ('REST_API','DATABASE','EVENT','QUEUE','CACHE','GRPC','GRAPHQL','FILE','EXTERNAL')),
  CONSTRAINT chk_dependency_criticality CHECK (criticality IN ('LOW','MEDIUM','HIGH','CRITICAL')),
  CONSTRAINT chk_dependency_protocol CHECK (communication_protocol IN
    ('HTTP','HTTPS','GRPC','JDBC','AMQP','KAFKA','REDIS','TCP','UDP','WEBHOOK','OTHER')),
  CONSTRAINT chk_dependency_direction CHECK (direction IN ('UNIDIRECTIONAL','BIDIRECTIONAL')),
  CONSTRAINT chk_dependency_latency CHECK (latency_ms IS NULL OR latency_ms >= 0)
);

CREATE UNIQUE INDEX uq_service_dependencies_active
  ON service_dependencies(project_id, source_service_id, target_service_id, dependency_type)
  WHERE soft_deleted = FALSE;
CREATE INDEX idx_dependencies_project
  ON service_dependencies(project_id, updated_at DESC)
  WHERE soft_deleted = FALSE;
CREATE INDEX idx_dependencies_source
  ON service_dependencies(source_service_id)
  WHERE soft_deleted = FALSE;
CREATE INDEX idx_dependencies_target
  ON service_dependencies(target_service_id)
  WHERE soft_deleted = FALSE;
