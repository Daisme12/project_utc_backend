package com.utc.backend.mapper;

import com.utc.backend.dto.ProductRequestDto;
import com.utc.backend.dto.ProductResponseDto;
import com.utc.backend.entity.Category;
import com.utc.backend.entity.Product;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class ProductMapper {

    private final CategoryMapper categoryMapper;

    public Product toEntity(ProductRequestDto dto, Category category) {
        if (dto == null) {
            return null;
        }
        return Product.builder()
                .category(category)
                .sku(dto.sku())
                .slug(dto.slug() != null ? dto.slug() : dto.sku().toLowerCase())
                .name(dto.name())
                .brand(dto.brand())
                .origin(dto.origin())
                .standard(dto.standard() != null ? dto.standard() : "vietgap")
                .unit(dto.unit())
                .packWeight(dto.packWeight())
                .price(dto.price())
                .originalPrice(dto.originalPrice())
                .stockQuantity(dto.stockQuantity() != null ? dto.stockQuantity() : BigDecimal.ZERO)
                .isWeighing(dto.isWeighing() != null ? dto.isWeighing() : false)
                .rating(BigDecimal.valueOf(5.0))
                .reviewCount(0)
                .imageUrl(dto.imageUrl())
                .isActive(dto.isActive() != null ? dto.isActive() : true)
                .build();
    }

    public void updateEntityFromDto(ProductRequestDto dto, Product product, Category category) {
        if (dto == null || product == null) {
            return;
        }
        if (category != null) {
            product.setCategory(category);
        }
        if (dto.sku() != null) {
            product.setSku(dto.sku());
        }
        if (dto.slug() != null) {
            product.setSlug(dto.slug());
        }
        if (dto.name() != null) {
            product.setName(dto.name());
        }
        if (dto.brand() != null) {
            product.setBrand(dto.brand());
        }
        if (dto.origin() != null) {
            product.setOrigin(dto.origin());
        }
        if (dto.standard() != null) {
            product.setStandard(dto.standard());
        }
        if (dto.unit() != null) {
            product.setUnit(dto.unit());
        }
        if (dto.packWeight() != null) {
            product.setPackWeight(dto.packWeight());
        }
        if (dto.isWeighing() != null) {
            product.setIsWeighing(dto.isWeighing());
        }
        if (dto.price() != null) {
            product.setPrice(dto.price());
        }
        if (dto.originalPrice() != null) {
            product.setOriginalPrice(dto.originalPrice());
        }
        if (dto.stockQuantity() != null) {
            product.setStockQuantity(dto.stockQuantity());
        }
        if (dto.imageUrl() != null) {
            product.setImageUrl(dto.imageUrl());
        }
        if (dto.isActive() != null) {
            product.setIsActive(dto.isActive());
        }
    }

    public ProductResponseDto toResponseDto(Product product) {
        if (product == null) {
            return null;
        }
        return new ProductResponseDto(
                product.getId(),
                categoryMapper.toResponseDto(product.getCategory()),
                product.getSku(),
                product.getSlug(),
                product.getName(),
                product.getBrand(),
                product.getOrigin(),
                product.getStandard(),
                product.getUnit(),
                product.getPackWeight(),
                product.getPrice(),
                product.getOriginalPrice(),
                product.getStockQuantity(),
                product.getIsWeighing(),
                product.getRating(),
                product.getReviewCount(),
                product.getImageUrl(),
                product.getIsActive(),
                product.getCreatedAt()
        );
    }
}
