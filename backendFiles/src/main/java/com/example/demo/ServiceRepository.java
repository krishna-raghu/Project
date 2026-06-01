package com.example.demo;

import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface ServiceRepository extends Neo4jRepository<ServiceNode, String> {
}
