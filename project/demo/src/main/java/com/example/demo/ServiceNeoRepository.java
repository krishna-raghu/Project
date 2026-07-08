package com.example.demo;

import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface ServiceNeoRepository extends Neo4jRepository<ServiceNode, String> {
}
