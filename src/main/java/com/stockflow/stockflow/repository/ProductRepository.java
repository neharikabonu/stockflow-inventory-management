package com.stockflow.stockflow.repository;

import com.stockflow.stockflow.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.*;

public interface ProductRepository
        extends JpaRepository<Product, Long> {
  List<Product> findAllByOrganization_Id(Long organizationId);

  Optional<Product> findByIdAndOrganization_Id(
          Long productId, Long organizationId);

  boolean existsBySkuAndOrganization_Id(
          String sku, Long organizationId);

  // Total number of products
  long countByOrganization_Id(Long organizationId);

  // Total quantity of products
  @Query("""
    SELECT COALESCE(SUM(p.quantity), 0)
    FROM Product p
    WHERE p.organization.id = :organizationId
    """)
  Long getTotalQuantity(@Param("organizationId") Long organizationId);

  // Number of low-stock products
  @Query("""
    SELECT COUNT(p)
    FROM Product p
    WHERE p.organization.id = :organizationId
    AND p.quantity <= p.lowStockThreshold
    """)
  long countLowStockProducts(@Param("organizationId") Long organizationId);
}