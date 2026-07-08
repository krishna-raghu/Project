package com.example.demo.controller;

import com.example.demo.entity.Service;
import com.example.demo.repository.ServiceRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class ServiceController {

    private final ServiceRepository serviceRepository;

    public ServiceController(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    @GetMapping
    public List<Service> getAllServices() {
        return serviceRepository.findAll();
    }

    @GetMapping("/{id}")
    public Service getService(@PathVariable Long id) {
        return serviceRepository.findById(id).orElse(null);
    }

    @GetMapping("/project/{projectId}")
    public List<Service> getProjectServices(
            @PathVariable Long projectId) {
        return serviceRepository.findByProjectId(projectId);
    }

    @PostMapping
    public Service createService(
            @RequestBody Service service) {
        return serviceRepository.save(service);
    }

    @PutMapping("/{id}")
    public Service updateService(
            @PathVariable Long id,
            @RequestBody Service updated) {

        Service service = serviceRepository.findById(id)
                .orElseThrow();

        service.setServiceName(updated.getServiceName());
        service.setServiceType(updated.getServiceType());
        service.setVersion(updated.getVersion());
        service.setDescription(updated.getDescription());
        service.setHealthStatus(updated.getHealthStatus());
        service.setResponseTimeMs(updated.getResponseTimeMs());

        return serviceRepository.save(service);
    }

    @DeleteMapping("/{id}")
    public void deleteService(
            @PathVariable Long id) {
        serviceRepository.deleteById(id);
    }
}