package com.example.demo.service;

import com.example.demo.entity.Project;
import java.util.List;
import org.springframework.stereotype.Service;
import com.example.demo.repository.ProjectRepository;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<Project> getProjects() {
        return projectRepository.findAll();
    }
}
