package com.stockflow.stockflow.controller;

import com.stockflow.stockflow.dto.CreateOrganizationRequest;
import com.stockflow.stockflow.entity.Organization;
import com.stockflow.stockflow.service.OrganizationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/organizations")
public class OrganizationController {

  private final OrganizationService organizationService;

  public OrganizationController(OrganizationService organizationService) {
    this.organizationService = organizationService;
  }

  @PostMapping
  public Organization createOrganization(
          @Valid @RequestBody CreateOrganizationRequest request) {

    return organizationService.createOrganization(request.name());
  }
}