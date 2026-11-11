package com.stockflow.stockflow.service;

import com.stockflow.stockflow.entity.Organization;
import com.stockflow.stockflow.repository.OrganizationRepository;
import org.springframework.stereotype.Service;

@Service
public class OrganizationService {

  private final OrganizationRepository organizationRepository;

  public OrganizationService(OrganizationRepository organizationRepository) {
    this.organizationRepository = organizationRepository;
  }

  public Organization createOrganization(String name) {

    Organization organization = new Organization();
    organization.setName(name);

    return organizationRepository.save(organization);
  }
}