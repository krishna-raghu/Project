package com.nervix.platform.architecture.api;

import java.util.List;

public record ArchitectureGraphResponse(
        List<ArchitectureNodeResponse> nodes,
        List<ArchitectureEdgeResponse> edges
) {}