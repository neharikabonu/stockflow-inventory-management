
package com.stockflow.stockflow.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record CreateProductRequest(

        @NotBlank(message = "Product name is required")
        @Size(max = 150, message = "Product name cannot exceed 150 characters")
        String name,

        @NotBlank(message = "SKU is required")
        @Size(max = 80, message = "SKU cannot exceed 80 characters")
        String sku,

        String description,

        @NotNull(message = "Quantity is required")
        @Min(value = 0, message = "Quantity cannot be negative")
        Integer quantity,

        @NotNull(message = "Cost price is required")
        @DecimalMin(value = "0.0", message = "Cost price cannot be negative")
        BigDecimal costPrice,

        @NotNull(message = "Selling price is required")
        @DecimalMin(value = "0.0", message = "Selling price cannot be negative")
        BigDecimal sellingPrice,

        @NotNull(message = "Low stock threshold is required")
        @Min(value = 0, message = "Threshold cannot be negative")
        Integer lowStockThreshold

) {}
