package com.utc.backend.controller;

import com.utc.backend.common.ApiResponse;
import com.utc.backend.dto.ProductRequestDto;
import com.utc.backend.dto.ProductResponseDto;
import com.utc.backend.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponseDto>> createProduct(@Valid @RequestBody ProductRequestDto dto) {
        ProductResponseDto product = productService.createProduct(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(product, "Tạo sản phẩm mới thành công"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponseDto>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequestDto dto) {
        ProductResponseDto product = productService.updateProduct(id, dto);
        return ResponseEntity.ok(ApiResponse.success(product, "Cập nhật sản phẩm thành công"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponseDto>> getProductById(@PathVariable Long id) {
        ProductResponseDto product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success(product, "Lấy thông tin sản phẩm thành công"));
    }

    @GetMapping("/sku/{sku}")
    public ResponseEntity<ApiResponse<ProductResponseDto>> getProductBySku(@PathVariable String sku) {
        ProductResponseDto product = productService.getProductBySku(sku);
        return ResponseEntity.ok(ApiResponse.success(product, "Lấy thông tin sản phẩm theo mã vạch SKU thành công"));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<ProductResponseDto>> getProductBySlug(@PathVariable String slug) {
        ProductResponseDto product = productService.getProductBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(product, "Lấy thông tin sản phẩm theo slug thành công"));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<List<ProductResponseDto>>> getProductsByCategory(@PathVariable Long categoryId) {
        List<ProductResponseDto> products = productService.getProductsByCategory(categoryId);
        return ResponseEntity.ok(ApiResponse.success(products, "Lấy danh sách sản phẩm theo danh mục thành công"));
    }

    @GetMapping("/category-slug/{categorySlug}")
    public ResponseEntity<ApiResponse<List<ProductResponseDto>>> getProductsByCategorySlug(@PathVariable String categorySlug) {
        List<ProductResponseDto> products = productService.getProductsByCategorySlug(categorySlug);
        return ResponseEntity.ok(ApiResponse.success(products, "Lấy danh sách sản phẩm theo slug danh mục thành công"));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ProductResponseDto>>> searchProducts(@RequestParam("keyword") String keyword) {
        List<ProductResponseDto> products = productService.searchProducts(keyword);
        return ResponseEntity.ok(ApiResponse.success(products, "Tìm kiếm sản phẩm thành công"));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<ProductResponseDto>>> getFeaturedProducts() {
        List<ProductResponseDto> products = productService.getFeaturedProducts();
        return ResponseEntity.ok(ApiResponse.success(products, "Lấy danh sách sản phẩm nổi bật thành công"));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<ApiResponse<List<ProductResponseDto>>> getLowStockProducts(
            @RequestParam(value = "threshold", defaultValue = "60") int threshold) {
        List<ProductResponseDto> products = productService.getLowStockProducts(threshold);
        return ResponseEntity.ok(ApiResponse.success(products, "Lấy danh sách sản phẩm sắp hết hàng thành công"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductResponseDto>>> getAllActiveProducts() {
        List<ProductResponseDto> products = productService.getAllActiveProducts();
        return ResponseEntity.ok(ApiResponse.success(products, "Lấy danh sách tất cả sản phẩm thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("SUCCESS", "Xóa sản phẩm thành công"));
    }
}
