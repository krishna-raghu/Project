package com.nervix.platform.architecture.domain;

public class ArchitectureNode {
    private String id;
    private String label;
    private String type;
    private String healthStatus;
    private String owner;
    private String version;

    protected ArchitectureNode() {}

    public ArchitectureNode(String id, String label, String type, String healthStatus, String owner, String version) {
        this.id = id;
        this.label = label;
        this.type = type;
        this.healthStatus = healthStatus;
        this.owner = owner;
        this.version = version;
    }

    public void updateHealthStatus(String healthStatus) {
        this.healthStatus = healthStatus;
    }

    public void updateDetails(String label, String type, String owner, String version) {
        this.label = label;
        this.type = type;
        this.owner = owner;
        this.version = version;
    }

    public String getId() { return id; }
    public String getLabel() { return label; }
    public String getType() { return type; }
    public String getHealthStatus() { return healthStatus; }
    public String getOwner() { return owner; }
    public String getVersion() { return version; }
}