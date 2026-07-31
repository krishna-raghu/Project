package com.nervix.platform.architecture.api;

import com.nervix.platform.architecture.application.ArchitectureGraphService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/architecture")
@CrossOrigin(origins = "*")
public class ArchitectureController {

    private final ArchitectureGraphService graphService;

    public ArchitectureController(ArchitectureGraphService graphService) {
        this.graphService = graphService;
    }

    @GetMapping("/graph")
    public ResponseEntity<ArchitectureGraphResponse> getGraph(
            @PathVariable("projectId") String projectId
    ) {

        ArchitectureGraphResponse response =
                graphService.getGraphForProject(projectId);

        return ResponseEntity.ok(response);
    }
}