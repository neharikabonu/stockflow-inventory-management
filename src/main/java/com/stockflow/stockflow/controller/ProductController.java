
package com.stockflow.stockflow.controller;

import com.stockflow.stockflow.dto.CreateProductRequest;
import com.stockflow.stockflow.dto.UpdateProductRequest;
import com.stockflow.stockflow.entity.Product;
import com.stockflow.stockflow.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organizations/{organizationId}/products")
public class ProductController {

  private final ProductService productService;

  public ProductController(ProductService productService) {
    this.productService = productService;
  }

  @GetMapping
  public List<Product> getAllProducts(
          @PathVariable Long organizationId) {
    return productService.getAllProducts(organizationId);
  }

  @GetMapping("/{productId}")
  public Product getProductById(
          @PathVariable Long organizationId,
          @PathVariable Long productId) {
    return productService.getProductById(productId, organizationId);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Product createProduct(
          @PathVariable Long organizationId,
          @Valid @RequestBody CreateProductRequest request) {

    Product product = new Product();
    product.setName(request.name());
    product.setSku(request.sku());
    product.setDescription(request.description());
    product.setQuantity(request.quantity());
    product.setCostPrice(request.costPrice());
    product.setSellingPrice(request.sellingPrice());
    product.setLowStockThreshold(request.lowStockThreshold());

    return productService.createProduct(product, organizationId);
  }

  @PutMapping("/{productId}")
  public Product updateProduct(
          @PathVariable Long organizationId,
          @PathVariable Long productId,
          @Valid @RequestBody UpdateProductRequest request) {

    Product product = new Product();
    product.setName(request.name());
    product.setSku(request.sku());
    product.setDescription(request.description());
    product.setQuantity(request.quantity());
    product.setCostPrice(request.costPrice());
    product.setSellingPrice(request.sellingPrice());
    product.setLowStockThreshold(request.lowStockThreshold());

    return productService.updateProduct(productId, organizationId, product);
  }

  @DeleteMapping("/{productId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteProduct(
          @PathVariable Long organizationId,
          @PathVariable Long productId) {
    productService.deleteProduct(productId, organizationId);
  }
}
