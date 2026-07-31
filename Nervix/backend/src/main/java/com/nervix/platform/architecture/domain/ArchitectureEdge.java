package com.nervix.platform.architecture.domain;

public class ArchitectureEdge {
    private String id;
    private String source;
    private String target;
    private String relationshipType;

    protected ArchitectureEdge() {}

    public ArchitectureEdge(String id, String source, String target, String relationshipType) {
        this.id = id;
        this.source = source;
        this.target = target;
        this.relationshipType = relationshipType;
    }

    public void updateRelationship(String relationshipType) {
        this.relationshipType = relationshipType;
    }

    public String getId() { return id; }
    public String getSource() { return source; }
    public String getTarget() { return target; }
    public String getRelationshipType() { return relationshipType; }
}