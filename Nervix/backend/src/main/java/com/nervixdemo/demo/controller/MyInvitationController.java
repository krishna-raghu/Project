package com.nervix.platform.project.api;

import com.nervix.platform.common.api.ApiResponse;
import com.nervix.platform.project.application.ProjectTeamService;
import java.util.Map;
import org.slf4j.MDC;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/invitations/me")
public class MyInvitationController {
    private final ProjectTeamService service;
    public MyInvitationController(ProjectTeamService service) { this.service = service; }

    @PostMapping("/claim")
    public ApiResponse<Map<String, Integer>> claim(@AuthenticationPrincipal Jwt jwt) {
        return ApiResponse.success(Map.of("accepted", service.claimMyInvitations(jwt)),
            "Pending invitations claimed", MDC.get("traceId"));
    }
}
