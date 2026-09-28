package com.utc.backend.service;

import com.utc.backend.dto.ProductRequestDto;
import com.utc.backend.dto.ProductResponseDto;

import java.util.List;

public interface ProductService {
    ProductResponseDto createProduct(ProductRequestDto dto);
    ProductResponseDto updateProduct(Long id, ProductRequestDto dto);
    ProductResponseDto getProductById(Long id);
    ProductResponseDto getProductBySku(String sku);
    ProductResponseDto getProductBySlug(String slug);
    List<ProductResponseDto> getProductsByCategory(Long categoryId);
    List<ProductResponseDto> getProductsByCategorySlug(String categorySlug);
    List<ProductResponseDto> searchProducts(String keyword);
    List<ProductResponseDto> getAllActiveProducts();
    void deleteProduct(Long id);
}
