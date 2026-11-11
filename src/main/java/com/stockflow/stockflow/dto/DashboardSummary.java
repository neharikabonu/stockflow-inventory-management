package com.stockflow.stockflow.dto;

public record DashboardSummary(
        long totalProducts,
        Long totalQuantity,
        long lowStockProducts
) {
}