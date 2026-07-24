# Nervix Backend — Module 1

The default `local` profile connects only to the isolated Docker services supplied with this module.

## Local configuration

| Service | Host | Port | Username | Password |
|---|---|---:|---|---|
| PostgreSQL | localhost | 55432 | nervix | nervix_local_v4 |
| Neo4j Bolt | localhost | 57687 | neo4j | nervix_neo4j_local_v4 |

The production profile uses environment variables and does not contain production secrets.

For local startup, use `start-backend.ps1` from the parent folder. It validates infrastructure before starting Spring Boot.

The Neo4j repository auto-configuration is intentionally excluded in Module 1 because no Neo4j repository exists yet. The Neo4j driver remains configured for the future graph module.
