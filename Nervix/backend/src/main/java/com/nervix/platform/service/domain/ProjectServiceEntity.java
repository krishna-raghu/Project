package com.nervix.platform.service.domain;

import com.nervix.platform.common.persistence.BaseEntity;
import com.nervix.platform.identity.domain.User;
import com.nervix.platform.project.domain.Project;
import jakarta.persistence.*;
import java.util.*;

@Entity
@Table(name = "services")
public class ProjectServiceEntity extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Project project;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_user_id")
    private User owner;
    @Column(nullable = false, length = 150)
    private String name;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Enumerated(EnumType.STRING)
    @Column(name = "service_type", nullable = false, length = 30)
    private ServiceType serviceType;
    @Column(name = "version_label", nullable = false, length = 50)
    private String versionLabel;
    @Enumerated(EnumType.STRING)
    @Column(name = "health_status", nullable = false, length = 30)
    private ServiceHealth healthStatus = ServiceHealth.UNKNOWN;
    @Enumerated(EnumType.STRING)
    @Column(name = "lifecycle_status", nullable = false, length = 30)
    private ServiceLifecycle lifecycleStatus = ServiceLifecycle.ACTIVE;
    @Column(columnDefinition = "TEXT")
    private String repositoryUrl;
    @Column(columnDefinition = "TEXT")
    private String endpointUrl;
    @Column(length = 100)
    private String technology;
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "service_tags", joinColumns = @JoinColumn(name = "service_id"))
    @Column(name = "tag", length = 50)
    private Set<String> tags = new LinkedHashSet<>();

    protected ProjectServiceEntity() {}

    public ProjectServiceEntity(Project project, User owner, String name, String description,
        ServiceType type, String versionLabel, ServiceHealth health, ServiceLifecycle lifecycle,
        String repositoryUrl, String endpointUrl, String technology, Set<String> tags) {
        this.project = project;
        update(owner, name, description, type, versionLabel, health, lifecycle,
            repositoryUrl, endpointUrl, technology, tags);
    }

    public void update(User owner, String name, String description, ServiceType type,
        String versionLabel, ServiceHealth health, ServiceLifecycle lifecycle,
        String repositoryUrl, String endpointUrl, String technology, Set<String> tags) {
        this.owner = owner;
        this.name = name.trim();
        this.description = clean(description);
        this.serviceType = type;
        this.versionLabel = versionLabel.trim();
        this.healthStatus = health;
        this.lifecycleStatus = lifecycle;
        this.repositoryUrl = clean(repositoryUrl);
        this.endpointUrl = clean(endpointUrl);
        this.technology = clean(technology);
        this.tags.clear();
        if (tags != null) tags.stream().map(String::trim).filter(value -> !value.isBlank()).forEach(this.tags::add);
    }

    private String clean(String value) { return value == null || value.isBlank() ? null : value.trim(); }
    public Project getProject() { return project; }
    public User getOwner() { return owner; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public ServiceType getServiceType() { return serviceType; }
    public String getVersionLabel() { return versionLabel; }
    public ServiceHealth getHealthStatus() { return healthStatus; }
    public ServiceLifecycle getLifecycleStatus() { return lifecycleStatus; }
    public String getRepositoryUrl() { return repositoryUrl; }
    public String getEndpointUrl() { return endpointUrl; }
    public String getTechnology() { return technology; }
    public Set<String> getTags() { return Set.copyOf(tags); }
}
