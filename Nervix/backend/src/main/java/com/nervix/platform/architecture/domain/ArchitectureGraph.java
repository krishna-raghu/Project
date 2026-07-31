package com.nervix.platform.architecture.domain;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ArchitectureGraph {
    private List<ArchitectureNode> nodes = new ArrayList<>();
    private List<ArchitectureEdge> edges = new ArrayList<>();

    protected ArchitectureGraph() {}

    public ArchitectureGraph(List<ArchitectureNode> nodes, List<ArchitectureEdge> edges) {
        if (nodes != null) {
            this.nodes = new ArrayList<>(nodes);
        }
        if (edges != null) {
            this.edges = new ArrayList<>(edges);
        }
    }

    public void addNode(ArchitectureNode node) {
        this.nodes.add(node);
    }

    public void addEdge(ArchitectureEdge edge) {
        this.edges.add(edge);
    }

    public List<ArchitectureNode> getNodes() {
        return Collections.unmodifiableList(nodes);
    }

    public List<ArchitectureEdge> getEdges() {
        return Collections.unmodifiableList(edges);
    }
}