package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.example.demo.entity.Service;

public interface ServiceRepository
        extends JpaRepository<Service, Long> {

    List<Service> findByProjectId(
            Long projectId);

}
