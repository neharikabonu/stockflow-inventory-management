package com.stockflow.stockflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateOrganizationRequest(
        @NotBlank(message = "Organization name is required")
        @Size(max = 120, message = "Organization name cannot exceed 120 characters")
        String name
) {
}