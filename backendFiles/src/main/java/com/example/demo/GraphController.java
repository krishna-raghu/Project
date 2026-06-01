package com.example.demo;

import org.springframework.web.bind.annotation.*;
import org.neo4j.driver.*;

import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class GraphController {

    private final Driver driver;

    public GraphController(Driver driver) {
        this.driver = driver;
    }

    // ✅ ADD SERVICE
    @PostMapping("/service")
    public String addService(@RequestBody Map<String, String> body) {
        String name = body.get("name");

        try (Session session = driver.session()) {
            session.run("MERGE (s:Service {name:$name})",
                    Values.parameters("name", name));
        }

        return "Service added";
    }

    // ✅ ADD DEPENDENCY
    @PostMapping("/dependency")
    public String addDependency(@RequestBody Map<String, String> body) {
        String from = body.get("from");
        String to = body.get("to");

        try (Session session = driver.session()) {
            session.run(
                    "MATCH (a:Service {name:$from}), (b:Service {name:$to}) " +
                            "MERGE (a)-[:DEPENDS_ON]->(b)",
                    Values.parameters("from", from, "to", to));
        }

        return "Dependency added";
    }

    // ✅ GET GRAPH
    @GetMapping("/graph")
    public List<Map<String, Object>> getGraph() {

        List<Map<String, Object>> result = new ArrayList<>();

        try (Session session = driver.session()) {

            Result queryResult = session.run(
                    "MATCH (a:Service)-[:DEPENDS_ON]->(b:Service) RETURN a,b");

            while (queryResult.hasNext()) {

                org.neo4j.driver.Record record = queryResult.next();

                Map<String, Object> map = new HashMap<>();
                map.put("source", record.get("a").get("name").asString());
                map.put("target", record.get("b").get("name").asString());

                result.add(map);
            }
        }

        return result;
    }

    @GetMapping("/impact")
    public List<String> getImpact(@RequestParam String service) {

        List<String> impacted = new ArrayList<>();

        try (Session session = driver.session()) {

            Result result = session.run(
                    "MATCH (s:Service {name:$name})-[:DEPENDS_ON*]->(impacted) " +
                            "RETURN DISTINCT impacted.name AS name",
                    Values.parameters("name", service));

            while (result.hasNext()) {
                impacted.add(result.next().get("name").asString());
            }
        }

        return impacted;
    }
}