package com.nervix.platform.architecture.application;

import com.nervix.platform.architecture.api.ArchitectureEdgeResponse;
import com.nervix.platform.architecture.api.ArchitectureGraphResponse;
import com.nervix.platform.architecture.api.ArchitectureNodeResponse;
import com.nervix.platform.architecture.domain.ArchitectureEdge;
import com.nervix.platform.architecture.domain.ArchitectureGraph;
import com.nervix.platform.architecture.domain.ArchitectureNode;
import com.nervix.platform.service.domain.ProjectServiceEntity;
import com.nervix.platform.service.infrastructure.ProjectServiceRepository;

import com.nervix.platform.dependency.domain.ServiceDependency;
import com.nervix.platform.dependency.infrastructure.ServiceDependencyRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ArchitectureGraphService {

    private final ProjectServiceRepository serviceRepository;
    private final ServiceDependencyRepository dependencyRepository;


    // Inject repositories/services here (e.g., ServiceRepository, DependencyRepository)
    public ArchitectureGraphService(
            ProjectServiceRepository serviceRepository,
            ServiceDependencyRepository dependencyRepository
    ){
        this.serviceRepository = serviceRepository;
        this.dependencyRepository = dependencyRepository;
    }

    @Transactional(readOnly = true)
    public ArchitectureGraphResponse getGraphForProject(String projectId) {

        ArchitectureGraph graph = loadGraphData(UUID.fromString(projectId));

        List<ArchitectureNodeResponse> nodeResponses = graph.getNodes().stream()
                .map(node -> new ArchitectureNodeResponse(
                        node.getId(),
                        node.getLabel(),
                        node.getType(),
                        node.getHealthStatus(),
                        node.getOwner(),
                        node.getVersion()
                ))
                .toList();

        List<ArchitectureEdgeResponse> edgeResponses = graph.getEdges().stream()
                .map(edge -> new ArchitectureEdgeResponse(
                        edge.getId(),
                        edge.getSource(),
                        edge.getTarget(),
                        edge.getRelationshipType()
                ))
                .toList();

        return new ArchitectureGraphResponse(nodeResponses, edgeResponses);
    }

    private ArchitectureGraph loadGraphData(UUID projectId) {


        List<ProjectServiceEntity> services =
                serviceRepository
                        .findAllByProjectIdAndSoftDeletedFalseOrderByUpdatedAtDesc(projectId);


        List<ServiceDependency> dependencies =
                dependencyRepository
                        .findAllByProjectIdAndSoftDeletedFalseOrderByUpdatedAtDesc(projectId);



        List<ArchitectureNode> nodes =
                services.stream()
                        .map(service ->
                                new ArchitectureNode(
                                        service.getId().toString(),
                                        service.getName(),
                                        service.getServiceType().name(),
                                        service.getHealthStatus().name(),
                                        service.getOwner() != null
                                                ? service.getOwner().getDisplayName()
                                                : "Unassigned",
                                        service.getVersionLabel()
                                )
                        )
                        .toList();



        List<ArchitectureEdge> edges =
                dependencies.stream()
                        .map(dependency ->
                                new ArchitectureEdge(
                                        dependency.getId().toString(),
                                        dependency.getSourceService().getId().toString(),
                                        dependency.getTargetService().getId().toString(),
                                        dependency.getDependencyType().name()
                                )
                        )
                        .toList();



        return new ArchitectureGraph(nodes, edges);
    }
}