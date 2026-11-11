package com.stockflow.stockflow.repository;

import com.stockflow.stockflow.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganizationRepository
        extends JpaRepository<Organization, Long> {
}