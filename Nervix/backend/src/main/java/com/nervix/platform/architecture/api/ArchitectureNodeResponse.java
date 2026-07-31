package com.nervix.platform.architecture.api;

public record ArchitectureNodeResponse(
        String id,
        String label,
        String type,
        String healthStatus,
        String owner,
        String version
) {}