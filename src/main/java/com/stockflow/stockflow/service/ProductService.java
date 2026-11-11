package com.stockflow.stockflow.service;

import com.stockflow.stockflow.entity.Product;
import com.stockflow.stockflow.entity.Organization;
import com.stockflow.stockflow.repository.ProductRepository;
import com.stockflow.stockflow.repository.OrganizationRepository;
import com.stockflow.stockflow.dto.DashboardSummary;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

  private final ProductRepository productRepository;
  private final OrganizationRepository organizationRepository;

  public ProductService(
          ProductRepository productRepository,
          OrganizationRepository organizationRepository) {

    this.productRepository = productRepository;
    this.organizationRepository = organizationRepository;
  }

  // Get all products belonging to an organization
  public List<Product> getAllProducts(Long organizationId) {

    return productRepository.findAllByOrganization_Id(organizationId);
  }

  // Get a single product belonging to an organization
  public Product getProductById(Long productId, Long organizationId) {

    return productRepository
            .findByIdAndOrganization_Id(productId, organizationId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
  }

  public Product createProduct(Product product, Long organizationId) {

    Organization organization = organizationRepository.findById(organizationId)
            .orElseThrow(() -> new RuntimeException("Organization not found"));

    if (productRepository.existsBySkuAndOrganization_Id(
            product.getSku(), organizationId)) {
      throw new RuntimeException("SKU already exists");
    }

    product.setOrganization(organization);

    return productRepository.save(product);
  }

  public Product updateProduct(Long productId, Long organizationId, Product updatedProduct) {

    Product existingProduct = getProductById(productId, organizationId);

    if (!existingProduct.getSku().equals(updatedProduct.getSku())
            && productRepository.existsBySkuAndOrganization_Id(
            updatedProduct.getSku(), organizationId)) {
      throw new RuntimeException("SKU already exists");
    }

    existingProduct.setName(updatedProduct.getName());
    existingProduct.setSku(updatedProduct.getSku());
    existingProduct.setDescription(updatedProduct.getDescription());
    existingProduct.setQuantity(updatedProduct.getQuantity());
    existingProduct.setCostPrice(updatedProduct.getCostPrice());
    existingProduct.setSellingPrice(updatedProduct.getSellingPrice());
    existingProduct.setLowStockThreshold(updatedProduct.getLowStockThreshold());

    return productRepository.save(existingProduct);
  }

  public void deleteProduct(Long productId, Long organizationId) {

    Product product = getProductById(productId, organizationId);

    productRepository.delete(product);
  }

  public DashboardSummary getDashboardSummary(Long organizationId) {

    long totalProducts =
            productRepository.countByOrganization_Id(organizationId);

    Long totalQuantity =
            productRepository.getTotalQuantity(organizationId);

    long lowStockProducts =
            productRepository.countLowStockProducts(organizationId);

    return new DashboardSummary(
            totalProducts,
            totalQuantity,
            lowStockProducts
    );
  }
}

