package com.nervix.platform.architecture.api;

public record ArchitectureEdgeResponse(
        String id,
        String source,
        String target,
        String relationshipType
) {}