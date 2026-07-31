package com.nervix.platform.service.infrastructure;

import com.nervix.platform.service.domain.ProjectServiceEntity;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectServiceRepository extends JpaRepository<ProjectServiceEntity, UUID> {
    List<ProjectServiceEntity> findAllByProjectIdAndSoftDeletedFalseOrderByUpdatedAtDesc(UUID projectId);
    Optional<ProjectServiceEntity> findByIdAndProjectIdAndSoftDeletedFalse(UUID id, UUID projectId);
    boolean existsByProjectIdAndNameIgnoreCaseAndSoftDeletedFalse(UUID projectId, String name);
    boolean existsByProjectIdAndNameIgnoreCaseAndIdNotAndSoftDeletedFalse(UUID projectId, String name, UUID id);
    long countByProjectIdAndSoftDeletedFalse(UUID projectId);
}
