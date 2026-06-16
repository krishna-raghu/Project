package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.stereotype.Service;

@Service
public class Neo4jTestService {

    @Autowired
    private Neo4jClient neo4jClient;

    public void createTestNode() {

        neo4jClient.query("""
                    CREATE (:TestNode {name:'SpringBoot Connected'})
                """).run();

    }
}
