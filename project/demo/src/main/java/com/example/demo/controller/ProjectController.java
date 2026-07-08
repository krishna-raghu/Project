package com.example.demo.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import com.example.demo.entity.Project;
import com.example.demo.entity.User;
import com.example.demo.service.ProjectService;
import com.example.demo.repository.ProjectRepository;
import com.example.demo.repository.UserRepository;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectController(ProjectService projectService, ProjectRepository projectRepository,
            UserRepository userRepository) {
        this.projectService = projectService;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Project> getProjects() {

        List<Project> projects = projectService.getProjects();

        System.out.println("Projects from DB = " + projects);

        return projects;
    }

    @GetMapping("/{id}")
    public Project getProjectById(
            @PathVariable Long id) {

        return projectRepository.findById(id)
                .orElseThrow();
    }

    // @GetMapping("/my-projects")
    // public List<Project> getMyProjects(
    // @AuthenticationPrincipal Jwt jwt) {

    // String supabaseUid = jwt.getSubject();

    // User user = userRepository
    // .findBySupabaseUid(supabaseUid)
    // .orElseThrow();

    // return projectRepository
    // .findByOwnerId(user.getUserId());
    // }

    @GetMapping("/my-projects")
    public List<Project> getMyProjects(
            @AuthenticationPrincipal Jwt jwt) {

        System.out.println("JWT = " + jwt);

        if (jwt == null) {
            throw new RuntimeException("JWT IS NULL");
        }

        String supabaseUid = jwt.getSubject();

        System.out.println("UID = " + supabaseUid);

        User user = userRepository
                .findBySupabaseUid(supabaseUid)
                .orElseThrow();

        return projectRepository.findByOwnerId(user.getUserId());
    }

    @GetMapping("/test")
    public String test(
            @AuthenticationPrincipal Jwt jwt) {

        return jwt == null
                ? "JWT NULL"
                : jwt.getSubject();
    }
}
