package com.stockflow.stockflow.controller;

import com.stockflow.stockflow.dto.DashboardSummary;
import com.stockflow.stockflow.service.ProductService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/organizations/{organizationId}/dashboard")
public class DashboardController {

  private final ProductService productService;

  public DashboardController(ProductService productService) {
    this.productService = productService;
  }

  @GetMapping("/summary")
  public DashboardSummary getDashboardSummary(
          @PathVariable Long organizationId) {

    return productService.getDashboardSummary(organizationId);
  }
}